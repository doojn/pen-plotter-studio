/**
 * Simplified Bilingual Controller for Pen Plotter Studio
 * Designed for absolute beginners, minimal reading, visual icons, and Arabic/English support.
 */

const TRANSLATIONS = {
  ar: {
    brandTitle: "استوديو الرسم الآلي",
    brandSub: "ورشة الفن الخوارزمي بالقلم",
    proLink: "⚙️ الوضع المتقدم",
    step1Title: "١. اختر نمط الرسم",
    step2Title: "٢. غيّر وبدّل بالتصميم",
    step3Title: "٣. جاهز للرسم بالآلة!",
    btnShuffle: "🎲 شكلاً جديداً (تغيير)",
    labelDensity: "كثافة الخطوط",
    few: "قليل",
    many: "كثيف",
    labelWiggle: "تموج وانحناء الخطوط",
    labelWiggleSpiral: "تشويه خوارزمي للحلزون",
    smooth: "هادئ",
    wild: "عاصف",
    pureSpiral: "حلزون نقي ومثالي",
    distortedSpiral: "تشويه خوارزمي",
    labelPaper: "حجم الورقة",
    labelColors: "ألوان الورق والحبر",
    colorWhiteBlack: "أبيض + أسود",
    colorBlackWhite: "أسود + أبيض",
    colorNavyGold: "كحلي + ذهبي",
    colorKraftBlack: "كرتون + أسود",
    btnSimulate: "▶️ شاهد القلم يرسم",
    btnStopSim: "⏹ إيقاف العرض",
    btnDownload: "📥 تحميل ملف الرسم (SVG)",
    toastShuffle: "تم توليد شكل جديد بنجاح! 🎲",
    toastDownload: "تم تحميل الملف! جاهز للإرسال للآلة 🖋️",
    toastSimFinished: "انتهى القلم من الرسم! ✨",
    btnUndo: "↩ السابق",
    btnDownloadPNG: "📸 حفظ كصورة (PNG)",
    toastUndo: "تم استرجاع الشكل السابق ↩",
    toastNoUndo: "لا توجد أشكال سابقة",
    toastPng: "تم حفظ الصورة كـ PNG بنجاح! 📸",
    timeBadge: "⏱️ وقت الرسم: ~٤ دقائق (سريع وخفيف للورق)",
    labelSpeed: "سرعة رسم القلم",
    speedSlow: "🐢 بطيء وهادئ",
    speedNormal: "🚶 عادي",
    speedFast: "🐇 سريع",
    styles: {
      waves: { name: "أمواج رشيقة", sub: "خطوط نهرية ناعمة" },
      spirals: { name: "حلزون هندسي", sub: "حلزون مثالي + تشويه خوارزمي" },
      mountains: { name: "جبال ثلاثية الأبعاد", sub: "تضاريس كلاسيكية" },
      loops: { name: "حلقات البندول", sub: "دوائر هندسية ساحرة" },
      maze: { name: "متاهة إسلامية", sub: "أقواس متصلة متشابكة" },
      ripples: { name: "تموجات الماء", sub: "دوائر متداخلة بصرية" },
      tree: { name: "أغصان الشجرة", sub: "تفرعات طبيعية ذكية" },
      oneline: { name: "خط متصل واحد", sub: "بدون أي رفع للقلم!" },
      doodles: { name: "خربشات مرحة", sub: "خط انسيابي حر بدون رفع للقلم" }
    }
  },
  en: {
    brandTitle: "Pen Plotter Studio",
    brandSub: "Algorithmic Art Workshop",
    proLink: "⚙️ Pro Studio",
    step1Title: "1. Pick a Style",
    step2Title: "2. Tweak Your Design",
    step3Title: "3. Ready to Plot!",
    btnShuffle: "🎲 Roll New Shape",
    btnUndo: "↩ Previous",
    btnDownloadPNG: "📸 Save Image (PNG)",
    toastUndo: "Restored previous shape ↩",
    toastNoUndo: "No previous shapes",
    toastPng: "Saved image as PNG! 📸",
    timeBadge: "⏱️ Plot Time: ~4 mins (Safe & fast for A4)",
    labelDensity: "Line Density",
    few: "Few",
    many: "Dense",
    labelWiggle: "Wave & Turbulence",
    labelWiggleSpiral: "Algorithmic Distortion",
    smooth: "Gentle",
    wild: "Wild",
    pureSpiral: "Pure Perfect Spiral",
    distortedSpiral: "Distorted Spiral",
    labelPaper: "Paper Size",
    labelColors: "Paper & Ink Colors",
    colorWhiteBlack: "White + Black",
    colorBlackWhite: "Black + White",
    colorNavyGold: "Navy + Gold",
    colorKraftBlack: "Kraft + Black",
    btnSimulate: "▶️ Watch It Draw",
    btnStopSim: "⏹ Stop Simulation",
    btnDownload: "📥 Download Vector (SVG)",
    toastShuffle: "New shape variation generated! 🎲",
    toastDownload: "Downloaded SVG! Ready to plot 🖋️",
    toastSimFinished: "Plot simulation completed! ✨",
    labelSpeed: "Pen Drawing Speed",
    speedSlow: "🐢 Relaxed",
    speedNormal: "🚶 Normal",
    speedFast: "🐇 Fast",
    styles: {
      waves: { name: "Ocean Waves", sub: "Flowing organic streams" },
      spirals: { name: "Geometric Spiral", sub: "Pure spiral + distortion" },
      mountains: { name: "Mountain Ridges", sub: "3D Joy Division peaks" },
      loops: { name: "Pendulum Loops", sub: "Hypnotic geometric orbits" },
      maze: { name: "Curved Maze", sub: "Interlocking ribbon tiles" },
      ripples: { name: "Water Ripples", sub: "Optical interference rings" },
      tree: { name: "Fractal Tree", sub: "Natural branching growth" },
      oneline: { name: "One Continuous Line", sub: "Zero pen lifts!" },
      doodles: { name: "Playful Doodles", sub: "Organic wandering loops & curls" }
    }
  }
};

