/**
 * Workshop Pen Plotter Studio - Main Application Controller
 * Bilingual (Arabic RTL & English LTR) with customizable parameters & simulation.
 */

const APP_TRANSLATIONS = {
  ar: {
    langLabel: "English",
    logoTitle: "استوديو الراسم الآلي",
    logoSub: "ورشة الفن الخوارزمي بالقلم",
    linkSimple: "✨ الوضع المبسط",
    linkPhoto: "📷 صورة إلى مسار",
    btnGuide: "🎓 دليل الورشة",
    
    // Tabs
    tabAlgo: "🎨 الخوارزميات",
    tabSetup: "📐 الورق والقلم",
    tabCode: "💻 الرياضيات والكود",
    
    // Tab 1: Algorithms
    secAlgoTitle: "١. اختر الخوارزمية",
    badgeAlgo: "٩ نماذج أساسية",
    secPresetTitle: "٢. وصفات ونماذج جاهزة",
    badgePreset: "أنماط بنقرة واحدة",
    proBanner: '✨ جديد في الورشة؟ جرّب <a href="simple.html" id="linkToSimple">الاستوديو المبسط</a> بـ ٣ خطوات سهلة!',
    secSeedTitle: "٣. الرقم العشوائي (Seed)",
    badgeSeed: "قابل للتكرار",
    btnRollSeed: "🎲 رقم جديد",
    txtUndoSeed: "↩",
    toastUndoSeed: "تم استرجاع الرقم السابق ↩",
    toastNoUndoSeed: "لا توجد بذور سابقة",
    secParamTitle: "٤. تخصيص المعايير",
    badgeParam: "تعديل فوري",
    
    // Tab 2: Setup
    secPaperTitle: "أبعاد الورقة الفعلية",
    badgeHardware: "مواصفات الآلة",
    lblPaperSize: "حجم الورقة",
    lblOrientation: "اتجاه الورقة",
    optPortrait: "عمودي (رأسي)",
    optLandscape: "أفقي (عرضي)",
    lblMargin: "هامش الأمان (تجنب مشابك الورق)",
    lblPaperColor: "معاينة لون الورق والخامة",
    paperColors: {
      white: "ورق بريستول أبيض ناصع",
      cream: "ورق مولسكين كريمي دافئ",
      black: "ورق مقوى أسود فاحم",
      kraft: "كرتون طبيعي (كرافت)",
      indigo: "ورق نيلي مخطط ليلي"
    },
    secPenTitle: "اختيار الأقلام وتأثير الحبر",
    badgePen: "حبر الرسم",
    lblPen1: "القلم ١ (القلم الأساسي)",
    lblPen2: "القلم ٢ (قلم الزخرفة الإضافي)",
    pens: {
      micron_black: "ساكورا ميكرون ٠.٣ مم (أسود)",
      gelly_white: "جيلي رول ٠.٥ مم (جل أبيض)",
      metallic_gold: "جل ذهبي معدني ٠.٤ مم",
      fountain_blue: "قلم حبر سائل أزرق بروسي",
      crimson_red: "شاربي أحمر قرمزي زاهي",
      cyan_fine: "قلم سماوي دقيق ٠.٣ مم"
    },
    secOptTitle: "تحسين مسار القلم وحماية المحرك",
    badgeOpt: "تسريع وحماية",
    lblOpt: "⚡ خوارزمية TSP (ترتيب المسارات الأقرب)",
    lblServoProtection: "🛡️ حماية محرك القلم (دمج المسارات المتقاربة)",
    descOpt: "عند التفعيل، يعاد ترتيب الخطوط المنفصلة وتُدمج النقاط المتلاصقة (أقل من ٢ مم) بدون رفع القلم، مما يحمي محرك القلم (سيرفو) من السخونة ويقلل زمن الرسم بنسبة تصل إلى ٥٠٪.",
    secImageTitle: "التبديل إلى استوديو الصور",
    descImage: "هل ترغب في تحويل صورة شخصية أو فوتوغرافية إلى خطوط حلزونية متصلة بدلاً من الرياضيات التوليدية؟",
    btnImageStudio: "📷 فتح استوديو تحويل الصور إلى مسار",
    
    // Tab 3: Code & Math
    secCodeTitle: "منطق الخوارزمية والمعادلة",
    badgeCode: "جافاسكريبت",
    descCode: "كل عمل فني توليدي ينتج عن قواعد رياضية تنفذ بالتكرار داخل حلقات برمجية. هذا هو المنطق الأساسي للخوارزمية المحددة:",
    secRecipeTitle: "الوصفة الفنية الخوارزمية",
    recipePoint1: "<b>١. الأرقام العشوائية المحددة (Seeds):</b> يعتمد الفن الخوارزمي على أرقام شبه عشوائية تبدأ برقم محدد (مثل <code>4242</code>). في كل مرة تستخدم فيها نفس الرقم، تعيد الرياضيات رسم نفس الخطوط تماماً.",
    recipePoint2: "<b>٢. الخطوط المتجهة (Vectors):</b> بدلاً من بكسلات الشاشة، لا تفهم الراسمات الآلية إلا نقاط إحداثيات متصلة: <code>[{x: 10, y: 15}, {x: 12, y: 18}, ...]</code>.",
    recipePoint3: "<b>٣. القيود الميكانيكية للآلة:</b> بخلاف الشاشات، تمتلك الأقلام الحقيقية احتكاكاً، ويمتص الورق الحبر، وتستغرق رفعة القلم وقتاً ميكانيكياً. الخوارزميات ذات الرفعات الأقل ترسم أسرع وبنقاء أكبر!",
    
    // Top Toolbar
    btnFitView: "⛶ ملء الشاشة / توسيط",
    btnSimStart: "▶️ محاكاة الرسم",
    btnSimStop: "⏹ إيقاف المحاكاة",
    
    // Simulator panel
    simTitle: "🤖 محاكي الراسمة الآلية",
    simReady: "القلم جاهز",
    simDrawing: "جاري الرسم...",
    simSpeeds: {
      "0.25": "🐢 ٠.٢٥× (بطيء جداً)",
      "0.5": "🐢 ٠.٥× (بطيء وهادئ)",
      "1": "🚶 ١× (وقت حقيقي)",
      "2": "🐇 ٢× (سريع)",
      "5": "⚡ ٥× (فائق السرعة)"
    },
    
    // Bottom Dock Stats & Actions
    statDist: "مسافة الرسم",
    statLifts: "رفعات القلم",
    statTime: "الوقت المقدر",
    statPaths: "عدد المسارات",
    btnDownloadSVG: "📥 تحميل SVG",
    btnCopySVG: "📋 نسخ SVG",
    btnDownloadPNG: "📸 صورة PNG",
    
    // Toast messages
    toastSeed: "تم تحديث الرقم العشوائي إلى: ",
    toastPreset: 'تم تطبيق النمط: "',
    toastCopySuccess: "تم نسخ كود SVG إلى الحافظة! 📋",
    toastCopyFail: "فشل نسخ الكود، يرجى التنزيل كملف.",
    toastDownload: "تم بدء تنزيل ملف SVG! 🖋️",
    toastFitView: "تم توسيط الورقة وضبط العرض ⛶",
    
    // Modal Guide
    guideTitle: "🎓 دليل الورشة وورقة تعليمات الراسمة الآلية",
    guideH3_1: "🌟 ما هو الفن التوليدي الخوارزمي؟",
    guideP_1: "الفن التوليدي هو عمل فني ينشأ من تعاون وثيق بين الفنان البشري ونظام مستقل (الخوارزمية). بدلاً من رسم كل خط بيدك مباشرة، تقوم بتصميم القواعد والمعادلات الرياضية والتغيرات العشوائية. يحسب الحاسوب آلاف نقاط الإحداثيات، وتتولى الراسمة الآلية تحويلها إلى ضربات قلم ملموسة بالحبر على الورق الحقيقي!",
    guideH3_2: "🖋️ الخطوات الأربع: من الشاشة إلى الورق الملموس",
    guideStep1Title: "اختر خوارزميتك وخصصها:",
    guideStep1Desc: "اختر خوارزمية من القائمة الجانبية (حقول التدفق، السلاسل الجبلية، البندول، الحلزونات، إلخ). حرّك المنزلقات، وجرّب الوصفات الجاهزة، واضغط 🎲 رقم جديد حتى تصل إلى تكوين فني يعجبك.",
    guideStep2Title: "تأكد من هوامش الأمان للراسمة:",
    guideStep2Desc: "احرص على إبقاء هامش الأمان عند ١٢ مم أو أكثر لتجنب اصطدام رأس القلم بالمشابك المعدنية التي تثبت الورقة على سطح الآلة!",
    guideStep3Title: "شاهد محاكاة الرسم:",
    guideStep3Desc: "انقر على ▶️ محاكاة الرسم لمشاهدة حركة القلم الافتراضية فوق صفحتك، وانتبه لمسافة الرسم وعدد مرات رفع القلم.",
    guideStep4Title: "حمّل ملف SVG وابدأ الرسم الآلي:",
    guideStep4Desc: "انقر 📥 تحميل SVG، ثم افتح الملف في برنامج Inkscape المجاني، وصل الراسمة (مثل AxiDraw) عبر USB، واختر Extensions > AxiDraw > Plot، وشاهد أسطر الكود تتحول إلى لوحة فنية بالحبر الحقيقي!",
    guideH3_3: "💡 ٣ قواعد ذهبية للمبتدئين في الرسم بالآلة",
    guideRule1: "<b>لا توجد تعبئة، فقط خطوط:</b> الراسمة بالقلم لا تستطيع تلوين مساحات مصمتة مثل الطابعة المكتبية. التظليل يتم بالخطوط المتوازية الكثيفة، أو التهشير المتقاطع، أو التموجات المتشابكة.",
    guideRule2: "<b>انتبه لتشرب الحبر:</b> إذا توقف القلم في نقطة واحدة طويلاً أو كرر المرور، قد يتسرب الحبر في الورق. يقوم مصلح المسارات (TSP Optimizer) بإلغاء التكرارات لتفادي ذلك!",
    guideRule3: "<b>اضبط ارتفاع القلم أولاً:</b> عند تثبيت قلمك (ساكورا ميكرون، جل، أو حبر سائل)، تأكد أن سن القلم يرتفع نحو ٣ مم عن الورقة في وضع الرفع، ويلامس الورقة برفق وانسيابية في وضع الرسم.",
    guideH3_4: "🚀 ترشيحات الأقلام والأوراق المثالية",
    guidePensRec: "<b>أفضل الأقلام:</b> Sakura Pigma Micron (0.3mm / 0.5mm), Uni-ball Signo Broad (أبيض أو ذهبي ميتاليك), Pilot G2 Gel.",
    guidePapersRec: "<b>أفضل الورق:</b> ورق بريستول الناعم، ورق مقوى ثقيل (250+ جرام)، أو ورق Clairefontaine المخصص للأرشفة."
  },
  en: {
    langLabel: "العربية",
    logoTitle: "Plotter Studio",
    logoSub: "Algorithmic Art Workshop",
    linkSimple: "✨ Simple Mode",
    linkPhoto: "📷 Photo to Path",
    btnGuide: "🎓 Guide",
    
    // Tabs
    tabAlgo: "🎨 Algorithms",
    tabSetup: "📐 Paper & Pen",
    tabCode: "💻 Math & Code",
    
    // Tab 1: Algorithms
    secAlgoTitle: "1. Choose an Algorithm",
    badgeAlgo: "9 Core Models",
    secPresetTitle: "2. Starter Recipes",
    badgePreset: "1-Click Looks",
    proBanner: '✨ New to the workshop? Try the <a href="simple.html" id="linkToSimple">Simplified Studio</a> for a 3-step start!',
    secSeedTitle: "3. Seed & Variations",
    badgeSeed: "Reproducible",
    btnRollSeed: "🎲 Roll Seed",
    txtUndoSeed: "↩",
    toastUndoSeed: "Restored previous seed ↩",
    toastNoUndoSeed: "No previous seeds",
    secParamTitle: "4. Customize Parameters",
    badgeParam: "Live Tweak",
    
    // Tab 2: Setup
    secPaperTitle: "Physical Paper Dimensions",
    badgeHardware: "Hardware Specs",
    lblPaperSize: "Paper Size Format",
    lblOrientation: "Paper Orientation",
    optPortrait: "Portrait (Vertical)",
    optLandscape: "Landscape (Horizontal)",
    lblMargin: "Safe Margin (Clips Clearance)",
    lblPaperColor: "Paper Color / Stock Preview",
    paperColors: {
      white: "Heavy White Bristol Paper",
      cream: "Warm Cream Moleskine",
      black: "Charcoal Black Heavy Cardstock",
      kraft: "Natural Kraft Cardboard",
      indigo: "Midnight Blueprint Indigo"
    },
    secPenTitle: "Pen Selection & Stroke Preview",
    badgePen: "Drawing Ink",
    lblPen1: "Pen 1 (Primary Pen)",
    lblPen2: "Pen 2 (Accent Pen / Dual-Layer)",
    pens: {
      micron_black: "Sakura Micron 0.3mm (Black)",
      gelly_white: "Gelly Roll 0.5mm (White Gel)",
      metallic_gold: "Metallic Gold Gel 0.4mm",
      fountain_blue: "Prussian Blue Fountain Pen",
      crimson_red: "Vivid Crimson Sharpie",
      cyan_fine: "Electric Cyan Fine 0.3mm"
    },
    secOptTitle: "Plotter Path Optimization & Servo Protection",
    badgeOpt: "Speed & Thermal Safety",
    lblOpt: "⚡ TSP Path Optimization (Sort Nearest)",
    lblServoProtection: "🛡️ Servo Thermal Protection (Path Stitching)",
    descOpt: "When enabled, disconnected lines are reordered and close endpoints (<= 2mm) are seamlessly stitched without lifting the pen, preventing micro-servos from overheating and cutting plot time by up to 50%.",
    secImageTitle: "Switch to Image Studio",
    descImage: "Want to vectorize a portrait or photo into continuous squiggles instead of purely generative math?",
    btnImageStudio: "📷 Open Image-to-Path Studio",
    
    // Tab 3: Code & Math
    secCodeTitle: "Algorithm Logic & Formula",
    badgeCode: "JavaScript",
    descCode: "Every generative artwork is produced by mathematical rules executed repeatedly in loops. Here is the core logic running your selected algorithm:",
    secRecipeTitle: "The Generative Recipe",
    recipePoint1: "<b>1. Deterministic Seeds:</b> Generative art uses pseudo-random numbers seeded by a specific number (like <code>4242</code>). Every time you use that seed, the math reproduces the exact same strokes.",
    recipePoint2: "<b>2. Vector Polylines:</b> Instead of raster pixels, pen plotters only understand continuous coordinate points: <code>[{x: 10, y: 15}, {x: 12, y: 18}, ...]</code>.",
    recipePoint3: "<b>3. Physical Constraints:</b> Unlike screens, physical pens have friction, paper absorbs ink, and pen lifts take mechanical time. Algorithms with fewer lifts plot faster and cleaner!",
    
    // Top Toolbar
    btnFitView: "⛶ Fit View",
    btnSimStart: "▶️ Simulate Draw",
    btnSimStop: "⏹ Stop Simulation",
    
    // Simulator panel
    simTitle: "🤖 Pen Plotter Simulator",
    simReady: "PEN READY",
    simDrawing: "DRAWING...",
    simSpeeds: {
      "0.25": "🐢 0.25x (Super Slow)",
      "0.5": "🐢 0.5x (Slow & Relaxed)",
      "1": "🚶 1x (Real Time)",
      "2": "🐇 2x Speed",
      "5": "⚡ 5x Speed"
    },
    
    // Bottom Dock Stats & Actions
    statDist: "Draw Distance",
    statLifts: "Pen Lifts",
    statTime: "Est. Plot Time",
    statPaths: "Paths Count",
    btnDownloadSVG: "📥 Download SVG",
    btnCopySVG: "📋 Copy SVG",
    btnDownloadPNG: "📸 PNG",
    
    // Toast messages
    toastSeed: "Seed updated to: ",
    toastPreset: 'Applied preset: "',
    toastCopySuccess: "Copied SVG markup to clipboard! 📋",
    toastCopyFail: "Failed to copy SVG. Please download instead.",
    toastDownload: "Downloaded SVG! Ready to plot 🖋️",
    toastFitView: "View fitted to screen ⛶",
    
    // Modal Guide
    guideTitle: "🎓 Workshop Guide & Pen Plotter Cheatsheet",
    guideH3_1: "🌟 What is Algorithmic Generative Art?",
    guideP_1: "Generative art is art made by a collaboration between a human artist and an autonomous system (an algorithm). Instead of manually drawing individual lines, you design the <b>rules</b>, <b>mathematical formulas</b>, and <b>random variations</b>. The computer computes thousands of coordinate points, and a mechanical pen plotter physically draws the artwork with real ink on paper!",
    guideH3_2: "🖋️ The 4 Steps: From Screen to Physical Paper",
    guideStep1Title: "Choose & Tweak Your Algorithm:",
    guideStep1Desc: "Pick an algorithm on the left sidebar (Flow Fields, Mountain Ridges, Harmonographs, etc.). Tweak the sliders, test starter recipes, and hit <b>🎲 Roll Seed</b> until you love the composition.",
    guideStep2Title: "Check Plotter Safety Margins:",
    guideStep2Desc: "Keep the <i>Safe Margin</i> at 12mm or higher. This ensures the pen head never bumps into the metal binder clips holding your paper to the board!",
    guideStep3Title: "Simulate the Draw:",
    guideStep3Desc: "Click <b>▶️ Simulate Draw</b> to watch the virtual pen move across your page. Look out for pen lifts and total distance.",
    guideStep4Title: "Download SVG & Plot:",
    guideStep4Desc: "Click <b>📥 Download SVG</b>. Open the SVG in <b>Inkscape</b>, connect your AxiDraw or plotter via USB, select <i>Extensions > AxiDraw > Plot</i>, and watch your code come to life in physical ink!",
    guideH3_3: "💡 3 Golden Rules for Pen Plotting Beginners",
    guideRule1: "<b>No Fills, Only Strokes:</b> A pen plotter cannot paint solid fills like a desktop printer. Shading is achieved by dense parallel lines, cross-hatching, or tight squiggles.",
    guideRule2: "<b>Mind the Pen Bleed:</b> If a line stops for too long or overlaps repeatedly, wet ink can bleed through paper. Our TSP Path Optimizer eliminates duplicate visits!",
    guideRule3: "<b>Test Your Pen Height First:</b> When clamping your pen (Sakura Micron, gel pen, or fountain pen), ensure the pen tip sits ~3mm above the paper when raised, and rests gently on paper when lowered.",
    guideH3_4: "🚀 Recommended Pens & Papers",
    guidePensRec: "<b>Best Pens:</b> Sakura Pigma Micron (0.3mm or 0.5mm), Uni-ball Signo Broad (White or Metallic Gold), Pilot G2 Gel.",
    guidePapersRec: "<b>Best Paper:</b> Bristol Board (Smooth), Heavy Cardstock (250+ gsm), or Clairefontaine archival sketch paper."
  }
};

