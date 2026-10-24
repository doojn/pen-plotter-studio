/**
 * Pen Plotter Drawing Simulator
 * Animates pen carriage movement, pen-up air jumps, and ink drawing in real-time.
 */

class PlotterSimulator {
  constructor(canvas, onProgressUpdate) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onProgressUpdate = onProgressUpdate || (() => {});

    this.isPlaying = false;
    this.speedMultiplier = 5; // Default 5x speed
    this.progress = 0; // 0.0 to 1.0
    this.animationFrameId = null;

    // Flattened segments cache
    this.segments = []; // Array of { type: 'down'|'up', x1, y1, x2, y2, layer }
    this.totalSteps = 0;
    this.currentStep = 0;
    this.currentPos = { x: 0, y: 0 };
    this.isPenDown = false;
  }

  // Prepare simulation data from generated paths
  loadPaths(pathsLayer1, pathsLayer2, bounds) {
    this.stop();
    this.bounds = bounds;
    this.segments = [];

    let lastX = bounds.minX;
    let lastY = bounds.minY;

    function addPaths(paths, layerIdx) {
      if (!paths) return;
      for (const p of paths) {
        if (p.length < 2) continue;
        // Air jump from last point to start of this path
        const firstPt = p[0];
        const airDist = Math.hypot(firstPt.x - lastX, firstPt.y - lastY);
        if (airDist > 0.1) {
          segments.push({
            type: "up",
            x1: lastX,
            y1: lastY,
            x2: firstPt.x,
            y2: firstPt.y,
            dist: airDist,
            layer: layerIdx
          });
        }

        // Pen down drawing segments
        for (let i = 1; i < p.length; i++) {
          const ptA = p[i - 1];
          const ptB = p[i];
          const dist = Math.hypot(ptB.x - ptA.x, ptB.y - ptA.y);
          segments.push({
            type: "down",
            x1: ptA.x,
            y1: ptA.y,
            x2: ptB.x,
            y2: ptB.y,
            dist: dist,
            layer: layerIdx
          });
        }

        lastX = p[p.length - 1].x;
        lastY = p[p.length - 1].y;
      }
    }

    const segments = this.segments;
    addPaths(pathsLayer1, 1);
    addPaths(pathsLayer2, 2);

    this.totalSteps = this.segments.length;
    this.currentStep = 0;
    this.progress = 0;
  }

  play() {
    if (this.totalSteps === 0) return;
    if (this.progress >= 1.0) {
      this.currentStep = 0;
      this.progress = 0;
    }
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.animate();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop() {
    this.pause();
    this.currentStep = 0;
    this.progress = 0;
  }

  seek(fraction) {
    this.progress = Math.max(0, Math.min(1, fraction));
    this.currentStep = Math.floor(this.progress * this.totalSteps);
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  animate() {
    if (!this.isPlaying) return;

    // Smooth fractional step accumulator for realistic, calm pen speed
    this.stepAccumulator = (this.stepAccumulator || 0) + Math.max(0.08, this.speedMultiplier * 0.6);
    const stepsThisFrame = Math.floor(this.stepAccumulator);
    this.stepAccumulator -= stepsThisFrame;

    if (stepsThisFrame > 0) {
      this.currentStep = Math.min(this.totalSteps, this.currentStep + stepsThisFrame);
      this.progress = this.totalSteps > 0 ? this.currentStep / this.totalSteps : 0;

      if (this.currentStep < this.totalSteps) {
        const seg = this.segments[this.currentStep];
        this.currentPos = { x: seg.x2, y: seg.y2 };
        this.isPenDown = seg.type === "down";
      }

      this.onProgressUpdate({
        progress: this.progress,
        currentStep: this.currentStep,
        totalSteps: this.totalSteps,
        currentPos: this.currentPos,
        isPenDown: this.isPenDown
      });
    }

    if (this.currentStep >= this.totalSteps) {
      this.isPlaying = false;
      this.onProgressUpdate({
        progress: 1.0,
        currentStep: this.totalSteps,
        totalSteps: this.totalSteps,
        currentPos: this.currentPos,
        isPenDown: false,
        completed: true
      });
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

window.PlotterSimulator = PlotterSimulator;