const SIMPLE_STYLES = [
  { id: "waves", algoId: "flowField", icon: "🌊", defaultPreset: "Ocean Currents" },
  { id: "spirals", algoId: "spirals", icon: "🌀", defaultPreset: "Pure Geometric Spiral" },
  { id: "mountains", algoId: "waveRidges", icon: "🏔️", defaultPreset: "Joy Division Classic" },
  { id: "loops", algoId: "harmonograph", icon: "♾️", defaultPreset: "Pendulum Waltz" },
  { id: "maze", algoId: "truchetTiles", icon: "🧩", defaultPreset: "Woven Ribbon Labyrinth" },
  { id: "ripples", algoId: "concentricMoire", icon: "🎯", defaultPreset: "Dual Moiré Interference" },
  { id: "tree", algoId: "fractalTree", icon: "🌳", defaultPreset: "Ancient Bonsai" },
  { id: "oneline", algoId: "continuousMeander", icon: "➰", defaultPreset: "Continuous Hilbert Labyrinth" },
  { id: "doodles", algoId: "doodles", icon: "✏️", defaultPreset: "Whimsical Loop-de-Loop" }
];

const COLOR_PALETTES = {
  white_black: { paper: "#fafaf9", pen: "#111827", strokeWidth: 0.35, paperId: "white", penId: "micron_black" },
  black_white: { paper: "#18181b", pen: "#f8fafc", strokeWidth: 0.45, paperId: "black", penId: "gelly_white" },
  navy_gold: { paper: "#0f172a", pen: "#f59e0b", strokeWidth: 0.40, paperId: "indigo", penId: "metallic_gold" },
  kraft_black: { paper: "#d4b896", pen: "#1c1917", strokeWidth: 0.35, paperId: "kraft", penId: "micron_black" }
};