const ALGO_TRANSLATIONS = {
  ar: {
    flowField: {
      name: "حقل تدفق بيرلن",
      category: "ضجيج عضوي",
      explanation: "تتبع مسار مئات الجزيئات العائمة في نهر سائل خفي أو تيار رياح انسيابي.",
      beginnerTip: "جرّب زيادة 'تكبير الضجيج' للحصول على منحنيات ناعمة وواسعة!"
    },
    waveRidges: {
      name: "تضاريس السلاسل الجبلية",
      category: "تضاريس ثلاثية الأبعاد",
      explanation: "قمم تضاريس متدرجة مستوحاة من مخطط بلوزار جوي ديفيجن الكلاسيكي مع حجب الخطوط الخلفية.",
      beginnerTip: "فعّل 'حجب الخطوط الخلفية' للحصول على تأثير عمق ثلاثي الأبعاد واقعي!"
    },
    harmonograph: {
      name: "هارمونوغراف وبندول ليساجو",
      category: "فيزياء ميكانيكية",
      explanation: "محاكاة حركة نواسير متأرجحة متناغمة تضمحل تدريجياً لترسم منحنيات بصرية ساحرة.",
      beginnerTip: "فوارق التردد البسيطة (مثل 2.01 مقابل 3.0) تصنع مدارات هندسية آسرة!"
    },
    truchetTiles: {
      name: "بلاطات تروشيه الهندسية",
      category: "هندسة معمارية إسلامية",
      explanation: "بلاطات شبكية تدور عشوائياً لتشكل متاهات وأشرطة متداخلة لا نهائية.",
      beginnerTip: "اختر 'أشرطة ثلاثية' مع ٣ أقواس لمظهر مستوحى من الزخارف الهندسية الإسلامية."
    },
    concentricMoire: {
      name: "تموجات مواريه المتداخلة",
      category: "فن الخداع البصري",
      explanation: "دوائر متحدة وحلقات متداخلة تنتج أنماط تداخل وتموجات بصرية مذهلة.",
      beginnerTip: "إزاحة المركزين قليلاً يولد خطوط خداع بصري نابضة بالحياة عند رسمها بالقلم."
    },
    spirals: {
      name: "حلزونات هندسية ومشوهة",
      category: "منحنيات قطبية متصلة",
      explanation: "حلزون أرخميدس نقي يبدأ بدقة هندسية مطلقة، مع إمكانية إضافة تشويه بالضجيج أو الموجات.",
      beginnerTip: "ابدأ بتشويه صفر لرؤية حلزون هندسي نقي متزن، ثم حرّك منزلق التشويه لترى التموجات الرائعة!"
    },
    fractalTree: {
      name: "شجرة التفرع الكسوري",
      category: "نمو كسوري متفرع",
      explanation: "خوارزمية تفرع نباتي ذاتي التشابه تحاكي نمو الأشجار وشبكات الجذور والشعب المرجانية.",
      beginnerTip: "ارفع تمايل الرياح قليلاً للحصول على شكل شجرة طبيعية عضوية متوازنة."
    },
    continuousMeander: {
      name: "خط متصل واحد مستمر",
      category: "رسمة بخط واحد (بدون رفع قلم)",
      explanation: "منحنى هيلبرت يملأ مساحة الورقة بالكامل في ضربة قلم واحدة متصلة بدون أي رفع للقلم.",
      beginnerTip: "انعدام رفعات القلم يعني أن الراسمة الآلية ستعمل بأعلى كفاءة وسرعة ممكنة!"
    },
    codeSandbox: {
      name: "مختبر الكود والرياضيات المباشر",
      category: "رياضيات برمجية حرة",
      explanation: "اكتب معادلتك البارامترية f(t) -> {x, y} لتجربة أفكارك الرياضية الخاصة في الورشة.",
      beginnerTip: "جرّب الجمع بين Math.sin() و Math.cos() بترددات مختلفة لابتكار أشكال جديدة!"
    },
    doodles: {
      name: "خربشات حرة وتأملية",
      category: "خطوط عضوية حرة",
      explanation: "شخبطة حرة انسيابية تلتف بحلقات مرحة وزخارف زين تانغل بدون أي رفع للقلم.",
      beginnerTip: "جرّب التبديل بين 'حلقات مرحة' و'شخبطة سحابية' لمشاهدة الحركة الانسيابية الناعمة!"
    }
  }
};

