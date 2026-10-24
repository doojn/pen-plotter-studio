# 🖋️ Algorithmic Pen Plotter Art & Generative Art Studio

An interactive, beginner-friendly web application designed specifically for **Generative Art & Pen Plotter Workshops**.

Participants can start with zero coding experience, explore foundational algorithmic art generators, customize rules, seeds, and mathematical equations with live visual feedback, test their designs with an animated pen plotter simulator, and export clean, machine-ready SVGs for physical plotting on machines like the **AxiDraw**, **iDraw**, **Cricut**, or **GRBL CNCs**.

---

## 🚀 Instant Deployment to GitHub Pages (Under 1 Minute)

This studio is a **zero-build, pure client-side static web application** (HTML5 + CSS3 + Vanilla ES6 JS). There are no Node.js build steps, no backend servers, and no dependencies to install.

### How to host it for your workshop participants:
1. **Push or Fork this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Pen Plotter Studio"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository, click **Settings** (top navigation bar).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment > Branch**:
   - Select `main` (or `master`).
   - Select folder: `/ (root)`.
   - Click **Save**.
5. Within 30 seconds, your workshop website is live at:
   `https://<your-username>.github.io/<your-repo-name>/`
6. Share this URL with your participants—they can open it on Mac, Windows, Linux, iPad, or Chromebook without installing anything!

### Running Locally (Offline)
- **Option 1**: Simply double-click `index.html` to open it directly in any modern browser (Chrome, Safari, Firefox, Edge).
- **Option 2**: Run a lightweight local server:
  ```bash
  # Using Node (npx)
  npx serve .
  
  # Or using Python
  python3 -m http.server 8080
  ```

---

## 🎨 The 8 Foundational Generative Algorithms

Every algorithm comes with beginner-friendly explanations, intuitive parameter sliders, and 4–5 curated starter recipes:

| Algorithm | Real-World Analogy | Key Plotter Highlight |
|---|---|---|
| **🌊 Perlin Flow Fields** | Dandelion seeds drifting on an invisible river or wind currents | Smooth organic curves with collision avoidance to prevent ink bleeding |
| **🏔️ Mountain Ridge Waves** | Joy Division pulsar plot / topographic elevation scanlines | Authentic **3D hidden-line occlusion**—foreground peaks cleanly hide background valleys |
| **♾️ Harmonograph & Spirographs** | Swinging physical pendulums & interlocking mechanical gears | Musical harmonic resonance and banknote guilloché rosettes |
| **🧩 Truchet Modular Tiles** | Ceramic street tiles and train tracks snapped together | Endlessly winding labyrinths and parallel ribbon highways |
| **🎯 Concentric Moiré Rings** | Overlapping ripples from raindrops on a calm pond surface | Optical depth and illusion of movement using thin vector lines |
| **🌳 Fractal Branching Trees** | Natural tree growth, river deltas, and lightning bolts | Recursive geometry with delicate multi-layer twigs |
| **➰ Continuous Single-Line Meanders** | Space-filling Hilbert curves and self-avoiding walks | **Zero pen lifts!** The pen drops once and draws the entire piece continuously |
| **💻 Live Code & Math Sandbox** | Writing custom formulas ($r = \cos(A \cdot \theta) \cdot \dots$) | Absolute beginners take their first steps editing math expressions live |

---

## 🛠️ Features Built Specifically for Pen Plotters

Unlike generic generative art canvases, this studio was built around the physical realities of computer-controlled pens:

- **Hardware Dimensions**: Standard **ISO A5 (148 × 210 mm)**, **A4 (210 × 297 mm)**, **A3**, **US Letter**, **Square (200 × 200 mm)**, and **Postcard**.
- **Safe Margin Clearance**: Dedicated margin control (default 12mm) with visual boundary guides to prevent pen carriages from crashing into binder clips.
- **⚡ Greedy TSP Path Optimization**:
  - Reorders disconnected paths using Nearest-Neighbor Traveling Salesperson sorting.
  - Automatically reverses strokes when drawing from the tail is closer.
  - **Cuts total plotting time by up to 50%** and minimizes rapid pen lifts.
- **🤖 Interactive Pen Plotter Simulator**:
  - Watch the virtual pen carriage draw line-by-line in real-time.
  - Distinct visualization for **Pen Down (solid ink)** vs **Pen Up (faint air jumps)**.
  - Play, pause, scrub slider, and speed control (1x to 25x).
