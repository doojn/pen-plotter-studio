/**
 * Algorithmic Pen Plotter Art Workshop - Core Algorithms Engine
 * Designed for beginners: intuitive parameters, reproducible seeds, and clean vector polylines.
 */

const ALGORITHM_DEFINITIONS = {
  // =========================================================================
  // 1. PERLIN FLOW FIELD
  // =========================================================================
  flowField: {
    id: "flowField",
    name: "Perlin Flow Field",
    category: "Organic / Natural",
    badge: "Most Popular",
    icon: "🌊",
    shortDesc: "Trace hundreds of particles drifting through an invisible fluid river or wind current.",
    explanation: "Imagine dropping dandelion seeds into swirling water. At every point on the paper, a 2D Perlin noise mathematical equation calculates a specific compass direction. We drop virtual particles and let them take small steps following these angles, drawing smooth, hypnotic ribbon currents.",
    beginnerTip: "Try increasing 'Noise Zoom' for broad gentle curves, or decrease it for tight turbulent eddies!",
    codeSnippet: `// Flow field core logic:
const angle = noise(x * scale, y * scale) * Math.PI * 2 * curl;
const nextX = x + Math.cos(angle) * stepLength;
const nextY = y + Math.sin(angle) * stepLength;`,
    parameters: [
      { id: "streamCount", label: "Number of Streams", type: "range", min: 80, max: 350, step: 10, default: 200, unit: "lines", desc: "Total count of stream traces drawn across the page." },
      { id: "stepCount", label: "Stream Length (Steps)", type: "range", min: 20, max: 90, step: 5, default: 55, unit: "steps", desc: "How far each particle travels before lifting the pen." },
      { id: "stepLength", label: "Step Resolution", type: "range", min: 0.8, max: 2.2, step: 0.1, default: 1.4, unit: "mm", desc: "Distance between consecutive points in a line." },
      { id: "noiseScale", label: "Noise Field Zoom", type: "range", min: 0.001, max: 0.025, step: 0.001, default: 0.005, unit: "", desc: "Scale of the noise grid. Smaller values create large calm waves; larger values create turbulent swirls." },
      { id: "curlMultiplier", label: "Swirl / Curl Intensity", type: "range", min: 0.5, max: 5.0, step: 0.1, default: 2.0, unit: "x", desc: "How sharply angles rotate across the field." },
      { id: "spawnMode", label: "Starting Placement", type: "select", options: [
        { value: "random", label: "Random Scatter (Uniform)" },
        { value: "circle", label: "Concentric Ring Burst" },
        { value: "grid", label: "Structured Grid Lattice" },
        { value: "center", label: "Central Core Outward" },
        { value: "edges", label: "Inward from Margins" }
      ], default: "random", desc: "Where particles are initially dropped." },
      { id: "streamAvoidance", label: "Spacing Collision Avoidance", type: "range", min: 0, max: 4.0, step: 0.2, default: 1.8, unit: "mm", desc: "Stops streams if they get too close to existing lines (prevents ink puddles on thin paper). 0 disables." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Accent)", type: "checkbox", default: false, desc: "Splits streams into two layers for 2-color plotting (e.g. Black + Gold)." }
    ],
    presets: {
      "Ocean Currents": { streamCount: 200, stepCount: 55, stepLength: 1.4, noiseScale: 0.004, curlMultiplier: 1.8, spawnMode: "random", streamAvoidance: 1.8, dualColorAccent: false },
      "Turbulent Vortex": { streamCount: 240, stepCount: 50, stepLength: 1.2, noiseScale: 0.012, curlMultiplier: 3.5, spawnMode: "random", streamAvoidance: 1.5, dualColorAccent: true },
      "Cosmic Ripple": { streamCount: 170, stepCount: 60, stepLength: 1.3, noiseScale: 0.006, curlMultiplier: 2.2, spawnMode: "circle", streamAvoidance: 1.6, dualColorAccent: true },
      "Wood Grain Flow": { streamCount: 260, stepCount: 50, stepLength: 1.4, noiseScale: 0.003, curlMultiplier: 1.2, spawnMode: "edges", streamAvoidance: 2.0, dualColorAccent: false },
      "Lattice Drift": { streamCount: 160, stepCount: 45, stepLength: 1.5, noiseScale: 0.008, curlMultiplier: 1.8, spawnMode: "grid", streamAvoidance: 1.6, dualColorAccent: false }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, maxX, maxY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      // Spatial grid for fast proximity / line avoidance check
      const cellSize = Math.max(2, params.streamAvoidance || 1.5);
      const gridCols = Math.ceil(width / cellSize);
      const gridRows = Math.ceil(height / cellSize);
      const grid = new Uint8Array(gridCols * gridRows);

      function markOccupied(x, y) {
        if (params.streamAvoidance <= 0) return;
        const col = Math.floor((x - minX) / cellSize);
        const row = Math.floor((y - minY) / cellSize);
        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
          grid[row * gridCols + col] = 1;
        }
      }

      function isOccupied(x, y) {
        if (params.streamAvoidance <= 0) return false;
        const col = Math.floor((x - minX) / cellSize);
        const row = Math.floor((y - minY) / cellSize);
        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
          return grid[row * gridCols + col] === 1;
        }
        return false;
      }

      const totalStreams = params.streamCount;
      const stepLength = params.stepLength;
      const maxSteps = params.stepCount;
      const scale = params.noiseScale;
      const curl = params.curlMultiplier;

      // Seed points based on spawn mode
      const spawnPoints = [];
      for (let i = 0; i < totalStreams; i++) {
        let sx, sy;
        if (params.spawnMode === "random") {
          sx = rng.range(minX, maxX);
          sy = rng.range(minY, maxY);
        } else if (params.spawnMode === "circle") {
          const r = rng.range(width * 0.1, width * 0.45);
          const theta = rng.range(0, Math.PI * 2);
          sx = minX + width * 0.5 + Math.cos(theta) * r;
          sy = minY + height * 0.5 + Math.sin(theta) * r;
        } else if (params.spawnMode === "grid") {
          const side = Math.ceil(Math.sqrt(totalStreams));
          const col = i % side;
          const row = Math.floor(i / side);
          sx = minX + (col / side) * width + rng.range(-2, 2);
          sy = minY + (row / side) * height + rng.range(-2, 2);
        } else if (params.spawnMode === "center") {
          const r = rng.range(0, width * 0.18);
          const theta = rng.range(0, Math.PI * 2);
          sx = minX + width * 0.5 + Math.cos(theta) * r;
          sy = minY + height * 0.5 + Math.sin(theta) * r;
        } else if (params.spawnMode === "edges") {
          if (rng.chance(0.5)) {
            sx = rng.chance(0.5) ? minX + 2 : maxX - 2;
            sy = rng.range(minY, maxY);
          } else {
            sx = rng.range(minX, maxX);
            sy = rng.chance(0.5) ? minY + 2 : maxY - 2;
          }
        }
        spawnPoints.push({ x: sx, y: sy, id: i });
      }

      // Generate streams
      spawnPoints.forEach((pt, idx) => {
        let cx = pt.x;
        let cy = pt.y;

        // Skip if starting point is already crowded
        if (isOccupied(cx, cy)) return;

        const path = [{ x: cx, y: cy }];
        markOccupied(cx, cy);

        for (let s = 0; s < maxSteps; s++) {
          // Calculate noise angle
          const n = noise.noise2D(cx * scale, cy * scale);
          const angle = n * Math.PI * curl;

          const nx = cx + Math.cos(angle) * stepLength;
          const ny = cy + Math.sin(angle) * stepLength;

          // Boundary check
          if (nx < minX || nx > maxX || ny < minY || ny > maxY) break;

          // Proximity avoidance check
          if (s > 2 && isOccupied(nx, ny)) break;

          path.push({ x: nx, y: ny });
          markOccupied(nx, ny);
          cx = nx;
          cy = ny;
        }

        if (path.length >= 3) {
          if (params.dualColorAccent && idx % 3 === 0) {
            pathsLayer2.push(path);
          } else {
            pathsLayer1.push(path);
          }
        }
      });

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 2. TOPOGRAPHIC RIDGE WAVES (JOY DIVISION / UNKNOWN PLEASURES)
  // =========================================================================
  waveRidges: {
    id: "waveRidges",
    name: "Mountain Ridge Waves",
    category: "Topographic / 3D Landscape",
    badge: "Iconic Classic",
    icon: "🏔️",
    shortDesc: "Stacked horizontal scanlines with 3D peaks and authentic hidden-line occlusion.",
    explanation: "Inspired by the famous 1979 radio pulsar plot from Joy Division's album 'Unknown Pleasures'. Horizontal lines sweep down the page. As they approach the center, a Gaussian bell curve combined with Perlin noise pulls the line upwards into mountain peaks. Crucially, a 'horizon mask' prevents lower lines from drawing over peaks above them, creating a solid 3D landscape effect!",
    beginnerTip: "Keep 'Occlusion' turned ON! Without occlusion, the lines will criss-cross. With occlusion on, mountains appear completely solid without any solid fills.",
    codeSnippet: `// 3D elevation & occlusion mask:
const elevation = Math.exp(-Math.pow((x - centerX) / width, 2)) * noise(x, y) * peakHeight;
const finalY = baseY - elevation;
// If finalY is lower than previous horizon, occlude it!`,
    parameters: [
      { id: "lineCount", label: "Number of Ridges", type: "range", min: 15, max: 55, step: 1, default: 35, unit: "lines", desc: "Total count of stacked horizontal wave lines." },
      { id: "peakHeight", label: "Peak Elevation Height", type: "range", min: 4, max: 40, step: 1, default: 22, unit: "mm", desc: "Maximum height of the mountain peaks." },
      { id: "samplesPerLine", label: "Curve Smoothness", type: "range", min: 80, max: 240, step: 10, default: 180, unit: "pts", desc: "Number of evaluated sample points per ridge line." },
      { id: "noiseScale", label: "Mountain Ruggedness", type: "range", min: 0.005, max: 0.05, step: 0.002, default: 0.016, unit: "", desc: "Frequency of jagged bumps. Low is smooth hills; high is rugged peaks." },
      { id: "gaussianWidth", label: "Mountain Peak Width", type: "range", min: 0.15, max: 0.85, step: 0.05, default: 0.38, unit: "", desc: "Width of the central peak concentration area." },
      { id: "occlusion", label: "3D Hidden-Line Occlusion", type: "checkbox", default: true, desc: "Hides lines behind foreground peaks so the landscape looks 3D and solid." },
      { id: "ridgeNoiseOctaves", label: "Multi-Octave Detail", type: "range", min: 1, max: 3, step: 1, default: 2, unit: "octaves", desc: "Adds fine secondary ridges on top of the main peaks." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Peaks)", type: "checkbox", default: false, desc: "Draws peaks in Pen 2 and flat valley baselines in Pen 1." }
    ],
    presets: {
      "Joy Division Classic": { lineCount: 38, peakHeight: 22, samplesPerLine: 180, noiseScale: 0.018, gaussianWidth: 0.35, occlusion: true, ridgeNoiseOctaves: 2, dualColorAccent: false },
      "Alpine Horizon": { lineCount: 30, peakHeight: 28, samplesPerLine: 200, noiseScale: 0.025, gaussianWidth: 0.55, occlusion: true, ridgeNoiseOctaves: 3, dualColorAccent: true },
      "Desert Sand Dunes": { lineCount: 42, peakHeight: 14, samplesPerLine: 160, noiseScale: 0.008, gaussianWidth: 0.70, occlusion: true, ridgeNoiseOctaves: 1, dualColorAccent: false },
      "Audio Frequency Spectrogram": { lineCount: 45, peakHeight: 24, samplesPerLine: 200, noiseScale: 0.035, gaussianWidth: 0.45, occlusion: true, ridgeNoiseOctaves: 2, dualColorAccent: false },
      "Transparent Wireframe (No Occlude)": { lineCount: 25, peakHeight: 18, samplesPerLine: 150, noiseScale: 0.015, gaussianWidth: 0.40, occlusion: false, ridgeNoiseOctaves: 2, dualColorAccent: false }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, maxX, maxY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const lineCount = params.lineCount;
      const samples = params.samplesPerLine;
      const peakHeight = params.peakHeight;
      const noiseScale = params.noiseScale;
      const gWidth = params.gaussianWidth * width * 0.5;
      const centerX = minX + width * 0.5;

      const yStep = (maxY - minY - peakHeight) / (lineCount + 1);
      const startY = minY + peakHeight + yStep;

      // Horizon buffer for hidden-line removal: stores the minimum (highest on page) Y seen so far at each X column
      const horizonResolution = Math.max(samples * 2, 600);
      const horizon = new Float32Array(horizonResolution).fill(Infinity);

      // Iterate front-to-back (bottom ridge to top ridge) for accurate hidden-line removal
      let continuousNoOccludePath = [];

      for (let l = lineCount - 1; l >= 0; l--) {
        const baseY = startY + l * yStep;
        const isReverse = ((lineCount - 1 - l) % 2 === 1); // alternate left-to-right, right-to-left
        let currentPath = [];

        for (let s = 0; s <= samples; s++) {
          const stepIdx = isReverse ? (samples - s) : s;
          const t = stepIdx / samples;
          const x = minX + t * width;

          // Gaussian bell envelope centered in middle of page
          const distFromCenter = x - centerX;
          const envelope = Math.exp(-0.5 * Math.pow(distFromCenter / gWidth, 2));

          // Multi-octave Perlin elevation
          let n = noise.fBm(x * noiseScale, l * 0.15, params.ridgeNoiseOctaves, 0.5, 2.0);
          n = Math.abs(n); // make ridges project upwards

          const elevation = envelope * n * peakHeight;
          const y = baseY - elevation;

          const hIdx = Math.min(horizonResolution - 1, Math.floor(t * (horizonResolution - 1)));

          if (!params.occlusion) {
            // No occlusion: add to continuous serpentine stroke
            if (!params.dualColorAccent) {
              continuousNoOccludePath.push({ x, y });
            } else {
              currentPath.push({ x, y });
            }
          } else {
            // Point is visible if it rises higher (lower Y) than foreground horizon
            const isVisible = y <= horizon[hIdx];

            if (isVisible) {
              currentPath.push({ x, y });
              horizon[hIdx] = y;
            } else {
              // Line dipped behind a foreground ridge: break path!
              if (currentPath.length >= 2) {
                if (params.dualColorAccent && l % 2 === 1) {
                  pathsLayer2.push(currentPath);
                } else {
                  pathsLayer1.push(currentPath);
                }
              }
              currentPath = [];
            }
          }
        }

        if (params.occlusion || params.dualColorAccent) {
          if (currentPath.length >= 2) {
            if (params.dualColorAccent && l % 2 === 1) {
              pathsLayer2.push(currentPath);
            } else {
              pathsLayer1.push(currentPath);
            }
          }
        }
      }

      if (!params.occlusion && !params.dualColorAccent && continuousNoOccludePath.length >= 2) {
        pathsLayer1.push(continuousNoOccludePath);
      }

      // Reverse order so top-to-bottom draw order is preserved if desired
      pathsLayer1.reverse();
      pathsLayer2.reverse();

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 3. HARMONOGRAPH & SPIROGRAPH / GUILLOCHÉ
  // =========================================================================
  harmonograph: {
    id: "harmonograph",
    name: "Harmonograph & Spirograph",
    category: "Geometric & Mathematical",
    badge: "Hypnotic Math",
    icon: "♾️",
    shortDesc: "Simulate swinging physical pendulums, gear spirographs, and currency guilloché rosettes.",
    explanation: "A Harmonograph simulates the motion of several swinging pendulums coupled together. As gravity and friction gently dampen the swings over time, the pen traces intricate, hypnotic loops of pure harmonic geometry that can never be drawn cleanly by human hand.",
    beginnerTip: "Change 'Frequency Ratio' to integer fractions like 3:2, 5:4, or 4:3 to see recognizable musical harmonics in visual form!",
    codeSnippet: `// Pendulum harmonic resonance:
x = A1 * sin(f1 * t + p1) * exp(-d1 * t) + A2 * sin(f2 * t + p2) * exp(-d2 * t);
y = A3 * sin(f3 * t + p3) * exp(-d3 * t) + A4 * sin(f4 * t + p4) * exp(-d4 * t);`,
    parameters: [
      { id: "geometryMode", label: "Model Type", type: "select", options: [
        { value: "harmonograph", label: "Harmonograph (Damped Pendulums)" },
        { value: "spirograph", label: "Spirograph (Hypotrochoid Gears)" },
        { value: "guilloche", label: "Guilloché (Banknote Rosettes)" }
      ], default: "harmonograph", desc: "Select the underlying mathematical generator." },
      { id: "freqX", label: "X-Axis Frequency", type: "range", min: 1.0, max: 8.0, step: 0.01, default: 2.01, unit: "Hz", desc: "Primary oscillation frequency for horizontal motion." },
      { id: "freqY", label: "Y-Axis Frequency", type: "range", min: 1.0, max: 8.0, step: 0.01, default: 3.00, unit: "Hz", desc: "Primary oscillation frequency for vertical motion." },
      { id: "phaseShift", label: "Phase Shift", type: "range", min: 0, max: 360, step: 5, default: 45, unit: "°", desc: "Angular offset between pendulum swings." },
      { id: "damping", label: "Pendulum Friction (Decay)", type: "range", min: 0.0004, max: 0.006, step: 0.0002, default: 0.0022, unit: "", desc: "How quickly the pendulum loses energy as it spirals inward." },
      { id: "loopCount", label: "Drawing Duration / Detail", type: "range", min: 1200, max: 4000, step: 200, default: 2000, unit: "steps", desc: "Total number of steps evaluated along the curve." },
      { id: "secondaryFreq", label: "Secondary Oscillation", type: "range", min: 0, max: 6.0, step: 0.1, default: 1.0, unit: "x", desc: "Adds a second coupled pendulum arm for richer geometric folds." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Mirror)", type: "checkbox", default: false, desc: "Adds a second phase-inverted curve on Layer 2 for stunning 2-pen interference." }
    ],
    presets: {
      "Pendulum Waltz": { geometryMode: "harmonograph", freqX: 2.01, freqY: 3.00, phaseShift: 45, damping: 0.0022, loopCount: 2000, secondaryFreq: 1.0, dualColorAccent: false },
      "Hypnotic Spirograph": { geometryMode: "spirograph", freqX: 3.0, freqY: 7.0, phaseShift: 90, damping: 0.0008, loopCount: 3200, secondaryFreq: 2.5, dualColorAccent: true },
      "Banknote Rosette": { geometryMode: "guilloche", freqX: 4.0, freqY: 4.0, phaseShift: 0, damping: 0.0010, loopCount: 3400, secondaryFreq: 8.0, dualColorAccent: true },
      "Infinity Resonance": { geometryMode: "harmonograph", freqX: 2.00, freqY: 1.002, phaseShift: 90, damping: 0.0016, loopCount: 2600, secondaryFreq: 0.5, dualColorAccent: false },
      "Sacred Geometry": { geometryMode: "guilloche", freqX: 6.0, freqY: 6.0, phaseShift: 30, damping: 0.0012, loopCount: 3600, secondaryFreq: 12.0, dualColorAccent: false }
    },
    generate(bounds, params, rng) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const cx = minX + width * 0.5;
      const cy = minY + height * 0.5;
      const radiusX = width * 0.44;
      const radiusY = height * 0.44;

      const f1 = params.freqX;
      const f2 = params.freqY;
      const p1 = MathUtils.radians(params.phaseShift);
      const d = params.damping;
      const steps = params.loopCount;
      const secF = params.secondaryFreq;

      if (params.geometryMode === "harmonograph") {
        const path1 = [];
        const path2 = [];
        const dt = 0.03;

        for (let i = 0; i < steps; i++) {
          const t = i * dt;
          const decay = Math.exp(-d * t);

          const x = cx + radiusX * decay * (Math.sin(f1 * t + p1) + 0.3 * Math.sin(f1 * secF * t));
          const y = cy + radiusY * decay * (Math.sin(f2 * t) + 0.3 * Math.sin(f2 * secF * t + p1));

          path1.push({ x, y });

          if (params.dualColorAccent) {
            const x2 = cx + radiusX * decay * (Math.sin(f1 * t + p1 + Math.PI * 0.5) + 0.3 * Math.sin(f1 * secF * t));
            const y2 = cy + radiusY * decay * (Math.sin(f2 * t + Math.PI * 0.5) + 0.3 * Math.sin(f2 * secF * t));
            path2.push({ x: x2, y: y2 });
          }
        }

        if (path1.length >= 2) pathsLayer1.push(path1);
        if (params.dualColorAccent && path2.length >= 2) pathsLayer2.push(path2);

      } else if (params.geometryMode === "spirograph") {
        // Hypotrochoid spirograph
        const R = Math.min(radiusX, radiusY);
        const r = R * (params.freqX / (params.freqX + params.freqY));
        const dOffset = r * (params.secondaryFreq || 1.2);
        const path1 = [];
        const maxTheta = Math.PI * 2 * (params.freqY || 7);
        const dt = maxTheta / steps;

        for (let theta = 0; theta <= maxTheta; theta += dt) {
          const x = cx + (R - r) * Math.cos(theta) + dOffset * Math.cos(((R - r) / r) * theta);
          const y = cy + (R - r) * Math.sin(theta) - dOffset * Math.sin(((R - r) / r) * theta);
          path1.push({ x, y });
        }

        if (path1.length >= 2) pathsLayer1.push(path1);

      } else if (params.geometryMode === "guilloche") {
        // Guilloché concentric rosettes
        const rings = 12;
        const ptsPerRing = Math.floor(steps / rings);

        for (let r = 0; r < rings; r++) {
          const ringPath = [];
          const baseR = MathUtils.map(r, 0, rings - 1, radiusX * 0.2, radiusX);
          const waveAmp = (radiusX / rings) * 0.8;
          const petalCount = Math.floor(params.freqX * 4 + r * 2);

          for (let p = 0; p <= ptsPerRing; p++) {
            const theta = (p / ptsPerRing) * Math.PI * 2;
            const modulation = Math.sin(theta * petalCount + r * params.phaseShift * 0.1) * waveAmp;
            const currR = baseR + modulation;
            const x = cx + Math.cos(theta) * currR;
            const y = cy + Math.sin(theta) * currR * (height / width);
            ringPath.push({ x, y });
          }

          if (r % 2 === 1 && params.dualColorAccent) {
            pathsLayer2.push(ringPath);
          } else {
            pathsLayer1.push(ringPath);
          }
        }
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 4. TRUCHET & MODULAR GRID TILES
  // =========================================================================
  truchetTiles: {
    id: "truchetTiles",
    name: "Truchet Modular Tiles",
    category: "Geometric & Pattern",
    badge: "Endless Mazes",
    icon: "🧩",
    shortDesc: "Grid-based tiles with rotating quarter-circles that snap together into winding labyrinths.",
    explanation: "Invented by Sébastien Truchet in 1704 and popularized by Cyril Stanley Smith. Each square tile contains simple arcs connecting the centers of its edges. By randomly rotating tiles by 0° or 90°, the arcs automatically join to form continuous, mesmerizing, flowing labyrinths with zero dead ends.",
    beginnerTip: "Increase 'Arcs per Tile' to turn single lines into thick decorative multi-track highway ribbons!",
    codeSnippet: `// Truchet tile connection rule:
if (rotation === 0) {
  drawArc(topLeft, radius);
  drawArc(bottomRight, radius);
} else {
  drawArc(topRight, radius);
  drawArc(bottomLeft, radius);
}`,
    parameters: [
      { id: "gridCols", label: "Grid Columns", type: "range", min: 4, max: 16, step: 1, default: 10, unit: "cols", desc: "Number of horizontal tile cells." },
      { id: "tileStyle", label: "Tile Motif", type: "select", options: [
        { value: "arcs", label: "Smith Curved Arcs (Flowing Maze)" },
        { value: "diagonal", label: "Diagonal Slash (Straight Maze)" },
        { value: "triangles", label: "Chevron & Diamond Triangles" },
        { value: "meander", label: "Orthogonal Meanders (Circuit Board)" }
      ], default: "arcs", desc: "Geometric pattern placed inside each tile." },
      { id: "arcsPerTile", label: "Concentric Arcs per Tile", type: "range", min: 1, max: 3, step: 1, default: 2, unit: "tracks", desc: "Draws parallel concentric ribbons for dense line quality." },
      { id: "rotationRule", label: "Rotation Rule", type: "select", options: [
        { value: "random", label: "Random 50/50 Coin Flip" },
        { value: "noise", label: "Perlin Noise Directional Flow" },
        { value: "checkerboard", label: "Alternating Checkerboard" },
        { value: "concentric", label: "Concentric Rings Orientation" }
      ], default: "random", desc: "Determines how tile rotation is decided." },
      { id: "cornerPadding", label: "Tile Margin Gap", type: "range", min: 0, max: 4, step: 0.5, default: 0, unit: "mm", desc: "Leaves tiny gaps between tiles for an etched tile look." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Checker)", type: "checkbox", default: false, desc: "Draws alternate tiles in Pen 2 for dual-ink geometric plots." }
    ],
    presets: {
      "Woven Ribbon Labyrinth": { gridCols: 10, tileStyle: "arcs", arcsPerTile: 2, rotationRule: "random", cornerPadding: 0, dualColorAccent: false },
      "Circuit Board Maze": { gridCols: 12, tileStyle: "meander", arcsPerTile: 1, rotationRule: "noise", cornerPadding: 0.5, dualColorAccent: true },
      "Diagonal Slash Network": { gridCols: 12, tileStyle: "diagonal", arcsPerTile: 1, rotationRule: "random", cornerPadding: 0, dualColorAccent: false },
      "Optical Ripple Grid": { gridCols: 11, tileStyle: "arcs", arcsPerTile: 2, rotationRule: "concentric", cornerPadding: 0, dualColorAccent: true },
      "Smooth Minimal Arcs": { gridCols: 7, tileStyle: "arcs", arcsPerTile: 1, rotationRule: "random", cornerPadding: 0, dualColorAccent: false }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const cols = params.gridCols;
      const tileSize = width / cols;
      const rows = Math.floor(height / tileSize);
      const startX = minX;
      const startY = minY + (height - rows * tileSize) * 0.5;

      const arcsCount = params.arcsPerTile;
      const segmentsPerArc = 18;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = startX + c * tileSize;
          const y0 = startY + r * tileSize;
          const isPen2 = params.dualColorAccent && (r + c) % 2 === 1;
          const targetLayer = isPen2 ? pathsLayer2 : pathsLayer1;

          // Determine rotation (0 or 1)
          let rot = 0;
          if (params.rotationRule === "random") {
            rot = rng.chance(0.5) ? 0 : 1;
          } else if (params.rotationRule === "checkerboard") {
            rot = (r + c) % 2 === 0 ? 0 : 1;
          } else if (params.rotationRule === "noise") {
            rot = noise.noise2D(c * 0.2, r * 0.2) > 0 ? 1 : 0;
          } else if (params.rotationRule === "concentric") {
            const dx = c - cols * 0.5;
            const dy = r - rows * 0.5;
            rot = Math.floor(Math.hypot(dx, dy)) % 2 === 0 ? 1 : 0;
          }

          if (params.tileStyle === "arcs") {
            // Smith quarter circles with complementary matching radii for continuous ribbon stitching
            for (let a = 1; a <= arcsCount; a++) {
              const rTL = (tileSize / (arcsCount + 1)) * a;
              const rBR = tileSize - rTL;

              if (rot === 0) {
                // Top-Left corner arc
                const arc1 = [];
                for (let s = 0; s <= segmentsPerArc; s++) {
                  const th = (s / segmentsPerArc) * (Math.PI * 0.5);
                  arc1.push({ x: x0 + Math.cos(th) * rTL, y: y0 + Math.sin(th) * rTL });
                }
                targetLayer.push(arc1);

                // Bottom-Right corner arc (matched to neighbor)
                const arc2 = [];
                for (let s = 0; s <= segmentsPerArc; s++) {
                  const th = Math.PI + (s / segmentsPerArc) * (Math.PI * 0.5);
                  arc2.push({ x: x0 + tileSize + Math.cos(th) * rBR, y: y0 + tileSize + Math.sin(th) * rBR });
                }
                targetLayer.push(arc2);
              } else {
                // Top-Right corner arc
                const arc1 = [];
                for (let s = 0; s <= segmentsPerArc; s++) {
                  const th = Math.PI * 0.5 + (s / segmentsPerArc) * (Math.PI * 0.5);
                  arc1.push({ x: x0 + tileSize + Math.cos(th) * rTL, y: y0 + Math.sin(th) * rTL });
                }
                targetLayer.push(arc1);

                // Bottom-Left corner arc (matched to neighbor)
                const arc2 = [];
                for (let s = 0; s <= segmentsPerArc; s++) {
                  const th = Math.PI * 1.5 + (s / segmentsPerArc) * (Math.PI * 0.5);
                  arc2.push({ x: x0 + Math.cos(th) * rBR, y: y0 + tileSize + Math.sin(th) * rBR });
                }
                targetLayer.push(arc2);
              }
            }

          } else if (params.tileStyle === "diagonal") {
            // Diagonal maze slashes
            for (let a = 0; a < arcsCount; a++) {
              const offset = (a - (arcsCount - 1) / 2) * (tileSize * 0.15);
              if (rot === 0) {
                targetLayer.push([
                  { x: x0, y: y0 + tileSize + offset },
                  { x: x0 + tileSize + offset, y: y0 }
                ]);
              } else {
                targetLayer.push([
                  { x: x0, y: y0 + offset },
                  { x: x0 + tileSize, y: y0 + tileSize + offset }
                ]);
              }
            }

          } else if (params.tileStyle === "meander") {
            // Circuit board orthogonal steps
            const midX = x0 + tileSize * 0.5;
            const midY = y0 + tileSize * 0.5;
            if (rot === 0) {
              targetLayer.push([
                { x: x0, y: midY },
                { x: midX, y: midY },
                { x: midX, y: y0 }
              ]);
              targetLayer.push([
                { x: x0 + tileSize, y: midY },
                { x: midX, y: midY },
                { x: midX, y: y0 + tileSize }
              ]);
            } else {
              targetLayer.push([
                { x: midX, y: y0 },
                { x: midX, y: midY },
                { x: x0 + tileSize, y: midY }
              ]);
              targetLayer.push([
                { x: midX, y: y0 + tileSize },
                { x: midX, y: midY },
                { x: x0, y: midY }
              ]);
            }

          } else if (params.tileStyle === "triangles") {
            // Chevron triangles
            if (rot === 0) {
              targetLayer.push([
                { x: x0, y: y0 },
                { x: x0 + tileSize * 0.5, y: y0 + tileSize * 0.5 },
                { x: x0 + tileSize, y: y0 }
              ]);
              targetLayer.push([
                { x: x0, y: y0 + tileSize },
                { x: x0 + tileSize * 0.5, y: y0 + tileSize * 0.5 },
                { x: x0 + tileSize, y: y0 + tileSize }
              ]);
            } else {
              targetLayer.push([
                { x: x0, y: y0 },
                { x: x0 + tileSize * 0.5, y: y0 + tileSize * 0.5 },
                { x: x0, y: y0 + tileSize }
              ]);
              targetLayer.push([
                { x: x0 + tileSize, y: y0 },
                { x: x0 + tileSize * 0.5, y: y0 + tileSize * 0.5 },
                { x: x0 + tileSize, y: y0 + tileSize }
              ]);
            }
          }
        }
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 5. CONCENTRIC INTERFERENCE & MOIRÉ CIRCLES
  // =========================================================================
  concentricMoire: {
    id: "concentricMoire",
    name: "Concentric Moiré & Ripples",
    category: "Optical & Interference",
    badge: "Optical Magic",
    icon: "🎯",
    shortDesc: "Multiple overlapping ripple centers that generate mesmerizing physical Moiré patterns.",
    explanation: "When two or more sets of high-density concentric rings overlap, the human eye perceives third-order geometric interference patterns called 'Moiré'. On a pen plotter, these thin vector lines produce unbelievable optical depth and illusion of movement on paper.",
    beginnerTip: "Keep 'Ring Spacing' between 1mm and 2mm to get the most dramatic Moiré optical illusions!",
    codeSnippet: `// Distance ripple interference:
const d1 = Math.hypot(x - center1.x, y - center1.y);
const d2 = Math.hypot(x - center2.x, y - center2.y);
const radiusWobble = noise(cos(theta), sin(theta)) * warpAmp;`,
    parameters: [
      { id: "centerCount", label: "Number of Wave Centers", type: "range", min: 2, max: 4, step: 1, default: 2, unit: "centers", desc: "How many interfering ripple sources are placed." },
      { id: "ringCount", label: "Rings per Center", type: "range", min: 12, max: 34, step: 1, default: 22, unit: "rings", desc: "Density of concentric circles radiating outward." },
      { id: "ringSpacing", label: "Ring Spacing (mm)", type: "range", min: 1.8, max: 5.0, step: 0.1, default: 2.6, unit: "mm", desc: "Distance between consecutive concentric circles (kept safe for thin paper)." },
      { id: "noiseWobble", label: "Organic Warp / Wobble", type: "range", min: 0, max: 12, step: 0.5, default: 0, unit: "mm", desc: "Distorts clean circles into organic tree rings or ripple waves." },
      { id: "interlaceLayers", label: "Separate Centers to Layer 2", type: "checkbox", default: true, desc: "Assigns Center 1 to Pen 1 and Center 2 to Pen 2 for stunning 2-color moiré." },
      { id: "clipBoundary", label: "Clip to Margins", type: "checkbox", default: true, desc: "Cuts lines cleanly at paper margins." }
    ],
    presets: {
      "Dual Moiré Interference": { centerCount: 2, ringCount: 24, ringSpacing: 2.6, noiseWobble: 0, interlaceLayers: true, clipBoundary: true },
      "Triple Harmonic Echo": { centerCount: 3, ringCount: 18, ringSpacing: 2.8, noiseWobble: 0, interlaceLayers: true, clipBoundary: true },
      "Organic Tree Cross-Section": { centerCount: 1, ringCount: 28, ringSpacing: 2.2, noiseWobble: 6.0, interlaceLayers: false, clipBoundary: true },
      "Pond Rain Drops": { centerCount: 3, ringCount: 15, ringSpacing: 3.0, noiseWobble: 1.5, interlaceLayers: true, clipBoundary: true },
      "Hypnotic Lens": { centerCount: 2, ringCount: 26, ringSpacing: 2.4, noiseWobble: 0, interlaceLayers: false, clipBoundary: true }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, maxX, maxY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const centers = [];
      const count = params.centerCount;
      const cx = minX + width * 0.5;
      const cy = minY + height * 0.5;

      if (count === 1) {
        centers.push({ x: cx, y: cy });
      } else if (count === 2) {
        const offset = width * 0.16;
        centers.push({ x: cx - offset, y: cy });
        centers.push({ x: cx + offset, y: cy });
      } else if (count === 3) {
        const r = width * 0.18;
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 - Math.PI * 0.5;
          centers.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
        }
      } else {
        const r = width * 0.22;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          centers.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
        }
      }

      const ringCount = params.ringCount;
      const spacing = params.ringSpacing;
      const wobble = params.noiseWobble;
      const samples = 140;

      centers.forEach((center, cIdx) => {
        const targetLayer = (params.interlaceLayers && cIdx % 2 === 1) ? pathsLayer2 : pathsLayer1;

        for (let r = 1; r <= ringCount; r++) {
          const baseRadius = r * spacing;
          let currentPath = [];

          for (let s = 0; s <= samples; s++) {
            const theta = (s / samples) * Math.PI * 2;
            let currentRadius = baseRadius;

            if (wobble > 0) {
              const nx = Math.cos(theta) * 1.5;
              const ny = Math.sin(theta) * 1.5;
              const n = noise.noise2D(nx + cIdx * 10, ny + r * 0.08);
              currentRadius += n * wobble;
            }

            const x = center.x + Math.cos(theta) * currentRadius;
            const y = center.y + Math.sin(theta) * currentRadius;

            if (params.clipBoundary) {
              const inBounds = x >= minX && x <= maxX && y >= minY && y <= maxY;
              if (inBounds) {
                currentPath.push({ x, y });
              } else {
                if (currentPath.length >= 2) targetLayer.push(currentPath);
                currentPath = [];
              }
            } else {
              currentPath.push({ x, y });
            }
          }

          if (currentPath.length >= 2) targetLayer.push(currentPath);
        }
      });

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 6. DISTORTED SPIRALS & VORTEX
  // =========================================================================
  spirals: {
    id: "spirals",
    name: "Distorted Spirals & Vortex",
    category: "Spirals & Geometry",
    badge: "Hypnotic Coil",
    icon: "🌀",
    shortDesc: "Mathematically perfect Archimedean spiral with optional algorithmic wave & noise distortion.",
    explanation: "Begins as a flawless, mathematically perfect Archimedean spiral with exact uniform spacing between every coil. You can dial in algorithmic distortion (organic noise, sinusoidal ripples, or vortex swirls) to watch pure geometry smoothly deform into organic nature!",
    beginnerTip: "Start with 0 distortion to see a perfect Zen spiral, then gently move the distortion slider to watch it ripple!",
    codeSnippet: `// Pure Archimedean spiral:
const r = (theta / maxTheta) * maxRadius + algorithmicDistortion;
const x = centerX + Math.cos(theta) * r;
const y = centerY + Math.sin(theta) * r;`,
    parameters: [
      { id: "turns", label: "Spiral Turns (Revolutions)", type: "range", min: 6, max: 32, step: 1, default: 20, unit: "turns", desc: "How many concentric coils the spiral wraps around the center." },
      { id: "distortionAmount", label: "Algorithmic Distortion", type: "range", min: 0, max: 20, step: 0.5, default: 0.0, unit: "mm", desc: "0 = mathematically perfect pure spiral. Increase to add organic ripples and waves." },
      { id: "distortionMode", label: "Distortion Algorithm", type: "select", options: [
        { value: "pure", label: "Pure Perfect Spiral (0 Distortion)" },
        { value: "organic", label: "Organic Noise (Fingerprint / Tree Rings)" },
        { value: "waves", label: "Harmonic Waves (Petal Rosette)" },
        { value: "vortex", label: "Galactic Vortex Swirl" }
      ], default: "pure", desc: "The mathematical rule used to deform the spiral." },
      { id: "distortionFreq", label: "Distortion Frequency", type: "range", min: 2, max: 24, step: 1, default: 8, unit: "", desc: "Number of ripples along each spiral turn." },
      { id: "dualSpiral", label: "Dual Intertwined Spirals", type: "checkbox", default: false, desc: "Draws two complementary intertwined spiral arms for 2-pen plotting." }
    ],
    presets: {
      "Pure Geometric Spiral": { turns: 20, distortionAmount: 0.0, distortionMode: "pure", distortionFreq: 6, dualSpiral: false },
      "Organic Fingerprint Whorl": { turns: 24, distortionAmount: 6.0, distortionMode: "organic", distortionFreq: 8, dualSpiral: false },
      "Flower Rosette Spiral": { turns: 18, distortionAmount: 9.0, distortionMode: "waves", distortionFreq: 10, dualSpiral: false },
      "Galactic Vortex Coil": { turns: 26, distortionAmount: 10.0, distortionMode: "vortex", distortionFreq: 5, dualSpiral: true },
      "Hypnotic Dual Intertwined": { turns: 18, distortionAmount: 0.0, distortionMode: "pure", distortionFreq: 8, dualSpiral: true }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const cx = minX + width * 0.5;
      const cy = minY + height * 0.5;
      const maxR = Math.min(width, height) * 0.45;

      const turns = params.turns;
      const maxTheta = turns * Math.PI * 2;
      const isPure = params.distortionMode === "pure" || params.distortionAmount <= 0;
      const distAmp = isPure ? 0 : params.distortionAmount;
      const distFreq = params.distortionFreq;
      const totalPoints = Math.max(1800, turns * 220);

      function buildSpiral(angleOffset) {
        const path = [];
        for (let i = 0; i <= totalPoints; i++) {
          const t = i / totalPoints;
          const theta = t * maxTheta;
          const currentAngle = theta + angleOffset;
          let r = t * maxR;

          // Pure Archimedean spiral when distAmp == 0!
          if (distAmp > 0 && t > 0.03) {
            let wobble = 0;
            if (params.distortionMode === "organic") {
              const nx = Math.cos(currentAngle) * (distFreq * 0.3);
              const ny = Math.sin(currentAngle) * (distFreq * 0.3);
              wobble = noise.noise2D(nx + t * 3, ny + t * 3) * distAmp * Math.min(1, t * 2.2);
            } else if (params.distortionMode === "waves") {
              wobble = Math.sin(theta * distFreq * 0.5) * distAmp * Math.min(1, t * 2.0);
            } else if (params.distortionMode === "vortex") {
              const swirl = Math.pow(t, 1.4) * 5;
              const n = noise.noise2D(Math.cos(currentAngle + swirl) * 2, Math.sin(currentAngle + swirl) * 2);
              wobble = n * distAmp * t;
            }
            r += wobble;
          }

          const x = cx + Math.cos(currentAngle) * r;
          const y = cy + Math.sin(currentAngle) * r;

          if (x >= minX && x <= bounds.maxX && y >= minY && y <= bounds.maxY) {
            path.push({ x, y });
          } else {
            if (path.length >= 2) break;
          }
        }
        return path;
      }

      const spiral1 = buildSpiral(0);
      if (spiral1.length >= 2) pathsLayer1.push(spiral1);

      if (params.dualSpiral) {
        const spiral2 = buildSpiral(Math.PI);
        if (spiral2.length >= 2) pathsLayer2.push(spiral2);
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 7. FRACTAL TREE & BRANCHING L-SYSTEM
  // =========================================================================
  fractalTree: {
    id: "fractalTree",
    name: "Fractal Branching Trees",
    category: "Organic & Recursive",
    badge: "Botanical Math",
    icon: "🌳",
    shortDesc: "Simulate living trees, fractal lightning, and biological lung airways with recursive geometry.",
    explanation: "Fractal recursion is how nature builds maximum surface area with minimal code. A single branch sprouts from the ground, splits into 2 or 3 smaller branches at specific angles, and each sub-branch splits again and again. With just 7 levels of recursion, a lifelike biological tree emerges.",
    beginnerTip: "Increase 'Branch Asymmetry' or 'Wind Sway' to turn a stiff mathematical symmetry into an expressive, windblown bonsai tree!",
    codeSnippet: `// Recursive branch function:
function branch(x, y, length, angle, depth) {
  if (depth <= 0) return;
  const nextX = x + Math.cos(angle) * length;
  const nextY = y + Math.sin(angle) * length;
  drawLine({x, y}, {nextX, nextY});
  branch(nextX, nextY, length * ratio, angle - spread, depth - 1);
  branch(nextX, nextY, length * ratio, angle + spread, depth - 1);
}`,
    parameters: [
      { id: "recursionDepth", label: "Branching Depth", type: "range", min: 4, max: 7, step: 1, default: 6, unit: "levels", desc: "How many times branches split recursively." },
      { id: "branchAngle", label: "Branch Spread Angle", type: "range", min: 15, max: 55, step: 2, default: 28, unit: "°", desc: "Angle between child branches." },
      { id: "lengthRatio", label: "Branch Shrink Ratio", type: "range", min: 0.55, max: 0.80, step: 0.01, default: 0.72, unit: "", desc: "How much shorter each generation of branches becomes." },
      { id: "trunkLength", label: "Trunk Height", type: "range", min: 20, max: 65, step: 2, default: 42, unit: "mm", desc: "Initial starting height of the main trunk." },
      { id: "windSway", label: "Wind Sway / Curvature", type: "range", min: -20, max: 20, step: 1, default: 4, unit: "°", desc: "Tilts the tree organically in the wind." },
      { id: "treeCount", label: "Number of Trees", type: "range", min: 1, max: 3, step: 1, default: 1, unit: "trees", desc: "Draws a solitary specimen or a forest horizon." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Twigs)", type: "checkbox", default: true, desc: "Plots sturdy main branches in Pen 1 and delicate leaf twigs in Pen 2." }
    ],
    presets: {
      "Ancient Bonsai": { recursionDepth: 6, branchAngle: 34, lengthRatio: 0.70, trunkLength: 42, windSway: 8, treeCount: 1, dualColorAccent: true },
      "Winter Birch Forest": { recursionDepth: 5, branchAngle: 22, lengthRatio: 0.74, trunkLength: 44, windSway: -3, treeCount: 2, dualColorAccent: true },
      "Fractal Lightning Bolt": { recursionDepth: 7, branchAngle: 45, lengthRatio: 0.65, trunkLength: 55, windSway: 0, treeCount: 1, dualColorAccent: false },
      "Grand Victorian Oak": { recursionDepth: 6, branchAngle: 30, lengthRatio: 0.75, trunkLength: 40, windSway: 2, treeCount: 1, dualColorAccent: true }
    },
    generate(bounds, params, rng) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const trees = params.treeCount;
      const maxDepth = params.recursionDepth;
      const baseSpread = MathUtils.radians(params.branchAngle);
      const ratio = params.lengthRatio;
      const sway = MathUtils.radians(params.windSway);

      for (let t = 0; t < trees; t++) {
        const rootX = minX + (width / (trees + 1)) * (t + 1);
        const rootY = minY + height * 0.92;
        const trunkLen = params.trunkLength * (0.85 + rng.next() * 0.3);

        function growBranch(x, y, length, angle, depth) {
          if (depth <= 0 || length < 1.0) return;

          const endX = x + Math.sin(angle) * length;
          const endY = y - Math.cos(angle) * length;

          const branchPath = [{ x, y }, { x: endX, y: endY }];

          // Layer separation: main trunk/thick limbs vs fine twigs
          if (params.dualColorAccent && depth <= 3) {
            pathsLayer2.push(branchPath);
          } else {
            pathsLayer1.push(branchPath);
          }

          // Random natural jitter in branch angles
          const naturalJitter = (rng.next() - 0.5) * 0.15;
          const leftAngle = angle - baseSpread + naturalJitter + sway * 0.2;
          const rightAngle = angle + baseSpread + naturalJitter + sway * 0.2;

          growBranch(endX, endY, length * ratio * (0.92 + rng.next() * 0.16), leftAngle, depth - 1);
          growBranch(endX, endY, length * ratio * (0.92 + rng.next() * 0.16), rightAngle, depth - 1);

          // Occasional third central sprout
          if (depth >= 4 && rng.chance(0.35)) {
            const centerAngle = angle + sway * 0.3 + (rng.next() - 0.5) * 0.2;
            growBranch(endX, endY, length * ratio * 0.75, centerAngle, depth - 2);
          }
        }

        growBranch(rootX, rootY, trunkLen, sway, maxDepth);
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 7. CONTINUOUS SPACE-FILLING MEANDERS (ZERO PEN LIFTS)
  // =========================================================================
  continuousMeander: {
    id: "continuousMeander",
    name: "Continuous Single-Line Meanders",
    category: "Continuous / 1-Path",
    badge: "Zero Pen Lifts",
    icon: "➰",
    shortDesc: "A single continuous unbroken line traversing the entire sheet without lifting the pen once!",
    explanation: "Space-filling curves like the Hilbert curve and continuous self-avoiding walks visit every sector of the 2D plane with a single, unbroken mathematical line. For pen plotters, this is the holy grail: the pen drops once at the start, draws the entire artwork smoothly without stopping, and lifts only when completely finished!",
    beginnerTip: "Watch the plot simulator with this algorithm! Notice how the pen never lifts from the paper — it finishes in record time with zero ink-bleed dots.",
    codeSnippet: `// Recursive Hilbert space-filling curve:
// 1 single continuous vector path traversing the entire paper!`,
    parameters: [
      { id: "curveOrder", label: "Curve Detail Order", type: "range", min: 2, max: 5, step: 1, default: 4, unit: "order", desc: "Density of the space-filling grid (Order 4 = 256 cells, Order 5 = 1024 cells)." },
      { id: "curveStyle", label: "Curve Style", type: "select", options: [
        { value: "hilbert", label: "Hilbert Space-Filling Curve" },
        { value: "organicWander", label: "Organic Self-Avoiding Meander" },
        { value: "peanoSpiral", label: "Serpentine Spiral Meander" }
      ], default: "hilbert", desc: "Select the continuous line path trajectory." },
      { id: "cornerRoundness", label: "Corner Smoothing", type: "range", min: 0, max: 0.45, step: 0.05, default: 0.25, unit: "", desc: "Rounds sharp 90° corners for smooth continuous pen gliding." },
      { id: "wobble", label: "Hand-Drawn Organic Wobble", type: "range", min: 0, max: 2.0, step: 0.2, default: 0.4, unit: "mm", desc: "Adds subtle hand-drawn organic vibration to the line." }
    ],
    presets: {
      "Continuous Hilbert Labyrinth": { curveOrder: 4, curveStyle: "hilbert", cornerRoundness: 0.25, wobble: 0.2 },
      "Smooth Silk Maze": { curveOrder: 4, curveStyle: "hilbert", cornerRoundness: 0.40, wobble: 0.0 },
      "Hand-Drawn Explorer": { curveOrder: 3, curveStyle: "organicWander", cornerRoundness: 0.15, wobble: 1.0 },
      "Serpentine Labyrinth": { curveOrder: 4, curveStyle: "peanoSpiral", cornerRoundness: 0.30, wobble: 0.4 }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const size = Math.min(width, height);
      const offsetX = minX + (width - size) * 0.5;
      const offsetY = minY + (height - size) * 0.5;

      const singleContinuousPath = [];

      if (params.curveStyle === "hilbert") {
        // Generate Hilbert curve points
        const order = params.curveOrder;
        const n = 1 << order; // 2^order
        const totalPoints = n * n;
        const cell = size / n;

        // D2XY Hilbert coordinate mapping
        function d2xy(m, d) {
          let rx, ry, s, t = d;
          let x = 0, y = 0;
          for (s = 1; s < m; s *= 2) {
            rx = 1 & (t / 2);
            ry = 1 & (t ^ rx);
            if (ry === 0) {
              if (rx === 1) {
                x = s - 1 - x;
                y = s - 1 - y;
              }
              const temp = x;
              x = y;
              y = temp;
            }
            x += s * rx;
            y += s * ry;
            t = Math.floor(t / 4);
          }
          return { x, y };
        }

        const rawPoints = [];
        for (let i = 0; i < totalPoints; i++) {
          const pt = d2xy(n, i);
          rawPoints.push({
            x: offsetX + (pt.x + 0.5) * cell,
            y: offsetY + (pt.y + 0.5) * cell
          });
        }

        // Apply corner rounding / subdivision if requested
        if (params.cornerRoundness > 0) {
          const round = params.cornerRoundness;
          singleContinuousPath.push(rawPoints[0]);

          for (let i = 1; i < rawPoints.length - 1; i++) {
            const pPrev = rawPoints[i - 1];
            const pCurr = rawPoints[i];
            const pNext = rawPoints[i + 1];

            const p1 = {
              x: MathUtils.lerp(pCurr.x, pPrev.x, round),
              y: MathUtils.lerp(pCurr.y, pPrev.y, round)
            };
            const p2 = {
              x: MathUtils.lerp(pCurr.x, pNext.x, round),
              y: MathUtils.lerp(pCurr.y, pNext.y, round)
            };

            singleContinuousPath.push(p1);
            singleContinuousPath.push(p2);
          }
          singleContinuousPath.push(rawPoints[rawPoints.length - 1]);
        } else {
          rawPoints.forEach(p => singleContinuousPath.push(p));
        }

      } else if (params.curveStyle === "peanoSpiral") {
        // Serpentine scanline spiral
        const rows = (1 << params.curveOrder) * 2;
        const stepY = height / rows;
        for (let r = 0; r < rows; r++) {
          const y = minY + (r + 0.5) * stepY;
          if (r % 2 === 0) {
            singleContinuousPath.push({ x: minX, y });
            singleContinuousPath.push({ x: minX + width, y });
          } else {
            singleContinuousPath.push({ x: minX + width, y });
            singleContinuousPath.push({ x: minX, y });
          }
        }
      } else {
        // Organic wandering self-avoiding walk
        const cols = (1 << params.curveOrder);
        const cell = size / cols;
        let curX = minX + width * 0.5;
        let curY = minY + height * 0.5;
        singleContinuousPath.push({ x: curX, y: curY });

        const steps = cols * cols * 0.6;
        for (let s = 0; s < steps; s++) {
          const angle = Math.floor(rng.range(0, 4)) * (Math.PI * 0.5);
          const nx = MathUtils.clamp(curX + Math.cos(angle) * cell, minX + cell, minX + width - cell);
          const ny = MathUtils.clamp(curY + Math.sin(angle) * cell, minY + cell, minY + height - cell);
          singleContinuousPath.push({ x: nx, y: ny });
          curX = nx;
          curY = ny;
        }
      }

      // Add wobble if set
      if (params.wobble > 0) {
        for (let i = 0; i < singleContinuousPath.length; i++) {
          const pt = singleContinuousPath[i];
          const n = noise.noise2D(pt.x * 0.05, pt.y * 0.05);
          pt.x += Math.cos(n * Math.PI * 2) * params.wobble;
          pt.y += Math.sin(n * Math.PI * 2) * params.wobble;
        }
      }

      if (singleContinuousPath.length >= 2) {
        pathsLayer1.push(singleContinuousPath);
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 8. CODE SANDBOX (LIVE FORMULA TWEAKER)
  // =========================================================================
  codeSandbox: {
    id: "codeSandbox",
    name: "Live Code & Math Sandbox",
    category: "Coding & Custom Formulas",
    badge: "First Code Steps",
    icon: "💻",
    shortDesc: "Tweak real JavaScript code & mathematical formulas with live instant visual preview!",
    explanation: "For workshop participants ready to write their first generative code! Modify the mathematical equation directly in the editor below. The live engine evaluates your code safely on the fly and renders your customized vector artwork in real-time.",
    beginnerTip: "Start by changing numbers like '7', '0.04', or swap 'Math.sin' with 'Math.cos' to see what happens!",
    codeSnippet: `// Live editable generator snippet:
function generateArt(bounds, noise, rng) {
  // Return array of paths [{x, y}, ...]
}`,
    parameters: [
      { id: "codePreset", label: "Starter Formula Template", type: "select", options: [
        { value: "roseMath", label: "Mathematical Rose Curve (r = cos(k * theta))" },
        { value: "lissajousGrid", label: "Lissajous Resonance Mesh" },
        { value: "customFormula", label: "Custom Formula (Type your own math!)" },
        { value: "superFormula", label: "Gielis Superformula Organic Shapes" },
        { value: "archimedesSpiral", label: "Archimedean Modulated Spiral" }
      ], default: "roseMath", desc: "Select a starter code snippet to edit." },
      { id: "customFormula", label: "Math Formula Expression", type: "text", default: "Math.cos((A/B) * theta) * (1 + 0.2 * Math.sin(A * theta))", desc: "Type any JS math expression using theta, A, B, Math.sin, Math.cos, etc." },
      { id: "multiplierA", label: "Parameter A (Tweak in formula)", type: "range", min: 1, max: 15, step: 0.5, default: 5, unit: "", desc: "Exposed as variable 'A' inside your code snippet." },
      { id: "multiplierB", label: "Parameter B (Tweak in formula)", type: "range", min: 1, max: 15, step: 0.5, default: 8, unit: "", desc: "Exposed as variable 'B' inside your code snippet." },
      { id: "density", label: "Point Resolution", type: "range", min: 500, max: 3500, step: 250, default: 2000, unit: "pts", desc: "Number of points calculated by your loop." }
    ],
    presets: {
      "Mathematical Rose Curve (r = cos(k * theta))": { codePreset: "roseMath", customFormula: "Math.cos((A/B) * theta)", multiplierA: 5, multiplierB: 7, density: 2200 },
      "Lissajous Resonance Mesh": { codePreset: "lissajousGrid", customFormula: "Math.sin(A * theta)", multiplierA: 3, multiplierB: 4, density: 2000 },
      "Custom Math Expression": { codePreset: "customFormula", customFormula: "Math.cos((A/B) * theta) * (1 + 0.2 * Math.sin(A * theta))", multiplierA: 6, multiplierB: 4, density: 2400 },
      "Gielis Superformula Organic Shapes": { codePreset: "superFormula", customFormula: "superformula(theta)", multiplierA: 6, multiplierB: 2, density: 2400 },
      "Archimedean Modulated Spiral": { codePreset: "archimedesSpiral", customFormula: "spiral(theta)", multiplierA: 8, multiplierB: 4, density: 2600 }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const cx = minX + width * 0.5;
      const cy = minY + height * 0.5;
      const maxR = Math.min(width, height) * 0.44;
      const A = params.multiplierA;
      const B = params.multiplierB;
      const pts = params.density;

      if (params.codePreset === "customFormula") {
        let formulaFunc;
        try {
          formulaFunc = new Function("theta", "A", "B", "Math", `
            try {
              return (${params.customFormula || "1"});
            } catch(e) {
              return 1;
            }
          `);
        } catch(e) {
          formulaFunc = () => 1;
        }

        const path = [];
        const maxTheta = Math.PI * 2 * Math.max(2, B || 4);
        for (let i = 0; i <= pts; i++) {
          const theta = (i / pts) * maxTheta;
          let rVal = 1;
          try {
            rVal = formulaFunc(theta, A, B, Math);
            if (isNaN(rVal) || !isFinite(rVal)) rVal = 0.5;
          } catch(e) {
            rVal = 0.5;
          }
          const r = maxR * Math.min(1.2, Math.max(-1.2, rVal));
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          path.push({ x, y });
        }
        if (path.length >= 2) pathsLayer1.push(path);

      } else if (params.codePreset === "roseMath") {
        // Mathematical Rose: r = cos(k * theta)
        const k = A / (B || 1);
        const path = [];
        const maxTheta = Math.PI * 2 * (B || 1);
        for (let i = 0; i <= pts; i++) {
          const theta = (i / pts) * maxTheta;
          const r = maxR * Math.cos(k * theta);
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          path.push({ x, y });
        }
        if (path.length >= 2) pathsLayer1.push(path);

      } else if (params.codePreset === "lissajousGrid") {
        // Lissajous 3D mesh
        const path = [];
        for (let i = 0; i <= pts; i++) {
          const t = (i / pts) * Math.PI * 2 * 12;
          const x = cx + maxR * Math.sin(A * t + Math.PI * 0.25);
          const y = cy + maxR * Math.sin(B * t);
          path.push({ x, y });
        }
        if (path.length >= 2) pathsLayer1.push(path);

      } else if (params.codePreset === "archimedesSpiral") {
        // Modulated spiral
        const path = [];
        const turns = A * 4;
        for (let i = 0; i <= pts; i++) {
          const t = i / pts;
          const theta = t * Math.PI * 2 * turns;
          const r = t * maxR + Math.sin(theta * B) * (maxR * 0.08);
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          path.push({ x, y });
        }
        if (path.length >= 2) pathsLayer1.push(path);

      } else {
        // Superformula
        const path = [];
        const m = A;
        const n1 = 0.5, n2 = B * 0.2, n3 = B * 0.2;
        const a = 1, b = 1;
        for (let i = 0; i <= pts; i++) {
          const phi = (i / pts) * Math.PI * 2;
          const t1 = Math.pow(Math.abs((1 / a) * Math.cos((m * phi) / 4)), n2);
          const t2 = Math.pow(Math.abs((1 / b) * Math.sin((m * phi) / 4)), n3);
          const r = Math.pow(t1 + t2, -1 / n1) * (maxR * 0.6);
          const x = cx + Math.cos(phi) * r;
          const y = cy + Math.sin(phi) * r;
          path.push({ x, y });
        }
        if (path.length >= 2) pathsLayer1.push(path);
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  },

  // =========================================================================
  // 9. GENERATIVE DOODLES & MINDFUL SCRIBBLING (ZERO LIFT ORGANIC LOOPS)
  // =========================================================================
  doodles: {
    id: "doodles",
    name: "Generative Doodles & Scribbles",
    category: "Organic & Freeform",
    badge: "Zero Pen Lifts",
    icon: "✏️",
    shortDesc: "Playful continuous wandering loops, mindful scribbles, and flowing Zentangle ribbon curls.",
    explanation: "Inspired by the intuitive scribbles people draw while daydreaming or on the phone. A virtual drawing tip wanders across the paper with natural inertia, curling into whimsical loop-de-loops, soft cloud-like squiggles, or meditative Zentangles. Designed to be completely continuous—drawing a full, rich composition in a single fluid stroke with zero pen lifts, keeping the plotter servo cool and safe!",
    beginnerTip: "Switch between 'Whimsical Loops' and 'Mindful Cloud' to see how curling frequency transforms the doodle!",
    codeSnippet: `// Organic wandering doodle steering:
angularVel += Math.sin(step * curliness) * 0.35 + noise(x, y) * 0.3;
x += Math.cos(angle) * stepSize;
y += Math.sin(angle) * stepSize;`,
    parameters: [
      { id: "doodleStyle", label: "Doodle Style", type: "select", options: [
        { value: "loops", label: "Whimsical Loop-de-Loop (Cursive Ribbon)" },
        { value: "scribble", label: "Mindful Cloud Scribble (Soft Wandering)" },
        { value: "zentangle", label: "Zentangle Ribbon Swirls (Rhythmic Loops)" },
        { value: "botanical", label: "Botanical Ivy Tendrils (Organic Vines)" }
      ], default: "loops", desc: "The character and curvature rule of the wandering pen." },
      { id: "loopDensity", label: "Doodle Length (Steps)", type: "range", min: 1000, max: 3600, step: 200, default: 2200, unit: "steps", desc: "Total length of the continuous doodle stroke (calibrated < 5 mins)." },
      { id: "curliness", label: "Loop Curliness", type: "range", min: 1.0, max: 4.0, step: 0.2, default: 2.2, unit: "x", desc: "How tightly the pen curls into circular loop-de-loops." },
      { id: "wanderSpeed", label: "Step Resolution", type: "range", min: 1.0, max: 2.4, step: 0.1, default: 1.5, unit: "mm", desc: "Distance between consecutive coordinates in the stroke." },
      { id: "coverage", label: "Paper Coverage Spread", type: "range", min: 0.55, max: 0.90, step: 0.05, default: 0.80, unit: "", desc: "Boundary envelope determining how wide the doodle spreads across the page." },
      { id: "dualColorAccent", label: "Dual Layer (Pen 2 Accent)", type: "checkbox", default: false, desc: "Splits the doodle into two continuous layers for 2-pen plotting." }
    ],
    presets: {
      "Whimsical Loop-de-Loop": { doodleStyle: "loops", loopDensity: 2200, curliness: 2.4, wanderSpeed: 1.5, coverage: 0.80, dualColorAccent: false },
      "Mindful Cloud Scribble": { doodleStyle: "scribble", loopDensity: 2400, curliness: 1.8, wanderSpeed: 1.6, coverage: 0.85, dualColorAccent: false },
      "Zentangle Ribbon Swirls": { doodleStyle: "zentangle", loopDensity: 2600, curliness: 2.5, wanderSpeed: 1.4, coverage: 0.78, dualColorAccent: false },
      "Botanical Ivy Tendrils": { doodleStyle: "botanical", loopDensity: 2000, curliness: 2.0, wanderSpeed: 1.6, coverage: 0.82, dualColorAccent: true },
      "Cursive Notepad Wander": { doodleStyle: "loops", loopDensity: 1800, curliness: 1.6, wanderSpeed: 1.8, coverage: 0.75, dualColorAccent: false }
    },
    generate(bounds, params, rng, noise) {
      const { minX, minY, maxX, maxY, width, height } = bounds;
      const pathsLayer1 = [];
      const pathsLayer2 = [];

      const style = params.doodleStyle || "loops";
      const totalSteps = params.loopDensity || 2200;
      const curliness = params.curliness || 2.2;
      const stepSize = params.wanderSpeed || 1.5;
      const coverage = params.coverage || 0.80;

      const cx = minX + width * 0.5;
      const cy = minY + height * 0.5;
      const boundRadiusX = width * 0.5 * coverage;
      const boundRadiusY = height * 0.5 * coverage;

      let x = cx + rng.range(-8, 8);
      let y = cy + rng.range(-8, 8);
      let angle = rng.range(0, Math.PI * 2);
      let angularVel = 0.05;

      const fullPath = [{ x, y }];

      // Spatial visited grid to ensure mindful space-filling (prevents tight ink balls)
      const gridSize = 4.0; // mm
      const gridW = Math.ceil(width / gridSize);
      const gridH = Math.ceil(height / gridSize);
      const visited = new Float32Array(gridW * gridH);

      function getVisit(px, py) {
        const gx = Math.floor((px - minX) / gridSize);
        const gy = Math.floor((py - minY) / gridSize);
        if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
          return visited[gy * gridW + gx];
        }
        return 10.0;
      }

      function addVisit(px, py, amount) {
        const gx = Math.floor((px - minX) / gridSize);
        const gy = Math.floor((py - minY) / gridSize);
        if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
          visited[gy * gridW + gx] += amount;
        }
      }

      for (let s = 0; s < totalSteps; s++) {
        addVisit(x, y, 0.4);

        if (style === "loops") {
          // Continuous whimsical loop-de-loops
          const n = noise.noise2D(x * 0.008, y * 0.008);
          const curlWave = Math.sin(s * 0.045 * curliness) * 0.35 * curliness;
          angularVel += (curlWave + n * 0.35 - angularVel) * 0.12;

        } else if (style === "scribble") {
          // Mindful cloud / organic wandering scribble
          const n = noise.noise2D(x * 0.012, y * 0.012);
          const jitter = (rng.next() - 0.5) * 0.32 * curliness;
          angularVel += jitter + n * 0.22;
          angularVel = Math.max(-0.55, Math.min(0.55, angularVel));

        } else if (style === "zentangle") {
          // Rhythmic serpentine ribbon with loopy curls
          const freq = 0.055 * curliness;
          const wave = Math.cos(s * freq) * 0.42;
          const looper = (s % 85 < 20) ? (0.55 * curliness) : 0;
          angularVel = wave + looper + noise.noise2D(x * 0.005, y * 0.005) * 0.2;

        } else if (style === "botanical") {
          // Botanical tendrils and curling vines
          const curl = (s % 110 < 40) ? (0.42 * curliness) : (-0.22 * curliness);
          const n = noise.noise2D(x * 0.007, y * 0.007);
          angularVel += (curl + n * 0.28 - angularVel) * 0.15;
        }

        // Sensory probe to gently steer away from heavily visited areas (self-avoidance)
        const probeDist = stepSize * 4.5;
        const leftAngle = angle - 0.65;
        const rightAngle = angle + 0.65;
        const lx = x + Math.cos(leftAngle) * probeDist;
        const ly = y + Math.sin(leftAngle) * probeDist;
        const rx = x + Math.cos(rightAngle) * probeDist;
        const ry = y + Math.sin(rightAngle) * probeDist;

        const vLeft = getVisit(lx, ly);
        const vRight = getVisit(rx, ry);

        if (vLeft > vRight + 0.4) {
          angularVel += 0.07;
        } else if (vRight > vLeft + 0.4) {
          angularVel -= 0.07;
        }

        // Soft boundary reflection: steer smoothly back towards paper center
        const dxFromCenter = (x - cx) / boundRadiusX;
        const dyFromCenter = (y - cy) / boundRadiusY;
        const distSq = dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter;

        if (distSq > 0.85) {
          const angleToCenter = Math.atan2(cy - y, cx - x);
          let diff = angleToCenter - angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          angularVel += diff * 0.18;
        }

        // Clamp angular velocity for smooth pen motion
        angularVel = Math.max(-0.7, Math.min(0.7, angularVel));
        angle += angularVel;

        const nextX = x + Math.cos(angle) * stepSize;
        const nextY = y + Math.sin(angle) * stepSize;

        // Hard clamp within margins
        x = Math.max(minX + 2, Math.min(maxX - 2, nextX));
        y = Math.max(minY + 2, Math.min(maxY - 2, nextY));

        fullPath.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
      }

      // Handle Dual Pen Accent if enabled
      if (params.dualColorAccent) {
        const half = Math.floor(fullPath.length * 0.55);
        pathsLayer1.push(fullPath.slice(0, half));
        pathsLayer2.push(fullPath.slice(half - 1));
      } else {
        pathsLayer1.push(fullPath);
      }

      return { layer1: pathsLayer1, layer2: pathsLayer2 };
    }
  }
};

window.ALGORITHM_DEFINITIONS = ALGORITHM_DEFINITIONS;