const PARAM_LABELS_AR = {
  streamCount: "عدد مسارات التدفق",
  stepCount: "طول الخط (عدد الخطوات)",
  stepLength: "دقة الخطوة (مسافة النقطة)",
  noiseScale: "حجم تفاصيل الضجيج",
  curlMultiplier: "شدة الدوران والانحناء",
  spawnMode: "موضع البداية",
  streamAvoidance: "تجنب تصادم الخطوط",
  dualColorAccent: "طبقة ثانية (قلم إضافي)",
  lineCount: "عدد خطوط التضاريس",
  resolution: "دقة التضاريس",
  peakHeight: "ارتفاع القمم",
  noiseFreq: "تردد التموجات",
  noiseOctaves: "طبقات التفاصيل",
  occlusion: "حجب الخطوط الخلفية (عمق 3D)",
  twoColorLayer: "طبقتان لونيتان",
  loopCount: "عدد الدورات",
  damping: "معدل خمود النواسير",
  freqX: "تردد المحور الأفقي X",
  freqY: "تردد المحور الرأسي Y",
  freqZ: "تردد دوران الطاولة Z",
  phaseDiff: "فرق الطور",
  geometryMode: "نوع المنحنى الهيكلي",
  gridCols: "أعمدة الشبكة",
  tileStyle: "نمط البلاطة",
  arcsPerTile: "عدد الأقواس في كل بلاطة",
  alternatingColor: "تبديل لون الأقواس",
  ringCount: "عدد الحلقات",
  centerCount: "عدد المراكز",
  centerSpacing: "المسافة بين المراكز",
  noiseWobble: "تموجات الضجيج",
  spiralMode: "التحويل إلى نمط حلزوني",
  turns: "عدد اللفات (الدورات)",
  distortionAmount: "التشويه الخوارزمي",
  distortionMode: "نوع التشويه الخوارزمي",
  distortionFreq: "تردد التشويه",
  dualSpiral: "حلزون مزدوج متشابك (لقلمين)",
  recursionDepth: "عمق التفرع الشجري",
  branchAngle: "زاوية انحناء الأغصان",
  lengthDecay: "نسبة تناقص طول الغصن",
  windSway: "تمايل تأثير الرياح",
  randomness: "تنوع عشوائي طبيعي",
  foliageStyle: "نمط تفرع الأوراق",
  curveOrder: "درجة المنحنى (الكثافة)",
  cornerRoundness: "استدارة الزوايا",
  wobble: "تموج يدوي طبيعي",
  pointCount: "عدد النقاط المحسوبة",
  scale: "مقياس الرسم",
  freqA: "التردد A",
  freqB: "التردد B",
  doodleStyle: "نمط الخربشة والشخبطة",
  loopDensity: "طول الخط (عدد الخطوات)",
  curliness: "درجة التفاف الحلقات",
  wanderSpeed: "دقة الخطوة (مسافة النقطة)",
  coverage: "مدى انتشار الرسمة على الورقة"
};

