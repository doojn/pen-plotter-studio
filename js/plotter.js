/**
 * Pen Plotter Engine: Hardware Specs, Path Optimization, Diagnostics & SVG Exporter
 */

const PAPER_SIZES = {
  a5: { name: "A5 (148 × 210 mm)", width: 148, height: 210, unit: "mm" },
  a4: { name: "A4 (210 × 297 mm)", width: 210, height: 297, unit: "mm" },
  a3: { name: "A3 (297 × 420 mm)", width: 297, height: 420, unit: "mm" },
  letter: { name: "US Letter (8.5 × 11 in)", width: 215.9, height: 279.4, unit: "mm" },
  square: { name: "Square (200 × 200 mm)", width: 200, height: 200, unit: "mm" },
  postcard: { name: "Postcard (105 × 148 mm)", width: 105, height: 148, unit: "mm" }
};

const PEN_PRESETS = [
  { id: "micron_black", name: "Sakura Micron 0.3mm (Black)", color: "#111827", strokeWidth: 0.3 },
  { id: "gelly_white", name: "Gelly Roll 0.5mm (White Gel)", color: "#f8fafc", strokeWidth: 0.5 },
  { id: "metallic_gold", name: "Metallic Gold Gel 0.4mm", color: "#d97706", strokeWidth: 0.4 },
  { id: "fountain_blue", name: "Prussian Blue Fountain Pen", color: "#1d4ed8", strokeWidth: 0.35 },
  { id: "crimson_red", name: "Vivid Crimson Sharpie", color: "#e11d48", strokeWidth: 0.5 },
  { id: "cyan_fine", name: "Electric Cyan Fine 0.3mm", color: "#06b6d4", strokeWidth: 0.3 }
];

const PAPER_PRESETS = [
  { id: "white", name: "Heavy White Bristol Paper", color: "#fafaf9", texture: "smooth" },
  { id: "cream", name: "Warm Cream Moleskine", color: "#fef3c7", texture: "moleskine" },
  { id: "black", name: "Charcoal Black Heavy Cardstock", color: "#18181b", texture: "rough" },
  { id: "kraft", name: "Natural Kraft Cardboard", color: "#d4b896", texture: "fiber" },
  { id: "indigo", name: "Midnight Blueprint Indigo", color: "#0f172a", texture: "smooth" }
];

class PlotterEngine {
  constructor() {
    this.speedDraw = 45; // mm per sec
    this.speedAir = 85;  // mm per sec
    this.penLiftTime = 0.16; // 160ms servo delay per lift
  }

  // Get printable area taking margins and orientation into account
  getBounds(paperKey, orientation, marginMm) {
    const size = PAPER_SIZES[paperKey] || PAPER_SIZES.a5;
    let pw = size.width;
    let ph = size.height;

    if (orientation === "landscape") {
      const tmp = pw;
      pw = ph;
      ph = tmp;
    }

    const minX = marginMm;
    const minY = marginMm;
    const maxX = pw - marginMm;
    const maxY = ph - marginMm;
    const width = Math.max(10, maxX - minX);
    const height = Math.max(10, maxY - minY);

    return {
      paperWidth: pw,
      paperHeight: ph,
      minX,
      minY,
      maxX,
      maxY,
      width,
      height,
      marginMm
    };
  }

  // Optimize path order using Greedy Nearest-Neighbor TSP + Path Reversal + Smart Stitching (Servo Thermal Protection)
  optimizePaths(paths, options = {}) {
    if (!paths || paths.length <= 1) return paths ? [...paths] : [];

    const stitchThresholdMm = options.stitchThreshold !== undefined ? options.stitchThreshold : 2.0;

    // Clone paths to avoid mutating input
    const pool = paths.map(p => p.map(pt => ({ x: pt.x, y: pt.y })));
    const optimized = [];

    // Start with the path closest to top-left corner
    let bestDist = Infinity;
    let bestIndex = 0;
    let reverseFirst = false;

    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      const startDist = Math.hypot(p[0].x, p[0].y);
      const endDist = Math.hypot(p[p.length - 1].x, p[p.length - 1].y);
      if (startDist < bestDist) {
        bestDist = startDist;
        bestIndex = i;
        reverseFirst = false;
      }
      if (endDist < bestDist) {
        bestDist = endDist;
        bestIndex = i;
        reverseFirst = true;
      }
    }

    let current = pool.splice(bestIndex, 1)[0];
    if (reverseFirst) current.reverse();
    optimized.push(current);

    let curPos = current[current.length - 1];

    // Greedily find closest next path
    while (pool.length > 0) {
      bestDist = Infinity;
      bestIndex = 0;
      let shouldReverse = false;

      for (let i = 0; i < pool.length; i++) {
        const candidate = pool[i];
        const pStart = candidate[0];
        const pEnd = candidate[candidate.length - 1];

        const dStart = Math.hypot(pStart.x - curPos.x, pStart.y - curPos.y);
        const dEnd = Math.hypot(pEnd.x - curPos.x, pEnd.y - curPos.y);

        if (dStart < bestDist) {
          bestDist = dStart;
          bestIndex = i;
          shouldReverse = false;
        }
        if (dEnd < bestDist) {
          bestDist = dEnd;
          bestIndex = i;
          shouldReverse = true;
        }
      }

      const nextPath = pool.splice(bestIndex, 1)[0];
      if (shouldReverse) nextPath.reverse();

      // Thermal Protection: if next path start is very close (<= stitchThresholdMm), stitch without lifting pen
      if (stitchThresholdMm > 0 && bestDist <= stitchThresholdMm) {
        const target = optimized[optimized.length - 1];
        for (let pt of nextPath) {
          target.push(pt);
        }
        curPos = target[target.length - 1];
      } else {
        optimized.push(nextPath);
        curPos = nextPath[nextPath.length - 1];
      }
    }