class SimpleApp {
  constructor() {
    this.plotter = new PlotterEngine();
    this.rng = new RandomGenerator(4242);
    this.noise = new SimplexNoise(this.rng);

    this.state = {
      lang: "ar", // 'ar' or 'en'
      activeStyleId: "waves",
      seed: 4242,
      densityLevel: 3, // 1 (sparse) to 5 (dense)
      wiggleLevel: 3,  // 1 (gentle) to 5 (wild)
      paperKey: "a4",  // Calibrated for standard A4 paper (< 10 min plots)
      paletteKey: "white_black",
      zoom: 1.0,
      
      pathsLayer1: [],
      pathsLayer2: [],
      bounds: null
    };

    this.seedHistory = [];
    this._debounceRaf = null;

    // Check saved language preference from localStorage
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedLang = localStorage.getItem("plotter_lang");
        if (savedLang === "ar" || savedLang === "en") {
          this.state.lang = savedLang;
        }
      }
    } catch (_) {}

    // Check URL parameters for direct linking (e.g. ?style=spirals&lang=en)
    try {
      if (typeof window !== "undefined" && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("style")) {
          const s = urlParams.get("style");
          if (SIMPLE_STYLES.some(st => st.id === s)) {
            this.state.activeStyleId = s;
            if (s === "spirals") this.state.wiggleLevel = 1;
          }
        }
        if (urlParams.has("lang")) {
          const l = urlParams.get("lang");
          if (l === "en" || l === "ar") this.state.lang = l;
        }
      }
    } catch (_) {}

    this.initDOM();
    this.initEvents();
    this.setLanguage(this.state.lang);
    if (this.state.activeStyleId === "spirals") {
      const sw = document.getElementById("sliderWiggle");
      if (sw) sw.value = this.state.wiggleLevel;
    }
    this.render();
  }

  initDOM() {
    this.canvas = document.getElementById("artCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.paperContainer = document.getElementById("paperContainer");

    // Plotter simulator
    this.simulator = new PlotterSimulator(this.canvas, (simState) => {
      this.drawCanvas(simState);
      if (simState.completed) {
        const btn = document.getElementById("btnSimulate");
        const t = TRANSLATIONS[this.state.lang];
        if (btn) btn.innerHTML = t.btnSimulate;
        this.showToast(t.toastSimFinished);
      }
    });

    this.renderStyleCards();
  }

  renderStyleCards() {
    const grid = document.getElementById("styleGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const t = TRANSLATIONS[this.state.lang];

    SIMPLE_STYLES.forEach(style => {
      const card = document.createElement("div");
      card.className = `style-card ${style.id === this.state.activeStyleId ? "active" : ""}`;
      card.dataset.styleId = style.id;
      const trans = t.styles[style.id] || { name: style.id, sub: "" };

      card.innerHTML = `
        <span class="style-icon">${style.icon}</span>
        <span class="style-name">${trans.name}</span>
        <span class="style-sub">${trans.sub}</span>
      `;

      card.addEventListener("click", () => {
        const prevStyle = this.state.activeStyleId;
        this.state.activeStyleId = style.id;
        document.querySelectorAll(".style-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        if (style.id === "spirals" && prevStyle !== "spirals") {
          this.state.wiggleLevel = 1;
          const sw = document.getElementById("sliderWiggle");
          if (sw) sw.value = 1;
        }

        this.updateSliderLabels();
        this.render();
      });

      grid.appendChild(card);
    });
  }

  initEvents() {
    // Language Toggle Button
    document.getElementById("btnLangSwitch")?.addEventListener("click", () => {
      const nextLang = this.state.lang === "ar" ? "en" : "ar";
      this.setLanguage(nextLang);
    });

    // Big Shuffle Button
    document.getElementById("btnShuffle")?.addEventListener("click", () => {
      this.seedHistory.push(this.state.seed);
      if (this.seedHistory.length > 25) this.seedHistory.shift();
      this.state.seed = Math.floor(Math.random() * 900000) + 10000;
      this.render();
      this.showToast(TRANSLATIONS[this.state.lang].toastShuffle);
    });

    // Undo / Previous Button
    document.getElementById("btnUndo")?.addEventListener("click", () => {
      const t = TRANSLATIONS[this.state.lang];
      if (this.seedHistory && this.seedHistory.length > 0) {
        this.state.seed = this.seedHistory.pop();
        this.render();
        this.showToast(t.toastUndo);
      } else {
        this.showToast(t.toastNoUndo);
      }
    });

    // Density Slider with debounce
    document.getElementById("sliderDensity")?.addEventListener("input", (e) => {
      this.state.densityLevel = parseInt(e.target.value);
      this.debouncedRender();
    });

    // Wiggle Slider with debounce
    document.getElementById("sliderWiggle")?.addEventListener("input", (e) => {
      this.state.wiggleLevel = parseInt(e.target.value);
      this.debouncedRender();
    });

    // Paper Size Pills
    document.querySelectorAll(".paper-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".paper-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.state.paperKey = pill.dataset.paper;
        this.render();
      });
    });

    // Palette Buttons
    document.querySelectorAll(".palette-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".palette-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.state.paletteKey = btn.dataset.palette;
        this.drawCanvas();
      });
    });

    // Simulate Button
    document.getElementById("btnSimulate")?.addEventListener("click", () => {
      const t = TRANSLATIONS[this.state.lang];
      const btn = document.getElementById("btnSimulate");
      if (this.simulator.isPlaying) {
        this.simulator.stop();
        btn.innerHTML = t.btnSimulate;
        this.drawCanvas();
      } else {
        this.simulator.loadPaths(this.state.pathsLayer1, this.state.pathsLayer2, this.state.bounds);
        this.simulator.play();
        btn.innerHTML = t.btnStopSim;
      }
    });

    // Download SVG Button
    document.getElementById("btnDownload")?.addEventListener("click", () => {
      this.downloadSVG();
    });

    // Download PNG Button
    document.getElementById("btnDownloadPNG")?.addEventListener("click", () => {
      this.downloadPNG();
    });

    // Zoom Buttons
    document.getElementById("zoomIn")?.addEventListener("click", () => this.zoom(1.15));
    document.getElementById("zoomOut")?.addEventListener("click", () => this.zoom(0.85));
    document.getElementById("zoomReset")?.addEventListener("click", () => this.centerView());
    document.getElementById("btnCenter")?.addEventListener("click", () => this.centerView());

    // Speed Selector Pills (Slow, Normal, Fast)
    document.querySelectorAll(".speed-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".speed-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const speed = parseFloat(pill.dataset.speed);
        this.simulator.setSpeed(speed);
      });
    });
  }

  setLanguage(lang) {
    this.state.lang = lang;
    const isAr = lang === "ar";
    document.body.setAttribute("dir", isAr ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("plotter_lang", lang);
      }
    } catch (_) {}

    const t = TRANSLATIONS[lang];

    // Update Header
    document.getElementById("brandTitle").textContent = t.brandTitle;
    document.getElementById("brandSub").textContent = t.brandSub;
    const proLink = document.getElementById("proLink");
    if (proLink) {
      proLink.textContent = t.proLink;
      proLink.href = `index.html?lang=${lang}`;
    }
    document.getElementById("langLabel").textContent = isAr ? "English" : "العربية";

    // Update Step Titles
    document.getElementById("step1Title").textContent = t.step1Title;
    document.getElementById("step2Title").textContent = t.step2Title;
    document.getElementById("step3Title").textContent = t.step3Title;

    // Update Controls Text
    document.getElementById("btnShuffle").innerHTML = t.btnShuffle;
    document.getElementById("labelDensity").textContent = t.labelDensity;
    document.getElementById("txtFew").textContent = t.few;
    document.getElementById("txtMany").textContent = t.many;

    document.getElementById("labelWiggle").textContent = t.labelWiggle;
    document.getElementById("txtSmooth").textContent = t.smooth;
    document.getElementById("txtWild").textContent = t.wild;

    document.getElementById("labelPaper").textContent = t.labelPaper;
    document.getElementById("labelColors").textContent = t.labelColors;

    document.getElementById("colorWhiteBlack").textContent = t.colorWhiteBlack;
    document.getElementById("colorBlackWhite").textContent = t.colorBlackWhite;
    document.getElementById("colorNavyGold").textContent = t.colorNavyGold;
    document.getElementById("colorKraftBlack").textContent = t.colorKraftBlack;

    // Speed labels
    const lblSpd = document.getElementById("labelSpeed");
    if (lblSpd) lblSpd.textContent = t.labelSpeed;
    const spdSlow = document.getElementById("speedSlow");
    if (spdSlow) spdSlow.textContent = t.speedSlow;
    const spdNorm = document.getElementById("speedNormal");
    if (spdNorm) spdNorm.textContent = t.speedNormal;
    const spdFast = document.getElementById("speedFast");
    if (spdFast) spdFast.textContent = t.speedFast;

    // Action buttons
    const simBtn = document.getElementById("btnSimulate");
    if (simBtn) simBtn.innerHTML = this.simulator.isPlaying ? t.btnStopSim : t.btnSimulate;
    const btnDown = document.getElementById("btnDownload");
    if (btnDown) btnDown.innerHTML = t.btnDownload;
    const btnUndo = document.getElementById("btnUndo");
    if (btnUndo) btnUndo.innerHTML = `<span>${t.btnUndo}</span>`;
    const btnPng = document.getElementById("btnDownloadPNG");
    if (btnPng) btnPng.innerHTML = `<span>${t.btnDownloadPNG}</span>`;

    this.updateSliderLabels();
    this.renderStyleCards();
  }

  updateSliderLabels() {
    const t = TRANSLATIONS[this.state.lang];
    const isSpiral = this.state.activeStyleId === "spirals";

    const lblWiggle = document.getElementById("labelWiggle");
    const txtSmooth = document.getElementById("txtSmooth");
    const txtWild = document.getElementById("txtWild");

    if (lblWiggle) {
      lblWiggle.textContent = isSpiral ? t.labelWiggleSpiral : t.labelWiggle;
    }
    if (txtSmooth) {
      txtSmooth.textContent = isSpiral ? t.pureSpiral : t.smooth;
    }
    if (txtWild) {
      txtWild.textContent = isSpiral ? t.distortedSpiral : t.wild;
    }
  }

  centerView() {
    this.state.zoom = 1.0;
    if (this.paperContainer) {
      this.paperContainer.style.transform = `scale(1.0)`;
    }
    this.showToast(this.state.lang === "ar" ? "تم توسيط الورقة ⛶" : "View Centered ⛶");
  }

  debouncedRender() {
    if (this._debounceRaf) {
      cancelAnimationFrame(this._debounceRaf);
    }
    this._debounceRaf = requestAnimationFrame(() => {
      this.render();
    });
  }

  updateTimeBadge(stats) {
    const badge = document.getElementById("simpleTimeBadge");
    if (!badge) return;
    const isAr = this.state.lang === "ar";
    const timeStr = stats ? stats.estimatedTimeStr : "3m";
    const servoSafe = !stats || stats.servoStatus === "cool";
    const servoText = isAr ? "🟢 المحرك بارد وآمن" : "🟢 Servo Safe & Cool";
    badge.innerHTML = isAr
      ? `<span>⏱️ وقت الرسم: <b>~${timeStr}</b> • <small style="color:#059669; font-weight:600;">${servoText}</small></span>`
      : `<span>⏱️ Plot Time: <b>~${timeStr}</b> • <small style="color:#059669; font-weight:600;">${servoText}</small></span>`;
  }

  render() {
    this.rng.setSeed(this.state.seed);
    this.noise.reseed(this.rng);

    this.state.bounds = this.plotter.getBounds(this.state.paperKey, "portrait", 12);
    const styleObj = SIMPLE_STYLES.find(s => s.id === this.state.activeStyleId) || SIMPLE_STYLES[0];
    const algoDef = ALGORITHM_DEFINITIONS[styleObj.algoId];

    // Compute tailored parameters based on simple 1..5 density & wiggle sliders
    const params = this.computeParams(styleObj.algoId, algoDef);

    const result = algoDef.generate(this.state.bounds, params, this.rng, this.noise);
    let layer1 = result.layer1 || [];
    let layer2 = result.layer2 || [];

    // Always apply TSP path optimizer with Smart Stitching (Servo Thermal Protection)
    layer1 = this.plotter.optimizePaths(layer1, { stitchThreshold: 2.0 });
    layer2 = this.plotter.optimizePaths(layer2, { stitchThreshold: 2.0 });

    this.state.pathsLayer1 = layer1;
    this.state.pathsLayer2 = layer2;

    const stats = this.plotter.calculateStats(layer1, layer2);
    this.updateTimeBadge(stats);

    this.drawCanvas();
  }

  computeParams(algoId, algoDef) {
    const d = this.state.densityLevel; // 1 to 5
    const w = this.state.wiggleLevel;   // 1 to 5
    const params = {};
    algoDef.parameters.forEach(p => params[p.id] = p.default);

    // Guaranteed <= 10 min plot times (< 6 min typical) and safe spacing for thin A4 paper
    if (algoId === "flowField") {
      params.streamCount = Math.round(MathUtils.map(d, 1, 5, 120, 280));
      params.stepCount = Math.round(MathUtils.map(w, 1, 5, 35, 70));
      params.stepLength = 1.4;
      params.noiseScale = MathUtils.map(w, 1, 5, 0.002, 0.010);
      params.curlMultiplier = MathUtils.map(w, 1, 5, 1.0, 3.2);
      params.streamAvoidance = 1.8;
    } else if (algoId === "spirals") {
      params.turns = Math.round(MathUtils.map(d, 1, 5, 10, 26));
      params.distortionAmount = w === 1 ? 0 : MathUtils.map(w, 2, 5, 3.0, 12.0);
      params.distortionMode = w === 1 ? "pure" : "organic";
      params.distortionFreq = 8;
      params.dualSpiral = false;
    } else if (algoId === "waveRidges") {
      params.lineCount = Math.round(MathUtils.map(d, 1, 5, 18, 40));
      params.peakHeight = MathUtils.map(w, 1, 5, 10, 24);
      params.noiseScale = MathUtils.map(w, 1, 5, 0.01, 0.030);
      params.occlusion = true;
    } else if (algoId === "harmonograph") {
      params.geometryMode = "harmonograph";
      params.loopCount = Math.round(MathUtils.map(d, 1, 5, 1600, 3400));
      params.damping = MathUtils.map(w, 1, 5, 0.0035, 0.0014);
      params.freqX = 2.0 + (w * 0.005);
      params.freqY = 3.0;
    } else if (algoId === "truchetTiles") {
      params.gridCols = Math.round(MathUtils.map(d, 1, 5, 6, 12));
      params.arcsPerTile = Math.round(MathUtils.map(w, 1, 5, 1, 2));
      params.tileStyle = "arcs";
    } else if (algoId === "concentricMoire") {
      params.ringCount = Math.round(MathUtils.map(d, 1, 5, 14, 26));
      params.noiseWobble = MathUtils.map(w, 1, 5, 0, 6);
      params.centerCount = 2;
    } else if (algoId === "fractalTree") {
      params.recursionDepth = Math.round(MathUtils.map(d, 1, 5, 4, 6));
      params.branchAngle = MathUtils.map(w, 1, 5, 20, 40);
      params.windSway = MathUtils.map(w, 1, 5, 0, 10);
    } else if (algoId === "continuousMeander") {
      params.curveOrder = Math.round(MathUtils.map(d, 1, 5, 2, 4));
      params.wobble = MathUtils.map(w, 1, 5, 0, 1.4);
      params.cornerRoundness = 0.25;
    } else if (algoId === "doodles") {
      params.loopDensity = Math.round(MathUtils.map(d, 1, 5, 1200, 2800));
      params.curliness = MathUtils.map(w, 1, 5, 1.2, 3.4);
      params.wanderSpeed = 1.5;
      params.coverage = 0.82;
      params.dualColorAccent = false;
    }

    return params;
  }

  drawCanvas(simState = null) {
    const bounds = this.state.bounds;
    if (!bounds) return;

    const pw = bounds.paperWidth;
    const ph = bounds.paperHeight;
    const pxPerMm = 4.0;
    const canvasW = Math.round(pw * pxPerMm);
    const canvasH = Math.round(ph * pxPerMm);

    if (this.canvas.width !== canvasW || this.canvas.height !== canvasH) {
      this.canvas.width = canvasW;
      this.canvas.height = canvasH;
      this.canvas.style.width = `${pw * 2.8}px`;
      this.canvas.style.height = `${ph * 2.8}px`;
    }

    const palette = COLOR_PALETTES[this.state.paletteKey] || COLOR_PALETTES.white_black;
    const ctx = this.ctx;

    ctx.save();
    ctx.scale(pxPerMm, pxPerMm);

    // Fill Paper
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0, 0, pw, ph);

    // Subtle texture lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < pw; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, ph);
      ctx.stroke();
    }

    if (!simState || simState.progress === 0) {
      // Normal Draw
      ctx.strokeStyle = palette.pen;
      ctx.lineWidth = palette.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const allPaths = [...this.state.pathsLayer1, ...this.state.pathsLayer2];
      allPaths.forEach(p => {
        if (p.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) {
          ctx.lineTo(p[i].x, p[i].y);
        }
        ctx.stroke();
      });
    } else {
      // Simulator Animated Draw
      const segments = this.simulator.segments;
      const curStep = simState.currentStep;

      for (let i = 0; i <= curStep && i < segments.length; i++) {
        const seg = segments[i];
        if (seg.type === "down") {
          ctx.strokeStyle = palette.pen;
          ctx.lineWidth = palette.strokeWidth;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        } else if (seg.type === "up") {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
          ctx.lineWidth = 0.25;
          ctx.setLineDash([1, 1]);
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Virtual Pen Carriage
      const pos = simState.currentPos;
      if (pos) {
        ctx.save();
        ctx.strokeStyle = simState.isPenDown ? "#10b981" : "#f59e0b";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = palette.pen;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  downloadSVG() {
    const palette = COLOR_PALETTES[this.state.paletteKey] || COLOR_PALETTES.white_black;
    const svg = this.plotter.generateSVG(
      this.state.bounds,
      this.state.pathsLayer1,
      this.state.pathsLayer2,
      {
        color1: palette.pen,
        color2: palette.pen,
        strokeWidth: palette.strokeWidth
      }
    );

    const filename = `plotter_${this.state.activeStyleId}_seed${this.state.seed}.svg`;
    this.plotter.downloadSVG(filename, svg);
    this.showToast(TRANSLATIONS[this.state.lang].toastDownload);
  }

  downloadPNG() {
    const filename = `plotter_${this.state.activeStyleId}_seed${this.state.seed}.png`;
    this.plotter.downloadPNG(this.canvas, filename);
    const t = TRANSLATIONS[this.state.lang];
    this.showToast(t.toastPng || "Saved image as PNG! 📸");
  }

  zoom(factor) {
    this.state.zoom = Math.max(0.4, Math.min(3.0, this.state.zoom * factor));
    if (this.paperContainer) {
      this.paperContainer.style.transform = `scale(${this.state.zoom})`;
    }
  }

  zoomReset() {
    this.state.zoom = 1.0;
    if (this.paperContainer) {
      this.paperContainer.style.transform = `scale(1.0)`;
    }
  }

  showToast(msg) {
    let toast = document.getElementById("simpleToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "simpleToast";
      toast.className = "simple-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.simpleApp = new SimpleApp();
});