const SELECT_OPTIONS_AR = {
  "Random Scatter (Uniform)": "تناثر عشوائي (منتظم)",
  "Concentric Ring Burst": "انفجار حلقي متمركز",
  "Structured Grid Lattice": "شبكة منتظمة مرتبة",
  "Central Core Outward": "من المركز إلى الخارج",
  "Inward from Margins": "من الأطراف إلى الداخل",
  "Curved Arcs (Woven Ribbons)": "أقواس منحنية (أشرطة منسوجة)",
  "Straight Diagonals (Maze)": "خطوط مائلة (متاهة مستقيمة)",
  "Quarter Circles": "أرباع دوائر كلاسيكية",
  "Pure Perfect Spiral (0 Distortion)": "حلزون نقي ومثالي (بدون تشويه)",
  "Organic Noise (Fingerprint / Tree Rings)": "ضجيج عضوي (بصمة إصبع / حلقات شجر)",
  "Harmonic Waves (Petal Rosette)": "موجات توافقية (بتلات زهور)",
  "Galactic Vortex Swirl": "دوامة مجرية ملتفة",
  "Dual Lateral Pendulums (2-Axis)": "بندولان جانبيان (محوران)",
  "Rotary Harmonograph (3-Axis)": "هارمونوغراف دوراني (٣ محاور)",
  "Lissajous Orbit": "مدار ليساجو المغلق",
  "Hypotrochoid Spirograph": "سبايروغراف تروس دائرية",
  "Classic Clean Branches": "أغصان كلاسيكية نظيفة",
  "Dense Leaf Clusters": "كتل أوراق كثيفة",
  "Bud / Blossom Crosses": "براعم أزهار متقاطعة",
  "Whimsical Loop-de-Loop (Cursive Ribbon)": "حلقات مرحة متصلة (شريط خطي)",
  "Mindful Cloud Scribble (Soft Wandering)": "شخبطة سحابية تأملية (حركة هادئة)",
  "Zentangle Ribbon Swirls (Rhythmic Loops)": "زخارف زين تانغل (حلقات إيقاعية)",
  "Botanical Ivy Tendrils (Organic Vines)": "خربشة الكرمة والبراعم (أغصان ملتفة)"
};

