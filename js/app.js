/**
 * Workshop Pen Plotter Studio - Main Application Controller
 */

class App {
  constructor() {
    this.plotter = new PlotterEngine();
    this.rng = new RandomGenerator(42);
    this.noise = new SimplexNoise(this.rng);

    // Application State
    this.state = {
      currentAlgoId: "flowField",
      activePresetName: "Ocean Currents",
      seed: 4242,
      paperKey: "a5",
      orientation: "portrait", // portrait or landscape
      marginMm: 12, // mm
      paperColorId: "white",
      pen1ColorId: "micron_black",
      pen2ColorId: "crimson_red",
      strokeWidthMm: 0.35,
      optimizePaths: true,
      
      // Pan & Zoom
      zoom: 1.0,
      panX: 0,
      panY: 0,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,

      // Generated Vector Data
      pathsLayer1: [],
      pathsLayer2: [],
      bounds: null,
      stats: null,

      // Parameters Map: { algoId: { paramId: value } }
      algoParams: {}
    };

    // Initialize default parameters for all algorithms
    Object.keys(ALGORITHM_DEFINITIONS).forEach(id => {
      const def = ALGORITHM_DEFINITIONS[id];
      this.state.algoParams[id] = {};
      def.parameters.forEach(p => {
        this.state.algoParams[id][p.id] = p.default;
      });
    });

    this.initDOM();
    this.initEvents();
    this.selectAlgorithm("flowField");
  }