    return optimized;
  }

  // Calculate plotting statistics (draw distance, air distance, estimated time, and servo duty cycle)
  calculateStats(pathsLayer1, pathsLayer2 = []) {
    let drawDistanceMm = 0;
    let airDistanceMm = 0;
    let totalLifts = 0;

    const allPaths = [...(pathsLayer1 || []), ...(pathsLayer2 || [])];
    if (allPaths.length === 0) {
      return {
        pathCount: 0,
        drawDistanceM: 0,
        airDistanceM: 0,
        totalLifts: 0,
        liftsPerMin: 0,
        servoStatus: "cool",
        estimatedTimeStr: "0s",
        estimatedSeconds: 0
      };
    }

    let lastPos = { x: 0, y: 0 };

    for (let i = 0; i < allPaths.length; i++) {
      const path = allPaths[i];
      if (path.length < 2) continue;

      totalLifts++;
      // Air distance from last position to start of this path
      if (i > 0) {
        airDistanceMm += Math.hypot(path[0].x - lastPos.x, path[0].y - lastPos.y);
      }

      // Drawing distance along the path
      for (let j = 1; j < path.length; j++) {
        drawDistanceMm += Math.hypot(path[j].x - path[j - 1].x, path[j].y - path[j - 1].y);
      }

      lastPos = path[path.length - 1];
    }

    // Time estimate calculation
    const timeDraw = drawDistanceMm / this.speedDraw;
    const timeAir = airDistanceMm / this.speedAir;
    const timeLifts = totalLifts * this.penLiftTime;
    const totalSec = Math.round(timeDraw + timeAir + timeLifts);

    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const estimatedTimeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Servo duty cycle & thermal safety
    const totalMinutes = Math.max(0.1, totalSec / 60);
    const liftsPerMin = Math.round((totalLifts / totalMinutes) * 10) / 10;
    let servoStatus = "cool"; // "cool" (< 25 lifts/min), "warm" (25-50), "hot" (> 50)
    if (liftsPerMin > 45) servoStatus = "hot";
    else if (liftsPerMin > 20) servoStatus = "warm";

    return {
      pathCount: allPaths.length,
      drawDistanceM: (drawDistanceMm / 1000).toFixed(2),
      airDistanceM: (airDistanceMm / 1000).toFixed(2),
      totalLifts,
      liftsPerMin,
      servoStatus,
      estimatedTimeStr,
      estimatedSeconds: totalSec
    };
  }

  // Convert array of points to SVG path 'd' string with precision rounding
  pathToSvgD(path) {
    if (!path || path.length < 2) return "";
    let d = `M ${path[0].x.toFixed(2)} ${path[0].y.toFixed(2)}`;
    for (let i = 1; i < path.length; i++) {
      d += ` L ${path[i].x.toFixed(2)} ${path[i].y.toFixed(2)}`;
    }
    return d;
  }

  // Generate full clean SVG file content with Inkscape layer tags
  generateSVG(bounds, pathsLayer1, pathsLayer2 = [], options = {}) {
    const pw = bounds.paperWidth;
    const ph = bounds.paperHeight;
    const stroke1 = options.color1 || "#000000";
    const stroke2 = options.color2 || "#e11d48";
    const strokeWidth = options.strokeWidth || 0.3;

    let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
    svg += `<!-- Generative Pen Plotter Art - Exported for AxiDraw / Inkscape -->\n`;
    svg += `<!-- Plotter Thermal Guard: Path-Stitching Enabled (<25 lifts/min safe for SG90 servos) -->\n`;
    svg += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n`;
    svg += `     width="${pw}mm" height="${ph}mm" viewBox="0 0 ${pw} ${ph}">\n`;

    // Layer 1
    if (pathsLayer1 && pathsLayer1.length > 0) {
      svg += `  <g inkscape:groupmode="layer" id="layer1" inkscape:label="Layer 1 - Main Pen">\n`;
      pathsLayer1.forEach((p, idx) => {
        const d = this.pathToSvgD(p);
        if (d) {
          svg += `    <path id="path1_${idx}" d="${d}" fill="none" stroke="${stroke1}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />\n`;
        }
      });
      svg += `  </g>\n`;
    }

    // Layer 2
    if (pathsLayer2 && pathsLayer2.length > 0) {
      svg += `  <g inkscape:groupmode="layer" id="layer2" inkscape:label="Layer 2 - Accent Pen">\n`;
      pathsLayer2.forEach((p, idx) => {
        const d = this.pathToSvgD(p);
        if (d) {
          svg += `    <path id="path2_${idx}" d="${d}" fill="none" stroke="${stroke2}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />\n`;
        }
      });
      svg += `  </g>\n`;
    }

    svg += `</svg>\n`;
    return svg;
  }

  // Trigger browser file download for SVG
  downloadSVG(filename, svgString) {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // Copy SVG content directly to clipboard
  async copySVGToClipboard(svgString) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(svgString);
      return true;
    }
    return false;
  }

  // Export high-resolution PNG snapshot of the preview canvas
  downloadPNG(canvas, filename) {
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.PAPER_SIZES = PAPER_SIZES;
window.PEN_PRESETS = PEN_PRESETS;
window.PAPER_PRESETS = PAPER_PRESETS;
window.PlotterEngine = PlotterEngine;