const PRESET_NAMES_AR = {
  "Pure Geometric Spiral": "حلزون هندسي نقي",
  "Organic Fingerprint Whorl": "دوامة بصمة إصبع",
  "Flower Rosette Spiral": "حلزون بتلات الزهور",
  "Galactic Vortex Coil": "لولب الدوامة المجرية",
  "Hypnotic Dual Intertwined": "حلزون مزدوج متشابك",
  "Ocean Currents": "تيارات المحيط",
  "Turbulent Vortex": "دوامة عاصفة",
  "Cosmic Ripple": "تموج كوني",
  "Wood Grain Flow": "تدفق عروق الخشب",
  "Lattice Drift": "انجراف شبكي",
  "Joy Division Classic": "تضاريس جوي ديفيجن",
  "Serene Mountain Valley": "وادي جبلي هادئ",
  "Alien Crag Peaks": "قمم صخرية شاهقة",
  "Low Frequency Waves": "موجات منخفضة التردد",
  "Subtle Sand Dunes": "كثبان رملية ناعمة",
  "Pendulum Waltz": "فالس البندول",
  "Elliptical Rose": "وردة بيضاوية",
  "Complex Harmonograph": "هارمونوغراف مركب",
  "Triple Harmonic Orbit": "مدار توافقي ثلاثي",
  "Woven Ribbon Labyrinth": "متاهة أشرطة منسوجة",
  "Islamic Archwork": "أقواس معمارية إسلامية",
  "High-Density Maze": "متاهة عالية الكثافة",
  "Geometric Circuit": "دارات هندسية",
  "Dual Moiré Interference": "تداخل مواريه ثنائي",
  "Triple Radiant Ripple": "تموج إشعاعي ثلاثي",
  "Eccentric Vortex": "دوامة لا مركزية",
  "Optical Pulsar Target": "هدف نبضي بصري",
  "Ancient Bonsai": "شجرة بونساي عريقة",
  "Dense Forest Canopy": "غابة وارفة الظلال",
  "Wind-Swept Willow": "صفصافة في مهب الريح",
  "Coral Network": "شبكة مرجانية",
  "Continuous Hilbert Labyrinth": "متاهة هيلبرت المتصلة",
  "Smooth Hilbert Flow": "تدفق هيلبرت الانسيابي",
  "Rounded Snake Path": "مسار الثعبان المستدير",
  "Golden Ratio Rose": "وردة النسبة الذهبية",
  "Fermat Spiral Daisy": "زهرة حلزون فيرما",
  "Star Polygon Knot": "عقدة نجمية متعددة الأضلاع",
  "Lissajous Knot (3:4)": "عقدة ليساجو (٣:٤)",
  "Whimsical Loop-de-Loop": "حلقات مرحة متصلة",
  "Mindful Cloud Scribble": "شخبطة سحابية تأملية",
  "Zentangle Ribbon Swirls": "زخارف زين تانغل الانسيابية",
  "Botanical Ivy Tendrils": "خربشة الكرمة الملتفة",
  "Cursive Notepad Wander": "شخبطة دفتر الملاحظات"
};

const UNITS_AR = {
  "lines": "خط",
  "steps": "خطوة",
  "mm": "مم",
  "x": "×",
  "turns": "لفة",
  "rings": "حلقة",
  "deg": "درجة",
  "pts": "نقطة"
};