  initDOM() {
    this.canvas = document.getElementById("artCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasWrapper = document.getElementById("canvasWrapper");
    this.paperSheet = document.getElementById("paperSheet");
    this.marginOverlay = document.getElementById("marginOverlay");

    // Simulator
    this.simulator = new PlotterSimulator(this.canvas, (simState) => {
      this.renderCanvas(simState);
      this.updateSimulatorUI(simState);
    });

    // Populate paper dropdown
    const paperSelect = document.getElementById("paperSelect");
    if (paperSelect) {
      paperSelect.innerHTML = "";
      Object.keys(PAPER_SIZES).forEach(key => {
        const p = PAPER_SIZES[key];
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = p.name;
        if (key === this.state.paperKey) opt.selected = true;
        paperSelect.appendChild(opt);
      });
    }

    // Populate algorithm selector cards
    const algoGrid = document.getElementById("algoGrid");
    if (algoGrid) {
      algoGrid.innerHTML = "";
      Object.values(ALGORITHM_DEFINITIONS).forEach(def => {
        const card = document.createElement("div");
        card.className = `algo-card ${def.id === this.state.currentAlgoId ? "active" : ""}`;
        card.dataset.algoId = def.id;
        card.innerHTML = `
          <div class="algo-card-top">
            <span class="algo-card-icon">${def.icon}</span>
            <div>
              <div class="algo-card-name">${def.name}</div>
              <div class="algo-card-category">${def.category}</div>
            </div>
          </div>
        `;
        card.addEventListener("click", () => this.selectAlgorithm(def.id));
        algoGrid.appendChild(card);
      });
    }
  }

  initEvents() {
    // Tab switching (Algorithms vs Setup vs Code)
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const tabPane = document.getElementById(btn.dataset.tab);
        if (tabPane) tabPane.classList.add("active");
      });
    });

    // Seed Randomize Button
    const btnRandomSeed = document.getElementById("btnRandomSeed");
    if (btnRandomSeed) {
      btnRandomSeed.addEventListener("click", () => {
        const newSeed = Math.floor(Math.random() * 900000) + 10000;
        this.setSeed(newSeed);
      });
    }

    // Seed Text Input
    const seedInput = document.getElementById("seedInput");
    if (seedInput) {
      seedInput.addEventListener("change", (e) => {
        this.setSeed(e.target.value);
      });
    }

    // Paper Size Change
    const paperSelect = document.getElementById("paperSelect");
    if (paperSelect) {
      paperSelect.addEventListener("change", (e) => {
        this.state.paperKey = e.target.value;
        this.fitToScreen();
        this.generate();
      });
    }

    // Orientation toggle
    const orientationSelect = document.getElementById("orientationSelect");
    if (orientationSelect) {
      orientationSelect.addEventListener("change", (e) => {
        this.state.orientation = e.target.value;
        this.fitToScreen();
        this.generate();
      });
    }

    // Margin Slider
    const marginSlider = document.getElementById("marginSlider");
    if (marginSlider) {
      marginSlider.addEventListener("input", (e) => {
        this.state.marginMm = parseFloat(e.target.value);
        document.getElementById("marginVal").textContent = `${this.state.marginMm} mm`;
        this.generate();
      });
    }

    // Paper Color Selector
    const paperColorSelect = document.getElementById("paperColorSelect");
    if (paperColorSelect) {
      paperColorSelect.addEventListener("change", (e) => {
        this.state.paperColorId = e.target.value;
        this.renderCanvas();
      });
    }

    // Pen 1 Color Selector
    const pen1Select = document.getElementById("pen1Select");
    if (pen1Select) {
      pen1Select.addEventListener("change", (e) => {
        this.state.pen1ColorId = e.target.value;
        this.renderCanvas();
      });
    }

    // Pen 2 Color Selector
    const pen2Select = document.getElementById("pen2Select");
    if (pen2Select) {
      pen2Select.addEventListener("change", (e) => {
        this.state.pen2ColorId = e.target.value;
        this.renderCanvas();
      });
    }

    // Optimize Paths Toggle
    const optToggle = document.getElementById("optimizePathsToggle");
    if (optToggle) {
      optToggle.addEventListener("change", (e) => {
        this.state.optimizePaths = e.target.checked;
        this.generate();
      });
    }

    // Zoom Controls
    document.getElementById("btnZoomIn")?.addEventListener("click", () => this.zoom(1.2));
    document.getElementById("btnZoomOut")?.addEventListener("click", () => this.zoom(0.8));
    document.getElementById("btnZoomFit")?.addEventListener("click", () => this.fitToScreen());

    // Mouse Pan & Zoom on Canvas
    this.canvasWrapper.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.zoom(zoomFactor);
    }, { passive: false });

    this.canvasWrapper.addEventListener("mousedown", (e) => {
      if (e.button === 0) { // left click
        this.state.isPanning = true;
        this.state.panStartX = e.clientX - this.state.panX;
        this.state.panStartY = e.clientY - this.state.panY;
        this.canvasWrapper.classList.add("panning");
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.state.isPanning) {
        this.state.panX = e.clientX - this.state.panStartX;
        this.state.panY = e.clientY - this.state.panStartY;
        this.updateTransform();
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.state.isPanning) {
        this.state.isPanning = false;
        this.canvasWrapper.classList.remove("panning");
      }
    });

    // Window Resize
    window.addEventListener("resize", () => {
      this.fitToScreen();
    });

    // Simulator Buttons
    const btnSimToggle = document.getElementById("btnSimToggle");
    const simPanel = document.getElementById("simulatorPanel");
    if (btnSimToggle && simPanel) {
      btnSimToggle.addEventListener("click", () => {
        const isHidden = simPanel.style.display === "none" || !simPanel.style.display;
        simPanel.style.display = isHidden ? "flex" : "none";
        if (isHidden) {
          this.simulator.loadPaths(this.state.pathsLayer1, this.state.pathsLayer2, this.state.bounds);
        } else {
          this.simulator.stop();
          this.renderCanvas();
        }
      });
    }

    document.getElementById("simPlayBtn")?.addEventListener("click", () => {
      if (this.simulator.isPlaying) {
        this.simulator.pause();
        document.getElementById("simPlayBtn").textContent = "▶";
      } else {
        this.simulator.play();
        document.getElementById("simPlayBtn").textContent = "⏸";
      }
    });

    document.getElementById("simStopBtn")?.addEventListener("click", () => {
      this.simulator.stop();
      document.getElementById("simPlayBtn").textContent = "▶";
      this.renderCanvas();
    });

    document.getElementById("simScrubber")?.addEventListener("input", (e) => {
      const frac = parseFloat(e.target.value) / 100;
      this.simulator.seek(frac);
      this.renderCanvas();
    });

    document.getElementById("simSpeedSelect")?.addEventListener("change", (e) => {
      this.simulator.setSpeed(parseFloat(e.target.value));
    });

    // Download & Export Buttons
    document.getElementById("btnDownloadSVG")?.addEventListener("click", () => this.exportSVG());
    document.getElementById("btnCopySVG")?.addEventListener("click", () => this.copySVG());
    document.getElementById("btnDownloadPNG")?.addEventListener("click", () => this.exportPNG());

    // Guide Modal
    document.getElementById("btnOpenGuide")?.addEventListener("click", () => {
      document.getElementById("guideModal")?.classList.add("open");
    });
    document.getElementById("btnCloseGuide")?.addEventListener("click", () => {
      document.getElementById("guideModal")?.classList.remove("open");
    });
    document.getElementById("guideModal")?.addEventListener("click", (e) => {
      if (e.target.id === "guideModal") {
        document.getElementById("guideModal")?.classList.remove("open");
      }
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        const newSeed = Math.floor(Math.random() * 900000) + 10000;
        this.setSeed(newSeed);
      } else if (e.key === "f" || e.key === "F") {
        this.fitToScreen();
      }
    });
  }

  setSeed(seed) {
    this.state.seed = seed;
    const seedInput = document.getElementById("seedInput");
    if (seedInput) seedInput.value = seed;
    this.rng.setSeed(seed);
    this.noise.reseed(this.rng);
    this.generate();
    this.showToast(`Seed updated to: ${seed}`);
  }

  selectAlgorithm(algoId) {
    const def = ALGORITHM_DEFINITIONS[algoId];
    if (!def) return;

    this.state.currentAlgoId = algoId;

    // Update active class on cards
    document.querySelectorAll(".algo-card").forEach(c => {
      c.classList.toggle("active", c.dataset.algoId === algoId);
    });

    // Update algorithm banner info
    const infoTitle = document.getElementById("algoInfoTitle");
    const infoDesc = document.getElementById("algoInfoDesc");
    const infoTip = document.getElementById("algoInfoTip");
    const codeSnippet = document.getElementById("algoCodeSnippet");

    if (infoTitle) infoTitle.innerHTML = `${def.icon} ${def.name}`;
    if (infoDesc) infoDesc.textContent = def.explanation;
    if (infoTip) infoTip.innerHTML = `💡 <b>Beginner Tip:</b> ${def.beginnerTip}`;
    if (codeSnippet) codeSnippet.textContent = def.codeSnippet || "// Algorithmic generative math";

    // Build Preset Pills
    const presetPills = document.getElementById("presetPills");
    if (presetPills) {
      presetPills.innerHTML = "";
      const presets = def.presets || {};
      const presetNames = Object.keys(presets);

      if (presetNames.length > 0) {
        this.state.activePresetName = presetNames[0];
        presetNames.forEach(name => {
          const pill = document.createElement("button");
          pill.className = `preset-pill ${name === this.state.activePresetName ? "active" : ""}`;
          pill.textContent = name;
          pill.addEventListener("click", () => {
            this.applyPreset(algoId, name);
          });
          presetPills.appendChild(pill);
        });
      }
    }

    // Build Parameter Sliders
    this.renderParameterControls(def);

    // Regenerate
    this.generate();
  }

  applyPreset(algoId, presetName) {
    const def = ALGORITHM_DEFINITIONS[algoId];
    if (!def || !def.presets || !def.presets[presetName]) return;

    this.state.activePresetName = presetName;
    const presetValues = def.presets[presetName];

    // Update state parameters
    Object.keys(presetValues).forEach(k => {
      this.state.algoParams[algoId][k] = presetValues[k];
    });

    // Update active class on preset pills
    document.querySelectorAll(".preset-pill").forEach(p => {
      p.classList.toggle("active", p.textContent === presetName);
    });

    // Re-render sliders
    this.renderParameterControls(def);

    this.generate();
    this.showToast(`Applied preset: "${presetName}"`);
  }

  renderParameterControls(def) {
    const container = document.getElementById("paramContainer");
    if (!container) return;
    container.innerHTML = "";

    const currentParams = this.state.algoParams[def.id];

    def.parameters.forEach(param => {
      const val = currentParams[param.id] !== undefined ? currentParams[param.id] : param.default;

      if (param.type === "range") {
        const item = document.createElement("div");
        item.className = "param-item";
        item.innerHTML = `
          <div class="param-header">
            <label class="param-label" title="${param.desc}">${param.label}</label>
            <span class="param-value" id="val_${param.id}">${val} ${param.unit || ""}</span>
          </div>
          <input type="range" id="input_${param.id}" min="${param.min}" max="${param.max}" step="${param.step}" value="${val}">
        `;
        const slider = item.querySelector("input");
        slider.addEventListener("input", (e) => {
          const newVal = parseFloat(e.target.value);
          currentParams[param.id] = newVal;
          document.getElementById(`val_${param.id}`).textContent = `${newVal} ${param.unit || ""}`;
          this.generate();
        });
        container.appendChild(item);

      } else if (param.type === "select") {
        const item = document.createElement("div");
        item.className = "param-item";
        let optionsHtml = "";
        param.options.forEach(opt => {
          optionsHtml += `<option value="${opt.value}" ${opt.value === val ? "selected" : ""}>${opt.label}</option>`;
        });
        item.innerHTML = `
          <div class="param-header">
            <label class="param-label" title="${param.desc}">${param.label}</label>
          </div>
          <select class="param-select" id="input_${param.id}">
            ${optionsHtml}
          </select>
        `;
        const sel = item.querySelector("select");
        sel.addEventListener("change", (e) => {
          currentParams[param.id] = e.target.value;
          this.generate();
        });
        container.appendChild(item);

      } else if (param.type === "checkbox") {
        const item = document.createElement("div");
        item.className = "param-checkbox-row";
        item.innerHTML = `
          <label class="param-label" title="${param.desc}">${param.label}</label>
          <label class="switch">
            <input type="checkbox" id="input_${param.id}" ${val ? "checked" : ""}>
            <span class="slider-switch"></span>
          </label>
        `;
        const chk = item.querySelector("input");
        chk.addEventListener("change", (e) => {
          currentParams[param.id] = e.target.checked;
          this.generate();
        });
        container.appendChild(item);

      } else if (param.type === "text") {
        const item = document.createElement("div");
        item.className = "param-item";
        item.innerHTML = `
          <div class="param-header">
            <label class="param-label" title="${param.desc}">${param.label}</label>
          </div>
          <input type="text" class="seed-input" id="input_${param.id}" value="${val}" style="font-family: monospace; font-size: 11.5px; padding: 6px 10px;">
        `;
        const txt = item.querySelector("input");
        txt.addEventListener("input", (e) => {
          currentParams[param.id] = e.target.value;
          this.generate();
        });
        container.appendChild(item);
      }
    });
  }

  generate() {
    const algoDef = ALGORITHM_DEFINITIONS[this.state.currentAlgoId];
    if (!algoDef) return;

    // Reset PRNG with current seed for absolute reproducibility
    this.rng.setSeed(this.state.seed);
    this.noise.reseed(this.rng);

    // Compute paper bounds taking margin and orientation into account
    this.state.bounds = this.plotter.getBounds(
      this.state.paperKey,
      this.state.orientation,
      this.state.marginMm
    );

    const params = this.state.algoParams[this.state.currentAlgoId];

    // Generate raw paths
    const result = algoDef.generate(this.state.bounds, params, this.rng, this.noise);
    let layer1 = result.layer1 || [];
    let layer2 = result.layer2 || [];

    // Apply TSP Path Optimization if enabled
    if (this.state.optimizePaths) {
      layer1 = this.plotter.optimizePaths(layer1);
      layer2 = this.plotter.optimizePaths(layer2);
    }

    this.state.pathsLayer1 = layer1;
    this.state.pathsLayer2 = layer2;

    // Compute statistics
    this.state.stats = this.plotter.calculateStats(layer1, layer2);
    this.updateStatsUI();

    // Render on canvas
    this.renderCanvas();

    // Update simulation engine
    if (this.simulator.isPlaying) {
      this.simulator.loadPaths(layer1, layer2, this.state.bounds);
      this.simulator.play();
    }
  }

  updateStatsUI() {
    const s = this.state.stats;
    if (!s) return;

    document.getElementById("statDistance").textContent = `${s.drawDistanceM} m`;
    document.getElementById("statLifts").textContent = s.totalLifts;
    document.getElementById("statTime").textContent = s.estimatedTimeStr;
    document.getElementById("statPaths").textContent = s.pathCount;
  }

  updateSimulatorUI(simState) {
    const scrubber = document.getElementById("simScrubber");
    if (scrubber && !this.state.isScrubbing) {
      scrubber.value = Math.round(simState.progress * 100);
    }

    const posEl = document.getElementById("simCoords");
    if (posEl && simState.currentPos) {
      posEl.textContent = `X: ${simState.currentPos.x.toFixed(1)}mm  Y: ${simState.currentPos.y.toFixed(1)}mm`;
    }

    const stateEl = document.getElementById("simPenState");
    if (stateEl) {
      stateEl.textContent = simState.isPenDown ? "PEN DOWN (INK)" : "PEN UP (RAPID)";
      stateEl.style.color = simState.isPenDown ? "#10b981" : "#f59e0b";
    }

    if (simState.completed) {
      document.getElementById("simPlayBtn").textContent = "▶";
      this.showToast("Plot simulation finished!");
    }
  }

  renderCanvas(simState = null) {
    const bounds = this.state.bounds;
    if (!bounds) return;

    const pw = bounds.paperWidth;
    const ph = bounds.paperHeight;

    // Physical millimeter to screen pixel scale
    // e.g., 3.8 pixels per mm for sharp display
    const pxPerMm = 4.0;
    const canvasW = Math.round(pw * pxPerMm);
    const canvasH = Math.round(ph * pxPerMm);

    if (this.canvas.width !== canvasW || this.canvas.height !== canvasH) {
      this.canvas.width = canvasW;
      this.canvas.height = canvasH;
      this.canvas.style.width = `${pw * 2.8}px`;
      this.canvas.style.height = `${ph * 2.8}px`;
      this.updateMarginOverlay(pw, ph, bounds.marginMm);
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(pxPerMm, pxPerMm);

    // Draw Paper Background
    const paperPreset = PAPER_PRESETS.find(p => p.id === this.state.paperColorId) || PAPER_PRESETS[0];
    ctx.fillStyle = paperPreset.color;
    ctx.fillRect(0, 0, pw, ph);

    // Subtle paper grain effect
    ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < pw; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, ph);
      ctx.stroke();
    }

    // Pen colors
    const pen1 = PEN_PRESETS.find(p => p.id === this.state.pen1ColorId) || PEN_PRESETS[0];
    const pen2 = PEN_PRESETS.find(p => p.id === this.state.pen2ColorId) || PEN_PRESETS[4];
    const strokeWidth = this.state.strokeWidthMm;

    // Standard static render vs Simulation render
    if (!simState || simState.progress === 0) {
      // Layer 1
      ctx.strokeStyle = pen1.color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      this.state.pathsLayer1.forEach(p => {
        if (p.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) {
          ctx.lineTo(p[i].x, p[i].y);
        }
        ctx.stroke();
      });

      // Layer 2
      if (this.state.pathsLayer2.length > 0) {
        ctx.strokeStyle = pen2.color;
        ctx.lineWidth = strokeWidth;
        this.state.pathsLayer2.forEach(p => {
          if (p.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(p[0].x, p[0].y);
          for (let i = 1; i < p.length; i++) {
            ctx.lineTo(p[i].x, p[i].y);
          }
          ctx.stroke();
        });
      }
    } else {
      // Simulation mode: render up to current step
      const segments = this.simulator.segments;
      const curStep = simState.currentStep;

      for (let i = 0; i <= curStep && i < segments.length; i++) {
        const seg = segments[i];
        if (seg.type === "down") {
          ctx.strokeStyle = seg.layer === 2 ? pen2.color : pen1.color;
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        } else if (seg.type === "up") {
          // Draw faint pen-up air jump travel
          ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
          ctx.lineWidth = 0.2;
          ctx.setLineDash([1, 1]);
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Virtual Pen Head Carriage
      const pos = simState.currentPos;
      if (pos) {
        ctx.save();
        // Pen shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.arc(pos.x + 0.6, pos.y + 0.6, 2.0, 0, Math.PI * 2);
        ctx.fill();

        // Pen carriage ring
        ctx.strokeStyle = simState.isPenDown ? "#10b981" : "#f59e0b";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.stroke();

        // Pen tip dot
        ctx.fillStyle = simState.isPenDown ? pen1.color : "#ffffff";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  updateMarginOverlay(pw, ph, marginMm) {
    if (!this.marginOverlay) return;
    const scale = 2.8; // matches canvas visual display
    this.marginOverlay.style.left = `${marginMm * scale}px`;
    this.marginOverlay.style.top = `${marginMm * scale}px`;
    this.marginOverlay.style.width = `${(pw - marginMm * 2) * scale}px`;
    this.marginOverlay.style.height = `${(ph - marginMm * 2) * scale}px`;
  }

  // Pan & Zoom
  zoom(factor) {
    this.state.zoom = Math.max(0.3, Math.min(4.0, this.state.zoom * factor));
    this.updateTransform();
  }

  fitToScreen() {
    this.state.panX = 0;
    this.state.panY = 0;
    if (this.canvasWrapper && this.state.bounds) {
      const wrapperW = Math.max(200, this.canvasWrapper.clientWidth - 80);
      const wrapperH = Math.max(200, this.canvasWrapper.clientHeight - 80);
      const paperW = this.state.bounds.paperWidth * 2.8;
      const paperH = this.state.bounds.paperHeight * 2.8;
      const scaleX = wrapperW / paperW;
      const scaleY = wrapperH / paperH;
      this.state.zoom = Math.min(1.15, Math.max(0.4, Math.min(scaleX, scaleY)));
    } else {
      this.state.zoom = 1.0;
    }
    this.updateTransform();
    this.showToast("Canvas Centered & Fitted ⛶");
  }

  updateTransform() {
    if (this.paperSheet) {
      this.paperSheet.style.transform = `translate(${this.state.panX}px, ${this.state.panY}px) scale(${this.state.zoom})`;
    }
  }

  // Export functions
  exportSVG() {
    const pen1 = PEN_PRESETS.find(p => p.id === this.state.pen1ColorId) || PEN_PRESETS[0];
    const pen2 = PEN_PRESETS.find(p => p.id === this.state.pen2ColorId) || PEN_PRESETS[4];

    const svg = this.plotter.generateSVG(
      this.state.bounds,
      this.state.pathsLayer1,
      this.state.pathsLayer2,
      {
        color1: pen1.color,
        color2: pen2.color,
        strokeWidth: this.state.strokeWidthMm
      }
    );

    const filename = `plotter_${this.state.currentAlgoId}_seed${this.state.seed}.svg`;
    this.plotter.downloadSVG(filename, svg);
    this.showToast(`Saved ${filename} (Ready to plot!)`);
  }

  async copySVG() {
    const pen1 = PEN_PRESETS.find(p => p.id === this.state.pen1ColorId) || PEN_PRESETS[0];
    const pen2 = PEN_PRESETS.find(p => p.id === this.state.pen2ColorId) || PEN_PRESETS[4];

    const svg = this.plotter.generateSVG(
      this.state.bounds,
      this.state.pathsLayer1,
      this.state.pathsLayer2,
      {
        color1: pen1.color,
        color2: pen2.color,
        strokeWidth: this.state.strokeWidthMm
      }
    );

    const success = await this.plotter.copySVGToClipboard(svg);
    if (success) {
      this.showToast("SVG copied to clipboard! (Paste directly into Inkscape)");
    } else {
      this.showToast("Could not access clipboard");
    }
  }

  exportPNG() {
    const filename = `art_${this.state.currentAlgoId}_seed${this.state.seed}.png`;
    this.plotter.downloadPNG(this.canvas, filename);
    this.showToast(`Saved PNG preview snapshot!`);
  }

  showToast(msg) {
    let toast = document.getElementById("appToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
}

// Start app on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