- **Realistic Paper & Pen Previews**:
  - Paper stocks: Heavy White Bristol, Warm Cream Moleskine, Charcoal Black, Natural Kraft, Blueprint Indigo.
  - Pen types: Sakura Micron 0.3mm/0.5mm, Gelly Roll White 0.5mm, Metallic Gold Gel, Prussian Blue Fountain Pen, Vivid Crimson.
- **Dual-Layer & Multi-Pen Plotting**:
  - Algorithms support splitting lines across **Layer 1 (Main Pen)** and **Layer 2 (Accent Pen)**.
- **Universal Clean Vector SVG Export**:
  - Sized in real physical units (`mm`), clean `<path>` definitions (`fill="none"`).
  - Compatible with **AxiDraw Inkscape Extension**, **vpype**, **CNC GRBL**, and **LaserWeb**.

---

## 🎓 Recommended Workshop Lesson Outline (90–120 Minutes)

Here is a tested curriculum structure for leading absolute beginners to successful physical plots:

### Part 1: Welcome & Demystifying the Machine (15 min)
- Show the physical pen plotter running a quick test.
- Explain how it works: $X/Y$ gantry, stepper motors, servo pen lift mechanism.
- Contrast raster pixels (screen dots) with vector paths (continuous coordinate trails).

### Part 2: What is an Algorithm in Art? (20 min)
- An algorithm is simply a **recipe**: rules, repetition, variation, and randomness.
- Introduce the **Seed**: explain that random numbers in computers aren't truly random—they are repeatable sequences initiated by a seed number (e.g. `4242`).
- Have everyone open the website, pick **Perlin Flow Fields**, and test clicking **🎲 Roll Seed** to see how one number changes the entire composition.

### Part 3: The 3 Physical Constraints of Plotting (15 min)
1. **Rule 1: No Solid Fills.** Plotters only draw outlines. Dense shading requires hatching or contours.
2. **Rule 2: Mind the Margins.** Leave space for clips so the pen doesn't jam!
3. **Rule 3: Ink Bleed & Travel Time.** Fewer pen lifts mean faster, cleaner plots without ink dots.

### Part 4: Hands-On Customization & Code Sandbox (30 min)
- Participants pick their favorite algorithm from the 8 choices.
- They dial in parameters, adjust paper size, and pick a custom color theme.
- For curious participants, direct them to the **💻 Math & Code** tab or **Live Code Sandbox** to tweak numbers inside mathematical formulas.
- Run the **▶️ Simulate Draw** feature to inspect total drawing distance and estimated time.

### Part 5: Exporting & The Physical Plotting Queue (30–45 min)
- Participants click **📥 Download SVG**.
- Load SVGs into Inkscape on the plotting laptop:
  - *Extensions > AxiDraw Control > Plot*.
- Each participant watches their generative design physically penned into real paper!

---

## 📁 Repository Structure

```text
├── index.html            # Main workshop studio web application
├── styles.css            # Responsive dark studio UI styles
├── js/
│   ├── noise.js          # Deterministic PRNG & Simplex Noise engine
│   ├── algorithms.js     # 8 core generative art algorithms + presets
│   ├── plotter.js        # TSP path optimizer, physical bounds, SVG generator
│   ├── simulator.js      # Animated pen plotter simulation engine
│   └── app.js            # UI controller, pan/zoom canvas, state management
├── image_to_path.html    # Bonus tool: Raster image to continuous path vectorizer
└── README.md             # Workshop instructor & participant guide
```

---

## 💡 Troubleshooting & Workshop Tips

- **Pen height adjustment**: When inserting the pen into the plotter clamp, raise the servo to the "UP" position first. Place a scrap piece of cardstock (~2mm) under the pen tip, drop the pen to rest on the cardstock, tighten the thumbscrew, and remove the cardstock. This ensures the pen never drags when travelling!
- **Paper clamping**: Use low-profile bulldog clips or masking tape on the paper corners. Always keep your artwork margins at $\ge 12\text{ mm}$ to clear the clips.
- **Pen drying**: If using fine-tip pens (like 0.3mm Microns), test the pen on a scrap sheet right before starting the plot to ensure the ink is flowing.

---

Crafted with ❤️ for generative artists, educators, and pen plotter enthusiasts.