class App {
  constructor() {
    this.plotter = new PlotterEngine();
    this.rng = new RandomGenerator(42);
    this.noise = new SimplexNoise(this.rng);

    // Read initial language preference from localStorage or URL parameter
    let initialLang = "en";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedLang = localStorage.getItem("plotter_lang");
        if (savedLang === "ar" || savedLang === "en") {
          initialLang = savedLang;
        }
      }
    } catch (_) {}

    try {
      if (typeof window !== "undefined" && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lang")) {
          const l = urlParams.get("lang");
          if (l === "en" || l === "ar") initialLang = l;
        }
      }
    } catch (_) {}

    // Application State
    this.state = {
      lang: initialLang,
      currentAlgoId: "flowField",
      activePresetName: "Ocean Currents",
      seed: 4242,
      paperKey: "a4", // Calibrated for thin A4 paper (< 10 min plots)
      orientation: "portrait", // portrait or landscape
      marginMm: 12, // mm
      paperColorId: "white",
      pen1ColorId: "micron_black",
      pen2ColorId: "crimson_red",
      strokeWidthMm: 0.35,
      optimizePaths: true,
      servoProtection: true,
      
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

    this.seedHistory = [];
    this._debounceRaf = null;

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
    this.setLanguage(this.state.lang);
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

    this.renderAlgorithmCards();
    this.updateDropdowns();
  }

  initEvents() {
    // Language Switcher Toggle
    document.getElementById("btnLangSwitch")?.addEventListener("click", () => {
      const nextLang = this.state.lang === "ar" ? "en" : "ar";
      this.setLanguage(nextLang);
    });

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

    // Beginner Banner Close Button
    const btnCloseBanner = document.getElementById("btnCloseBanner");
    if (btnCloseBanner) {
      btnCloseBanner.addEventListener("click", () => {
        const banner = document.getElementById("proBanner");
        if (banner) banner.style.display = "none";
      });
    }

    // Seed Randomize Button
    const btnRandomSeed = document.getElementById("btnRandomSeed");
    if (btnRandomSeed) {
      btnRandomSeed.addEventListener("click", () => {
        this.seedHistory.push(this.state.seed);
        if (this.seedHistory.length > 25) this.seedHistory.shift();
        const newSeed = Math.floor(Math.random() * 900000) + 10000;
        this.setSeed(newSeed);
      });
    }

    // Seed Undo Button
    const btnUndoSeed = document.getElementById("btnUndoSeed");
    if (btnUndoSeed) {
      btnUndoSeed.addEventListener("click", () => {
        const t = APP_TRANSLATIONS[this.state.lang];
        if (this.seedHistory && this.seedHistory.length > 0) {
          const prev = this.seedHistory.pop();
          this.setSeed(prev);
          this.showToast(t.toastUndoSeed || "Restored previous seed ↩");
        } else {
          this.showToast(t.toastNoUndoSeed || "No previous seeds");
        }
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
        this.debouncedGenerate();
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

    // Servo Thermal Protection Toggle
    const servoToggle = document.getElementById("servoProtectionToggle");
    if (servoToggle) {
      servoToggle.addEventListener("change", (e) => {
        this.state.servoProtection = e.target.checked;
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

    this.updateAlgorithmInfo(def);
    this.renderPresetPills(algoId, def);
    this.renderParameterControls(def);

    // Regenerate
    this.generate();
  }

  updateAlgorithmInfo(def) {
    const isAr = this.state.lang === "ar";
    const trans = (isAr && ALGO_TRANSLATIONS.ar[def.id]) || null;
    const name = trans ? trans.name : def.name;
    const explanation = trans ? trans.explanation : def.explanation;
    const beginnerTip = trans ? trans.beginnerTip : def.beginnerTip;
    const tipPrefix = isAr ? "💡 <b>نصيحة للمبتدئين:</b> " : "💡 <b>Beginner Tip:</b> ";

    const infoTitle = document.getElementById("algoInfoTitle");
    const infoDesc = document.getElementById("algoInfoDesc");
    const infoTip = document.getElementById("algoInfoTip");
    const codeSnippet = document.getElementById("algoCodeSnippet");

    if (infoTitle) infoTitle.innerHTML = `${def.icon} ${name}`;
    if (infoDesc) infoDesc.textContent = explanation;
    if (infoTip) infoTip.innerHTML = `${tipPrefix}${beginnerTip}`;
    if (codeSnippet) codeSnippet.textContent = def.codeSnippet || "// Algorithmic generative math";
  }

  renderAlgorithmCards() {
    const algoGrid = document.getElementById("algoGrid");
    if (!algoGrid) return;
    algoGrid.innerHTML = "";

    const isAr = this.state.lang === "ar";

    Object.values(ALGORITHM_DEFINITIONS).forEach(def => {
      const trans = (isAr && ALGO_TRANSLATIONS.ar[def.id]) || null;
      const name = trans ? trans.name : def.name;
      const category = trans ? trans.category : def.category;

      const card = document.createElement("div");
      card.className = `algo-card ${def.id === this.state.currentAlgoId ? "active" : ""}`;
      card.dataset.algoId = def.id;
      card.innerHTML = `
        <div class="algo-card-top">
          <span class="algo-card-icon">${def.icon}</span>
          <div>
            <div class="algo-card-name">${name}</div>
            <div class="algo-card-category">${category}</div>
          </div>
        </div>
      `;
      card.addEventListener("click", () => this.selectAlgorithm(def.id));
      algoGrid.appendChild(card);
    });
  }

  renderPresetPills(algoId, def) {
    const presetPills = document.getElementById("presetPills");
    if (!presetPills) return;
    presetPills.innerHTML = "";
    const presets = def.presets || {};
    const presetNames = Object.keys(presets);
    const isAr = this.state.lang === "ar";

    if (presetNames.length > 0) {
      if (!this.state.activePresetName || !presets[this.state.activePresetName]) {
        this.state.activePresetName = presetNames[0];
        const presetValues = presets[presetNames[0]];
        Object.keys(presetValues).forEach(k => {
          this.state.algoParams[algoId][k] = presetValues[k];
        });
      }

      presetNames.forEach(name => {
        const pill = document.createElement("button");
        pill.className = `preset-pill ${name === this.state.activePresetName ? "active" : ""}`;
        const displayName = (isAr && PRESET_NAMES_AR[name]) ? PRESET_NAMES_AR[name] : name;
        pill.textContent = displayName;
        pill.dataset.presetName = name;
        pill.addEventListener("click", () => {
          this.applyPreset(algoId, name);
        });
        presetPills.appendChild(pill);
      });
    }
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
      p.classList.toggle("active", p.dataset.presetName === presetName);
    });

    // Re-render sliders
    this.renderParameterControls(def);

    this.generate();
    const isAr = this.state.lang === "ar";
    const displayName = (isAr && PRESET_NAMES_AR[presetName]) ? PRESET_NAMES_AR[presetName] : presetName;
    const t = APP_TRANSLATIONS[this.state.lang];
    this.showToast(`${t.toastPreset}${displayName}"`);
  }

  renderParameterControls(def) {
    const container = document.getElementById("paramContainer");
    if (!container) return;
    container.innerHTML = "";

    const currentParams = this.state.algoParams[def.id];
    const isAr = this.state.lang === "ar";

    def.parameters.forEach(param => {
      const val = currentParams[param.id] !== undefined ? currentParams[param.id] : param.default;
      const paramLabel = (isAr && PARAM_LABELS_AR[param.id]) ? PARAM_LABELS_AR[param.id] : param.label;
      const unit = (isAr && param.unit && UNITS_AR[param.unit]) ? UNITS_AR[param.unit] : (param.unit || "");

      if (param.type === "range") {
        const item = document.createElement("div");
        item.className = "param-item";
        item.innerHTML = `
          <div class="param-header">
            <label class="param-label" title="${param.desc}">${paramLabel}</label>
            <span class="param-value" id="val_${param.id}">${val} ${unit}</span>
          </div>
          <input type="range" id="input_${param.id}" min="${param.min}" max="${param.max}" step="${param.step}" value="${val}">
        `;
        const slider = item.querySelector("input");
        slider.addEventListener("input", (e) => {
          const newVal = parseFloat(e.target.value);
          currentParams[param.id] = newVal;
          document.getElementById(`val_${param.id}`).textContent = `${newVal} ${unit}`;
          this.debouncedGenerate();
        });
        container.appendChild(item);

      } else if (param.type === "select") {
        const item = document.createElement("div");
        item.className = "param-item";
        let optionsHtml = "";
        param.options.forEach(opt => {
          const optLabel = (isAr && SELECT_OPTIONS_AR[opt.label]) ? SELECT_OPTIONS_AR[opt.label] : opt.label;
          optionsHtml += `<option value="${opt.value}" ${opt.value === val ? "selected" : ""}>${optLabel}</option>`;
        });
        item.innerHTML = `
          <div class="param-header">
            <label class="param-label" title="${param.desc}">${paramLabel}</label>
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
          <label class="param-label" title="${param.desc}">${paramLabel}</label>
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
            <label class="param-label" title="${param.desc}">${paramLabel}</label>
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

  updateDropdowns() {
    const isAr = this.state.lang === "ar";
    const t = APP_TRANSLATIONS[this.state.lang];
    if (!t) return;

    // Paper Select
    const paperSelect = document.getElementById("paperSelect");
    if (paperSelect) {
      const currentVal = this.state.paperKey;
      paperSelect.innerHTML = "";
      Object.keys(PAPER_SIZES).forEach(key => {
        const p = PAPER_SIZES[key];
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = isAr ? `${key.toUpperCase()} (${p.width} × ${p.height} مم)` : p.name;
        if (key === currentVal) opt.selected = true;
        paperSelect.appendChild(opt);
      });
    }

    // Orientation Select
    const optPort = document.getElementById("optPortrait");
    if (optPort) optPort.textContent = t.optPortrait;
    const optLand = document.getElementById("optLandscape");
    if (optLand) optLand.textContent = t.optLandscape;

    // Paper Color Select
    const paperColorSelect = document.getElementById("paperColorSelect");
    if (paperColorSelect && paperColorSelect.options) {
      Array.from(paperColorSelect.options).forEach(opt => {
        if (t.paperColors && t.paperColors[opt.value]) {
          opt.textContent = t.paperColors[opt.value];
        }
      });
    }

    // Pen Selects
    const pen1Select = document.getElementById("pen1Select");
    if (pen1Select && pen1Select.options) {
      Array.from(pen1Select.options).forEach(opt => {
        if (t.pens && t.pens[opt.value]) {
          opt.textContent = t.pens[opt.value];
        }
      });
    }
    const pen2Select = document.getElementById("pen2Select");
    if (pen2Select && pen2Select.options) {
      Array.from(pen2Select.options).forEach(opt => {
        if (t.pens && t.pens[opt.value]) {
          opt.textContent = t.pens[opt.value];
        }
      });
    }

    // Simulation Speed Select
    const simSpeedSelect = document.getElementById("simSpeedSelect");
    if (simSpeedSelect && simSpeedSelect.options) {
      Array.from(simSpeedSelect.options).forEach(opt => {
        if (t.simSpeeds && t.simSpeeds[opt.value]) {
          opt.textContent = t.simSpeeds[opt.value];
        }
      });
    }
  }

  updateModalGuide() {
    const isAr = this.state.lang === "ar";
    const t = APP_TRANSLATIONS[this.state.lang];
    const titleEl = document.getElementById("modalGuideTitle");
    const bodyEl = document.getElementById("modalGuideBody");
    if (!titleEl || !bodyEl || !t) return;

    titleEl.innerHTML = `<span>${t.guideTitle}</span>`;

    if (isAr) {
      bodyEl.innerHTML = `
        <h3>${t.guideH3_1}</h3>
        <p>${t.guideP_1}</p>

        <h3>${t.guideH3_2}</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="guide-step-card">
            <div class="guide-step-num">١</div>
            <div>
              <b>${t.guideStep1Title}</b> ${t.guideStep1Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">٢</div>
            <div>
              <b>${t.guideStep2Title}</b> ${t.guideStep2Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">٣</div>
            <div>
              <b>${t.guideStep3Title}</b> ${t.guideStep3Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">٤</div>
            <div>
              <b>${t.guideStep4Title}</b> ${t.guideStep4Desc}
            </div>
          </div>
        </div>

        <h3>${t.guideH3_3}</h3>
        <ul>
          <li>${t.guideRule1}</li>
          <li>${t.guideRule2}</li>
          <li>${t.guideRule3}</li>
        </ul>

        <h3>${t.guideH3_4}</h3>
        <ul>
          <li>${t.guidePensRec}</li>
          <li>${t.guidePapersRec}</li>
        </ul>
      `;
    } else {
      bodyEl.innerHTML = `
        <h3>${t.guideH3_1}</h3>
        <p>${t.guideP_1}</p>

        <h3>${t.guideH3_2}</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="guide-step-card">
            <div class="guide-step-num">1</div>
            <div>
              <b>${t.guideStep1Title}</b> ${t.guideStep1Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">2</div>
            <div>
              <b>${t.guideStep2Title}</b> ${t.guideStep2Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">3</div>
            <div>
              <b>${t.guideStep3Title}</b> ${t.guideStep3Desc}
            </div>
          </div>
          <div class="guide-step-card">
            <div class="guide-step-num">4</div>
            <div>
              <b>${t.guideStep4Title}</b> ${t.guideStep4Desc}
            </div>
          </div>
        </div>

        <h3>${t.guideH3_3}</h3>
        <ul>
          <li>${t.guideRule1}</li>
          <li>${t.guideRule2}</li>
          <li>${t.guideRule3}</li>
        </ul>

        <h3>${t.guideH3_4}</h3>
        <ul>
          <li>${t.guidePensRec}</li>
          <li>${t.guidePapersRec}</li>
        </ul>
      `;
    }
  }

  setLanguage(lang) {
    this.state.lang = lang;
    const isAr = lang === "ar";
    document.documentElement.setAttribute("lang", lang);
    document.body.setAttribute("dir", isAr ? "rtl" : "ltr");
    
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("plotter_lang", lang);
      }
    } catch (_) {}

    // Update simple mode link with query param
    const linkSimple = document.getElementById("linkSimpleMode");
    if (linkSimple) linkSimple.href = `simple.html?lang=${lang}`;

    const t = APP_TRANSLATIONS[lang];
    if (!t) return;

    // Header
    const langLabel = document.getElementById("langLabel");
    if (langLabel) langLabel.textContent = isAr ? "English" : "العربية";
    const logoTitle = document.getElementById("logoTitle");
    if (logoTitle) logoTitle.textContent = t.logoTitle;
    const logoSub = document.getElementById("logoSub");
    if (logoSub) logoSub.textContent = t.logoSub;
    const txtSimpleLink = document.getElementById("txtSimpleLink");
    if (txtSimpleLink) txtSimpleLink.textContent = t.linkSimple;
    const txtPhotoLink = document.getElementById("txtPhotoLink");
    if (txtPhotoLink) txtPhotoLink.textContent = t.linkPhoto;
    const txtGuideBtn = document.getElementById("txtGuideBtn");
    if (txtGuideBtn) txtGuideBtn.textContent = t.btnGuide;

    // Banner
    const txtProBanner = document.getElementById("txtProBanner");
    if (txtProBanner) txtProBanner.innerHTML = t.proBanner;

    // Tabs
    const txtTabAlgo = document.getElementById("txtTabAlgorithms");
    if (txtTabAlgo) txtTabAlgo.textContent = t.tabAlgo;
    const txtTabSetup = document.getElementById("txtTabSetup");
    if (txtTabSetup) txtTabSetup.textContent = t.tabSetup;
    const txtTabCode = document.getElementById("txtTabCode");
    if (txtTabCode) txtTabCode.textContent = t.tabCode;

    // Tab 1 Section Titles
    const sec1 = document.getElementById("secAlgoTitle");
    if (sec1) sec1.textContent = t.secAlgoTitle;
    const badge1 = document.getElementById("badgeAlgo");
    if (badge1) badge1.textContent = t.badgeAlgo;
    const sec2 = document.getElementById("secPresetTitle");
    if (sec2) sec2.textContent = t.secPresetTitle;
    const badge2 = document.getElementById("badgePreset");
    if (badge2) badge2.textContent = t.badgePreset;
    const sec3 = document.getElementById("secSeedTitle");
    if (sec3) sec3.textContent = t.secSeedTitle;
    const badge3 = document.getElementById("badgeSeed");
    if (badge3) badge3.textContent = t.badgeSeed;
    const txtRollSeed = document.getElementById("txtRollSeed");
    if (txtRollSeed) txtRollSeed.textContent = t.btnRollSeed;
    const txtUndoSeed = document.getElementById("txtUndoSeed");
    if (txtUndoSeed) txtUndoSeed.textContent = t.txtUndoSeed || "↩";
    const sec4 = document.getElementById("secParamTitle");
    if (sec4) sec4.textContent = t.secParamTitle;
    const badge4 = document.getElementById("badgeParam");
    if (badge4) badge4.textContent = t.badgeParam;

    // Tab 2 Setup
    const secPaper = document.getElementById("secPaperTitle");
    if (secPaper) secPaper.textContent = t.secPaperTitle;
    const badgeHw = document.getElementById("badgeHardware");
    if (badgeHw) badgeHw.textContent = t.badgeHardware;
    const lblSize = document.getElementById("lblPaperSize");
    if (lblSize) lblSize.textContent = t.lblPaperSize;
    const lblOrient = document.getElementById("lblOrientation");
    if (lblOrient) lblOrient.textContent = t.lblOrientation;
    const optPort = document.getElementById("optPortrait");
    if (optPort) optPort.textContent = t.optPortrait;
    const optLand = document.getElementById("optLandscape");
    if (optLand) optLand.textContent = t.optLandscape;
    const lblMargin = document.getElementById("lblMargin");
    if (lblMargin) lblMargin.textContent = t.lblMargin;
    const lblPaperColor = document.getElementById("lblPaperColor");
    if (lblPaperColor) lblPaperColor.textContent = t.lblPaperColor;

    const secPen = document.getElementById("secPenTitle");
    if (secPen) secPen.textContent = t.secPenTitle;
    const badgePen = document.getElementById("badgePen");
    if (badgePen) badgePen.textContent = t.badgePen;
    const lblPen1 = document.getElementById("lblPen1");
    if (lblPen1) lblPen1.textContent = t.lblPen1;
    const lblPen2 = document.getElementById("lblPen2");
    if (lblPen2) lblPen2.textContent = t.lblPen2;

    const secOpt = document.getElementById("secOptTitle");
    if (secOpt) secOpt.textContent = t.secOptTitle;
    const badgeOpt = document.getElementById("badgeOpt");
    if (badgeOpt) badgeOpt.textContent = t.badgeOpt;
    const lblOpt = document.getElementById("lblOpt");
    if (lblOpt) lblOpt.textContent = t.lblOpt;
    const lblServo = document.getElementById("lblServoProtection");
    if (lblServo && t.lblServoProtection) lblServo.textContent = t.lblServoProtection;
    const descOpt = document.getElementById("descOpt");
    if (descOpt) descOpt.textContent = t.descOpt;

    const secImg = document.getElementById("secImageTitle");
    if (secImg) secImg.textContent = t.secImageTitle;
    const descImg = document.getElementById("descImage");
    if (descImg) descImg.textContent = t.descImage;
    const btnImg = document.getElementById("btnImageStudio");
    if (btnImg) btnImg.textContent = t.btnImageStudio;

    // Tab 3 Code & Math
    const secCode = document.getElementById("secCodeTitle");
    if (secCode) secCode.textContent = t.secCodeTitle;
    const badgeCode = document.getElementById("badgeCode");
    if (badgeCode) badgeCode.textContent = t.badgeCode;
    const descCode = document.getElementById("descCode");
    if (descCode) descCode.textContent = t.descCode;
    const secRecipe = document.getElementById("secRecipeTitle");
    if (secRecipe) secRecipe.textContent = t.secRecipeTitle;
    const r1 = document.getElementById("recipePoint1");
    if (r1) r1.innerHTML = t.recipePoint1;
    const r2 = document.getElementById("recipePoint2");
    if (r2) r2.innerHTML = t.recipePoint2;
    const r3 = document.getElementById("recipePoint3");
    if (r3) r3.innerHTML = t.recipePoint3;

    // Viewport Toolbar
    const txtFit = document.getElementById("txtBtnZoomFit");
    if (txtFit) txtFit.textContent = t.btnFitView;
    const txtSimToggle = document.getElementById("txtSimToggle");
    if (txtSimToggle) {
      txtSimToggle.textContent = this.simulator && this.simulator.isPlaying ? t.btnSimStop : t.btnSimStart;
    }

    // Simulator
    const simTitle = document.getElementById("txtSimTitle");
    if (simTitle) simTitle.textContent = t.simTitle;

    // Bottom Dock Stats
    const lblDist = document.getElementById("lblStatDist");
    if (lblDist) lblDist.textContent = t.statDist;
    const lblLifts = document.getElementById("lblStatLifts");
    if (lblLifts) lblLifts.textContent = t.statLifts;
    const lblTime = document.getElementById("lblStatTime");
    if (lblTime) lblTime.textContent = t.statTime;
    const lblPaths = document.getElementById("lblStatPaths");
    if (lblPaths) lblPaths.textContent = t.statPaths;

    const txtDown = document.getElementById("txtBtnDownloadSVG");
    if (txtDown) txtDown.textContent = t.btnDownloadSVG;
    const txtCopy = document.getElementById("txtBtnCopySVG");
    if (txtCopy) txtCopy.textContent = t.btnCopySVG;
    const txtPng = document.getElementById("txtBtnDownloadPNG");
    if (txtPng) txtPng.textContent = t.btnDownloadPNG;

    // Re-populate and re-render dynamic sections
    this.renderAlgorithmCards();
    this.updateDropdowns();
    this.updateModalGuide();
    
    const def = ALGORITHM_DEFINITIONS[this.state.currentAlgoId];
    if (def) {
      this.updateAlgorithmInfo(def);
      this.renderPresetPills(this.state.currentAlgoId, def);
      this.renderParameterControls(def);
    }
  }

  debouncedGenerate() {
    if (this._debounceRaf) {
      cancelAnimationFrame(this._debounceRaf);
    }
    this._debounceRaf = requestAnimationFrame(() => {
      this.generate();
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

    // Apply TSP Path Optimization & Servo Thermal Protection if enabled
    if (this.state.optimizePaths) {
      const stitchThreshold = this.state.servoProtection !== false ? 2.0 : 0;
      layer1 = this.plotter.optimizePaths(layer1, { stitchThreshold });
      layer2 = this.plotter.optimizePaths(layer2, { stitchThreshold });
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
    const isAr = this.state.lang === "ar";

    document.getElementById("statDistance").textContent = `${s.drawDistanceM} m`;

    const liftsEl = document.getElementById("statLifts");
    if (liftsEl) {
      const isCool = s.servoStatus === "cool";
      const statusText = isCool
        ? (isAr ? "🟢 بارد وآمن" : "🟢 Cool & Safe")
        : (isAr ? "🟡 معتدل" : "🟡 Moderate");
      liftsEl.innerHTML = `${s.totalLifts} <small style="font-size: 11px; font-weight: 500; color: ${isCool ? '#10b981' : '#f59e0b'};">(${statusText})</small>`;
    }

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
