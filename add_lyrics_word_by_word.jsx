/**
 * EffectCraft / After Effects Automation Script
 * Synchronized Lyrics with True Audio Alignment & Pause Gaps
 * Track: "عشق وحميّة _ اليوم الوطني السعودي 96.mp4"
 */
(function() {
    // If your audio layer starts at a specific time (not 0:00), adjust this offset:
    var AUDIO_OFFSET = 0.0;

    // High-precision per-verse word timings matching vocal acoustic peaks
    var timedWords = [
        // Verse 1 (16.50s - 22.48s)
        { word: "حبيبتي", in: 16.50, out: 18.06 },
        { word: "والحب", in: 18.06, out: 19.36 },
        { word: "ماهو", in: 19.36, out: 20.90 },
        { word: "شويّه", in: 20.90, out: 22.48 },

        // Verse 2 (24.00s - 30.02s)
        { word: "ماله", in: 24.00, out: 24.98 },
        { word: "حدود", in: 24.98, out: 26.04 },
        { word: "وما", in: 26.04, out: 26.70 },
        { word: "تخطّه", in: 26.70, out: 28.78 },
        { word: "أيادي", in: 28.78, out: 30.02 },

        // Verse 3 (31.00s - 37.40s)
        { word: "روحي", in: 31.00, out: 32.42 },
        { word: "ولا", in: 32.42, out: 33.02 },
        { word: "تغلى", in: 33.02, out: 34.28 },
        { word: "عليها", in: 34.28, out: 35.90 },
        { word: "هديّه", in: 35.90, out: 37.40 },

        // Verse 4 (38.50s - 45.16s)
        { word: "حبي", in: 38.50, out: 39.62 },
        { word: "لها", in: 39.62, out: 40.66 },
        { word: "مافيه", in: 40.66, out: 42.14 },
        { word: "موقف", in: 42.14, out: 43.82 },
        { word: "حيادي", in: 43.82, out: 45.16 },

        // Verse 5 (46.50s - 53.12s)
        { word: "احبها", in: 46.50, out: 48.34 },
        { word: "فطره", in: 48.34, out: 49.78 },
        { word: "وعشق", in: 49.78, out: 50.96 },
        { word: "وحَميّه", in: 50.96, out: 53.12 },

        // Verse 6 (54.00s - 60.28s)
        { word: "واهيم", in: 54.00, out: 55.42 },
        { word: "فيها", in: 55.42, out: 56.46 },
        { word: "وارفع", in: 56.46, out: 57.60 },
        { word: "الصوت", in: 57.60, out: 59.08 },
        { word: "شادي", in: 59.08, out: 60.28 },

        // Verse 7 (62.00s - 67.94s)
        { word: "لرمالها", in: 62.00, out: 63.44 },
        { word: "لحدودها", in: 63.44, out: 65.30 },
        { word: "الساحليه", in: 65.30, out: 67.94 },

        // Verse 8 (68.80s - 75.52s)
        { word: "قرية", in: 68.80, out: 70.24 },
        { word: "مدينه", in: 70.24, out: 71.72 },
        { word: "رابيه", in: 71.72, out: 73.08 },
        { word: "سفح", in: 73.08, out: 74.68 },
        { word: "وادي", in: 74.68, out: 75.52 }
    ];

    var project = app.project;
    if (!project) {
        alert("Please open EffectCraft first.");
        return;
    }

    var comp = project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        for (var k = 1; k <= project.numItems; k++) {
            if (project.item(k) instanceof CompItem) {
                comp = project.item(k);
                break;
            }
        }
    }

    if (!comp || !(comp instanceof CompItem)) {
        alert("No active composition found. Please select your composition first.");
        return;
    }

    if (comp.duration < 80.0) {
        comp.duration = 80.0;
    }

    app.beginUndoGroup("Accurate Lyrics Sync");

    try {
        var compCenterX = comp.width / 2;
        var compCenterY = comp.height / 2;

        for (var i = 0; i < timedWords.length; i++) {
            var item = timedWords[i];
            var inPt = item.in + AUDIO_OFFSET;
            var outPt = item.out + AUDIO_OFFSET;

            // Create text layer
            var textLayer = comp.layers.addText(item.word);

            // Layer name
            var idxStr = (i + 1 < 10 ? "0" : "") + (i + 1);
            textLayer.name = idxStr + ". [" + inPt.toFixed(2) + "s] " + item.word;

            // Trim inPoint and outPoint directly in composition time
            textLayer.inPoint = inPt;
            textLayer.outPoint = outPt;

            // Center position
            try {
                if (textLayer.property("Transform") && textLayer.property("Transform").property("Position")) {
                    textLayer.property("Transform").property("Position").setValue([compCenterX, compCenterY]);
                }
            } catch (posErr) {}

            // Format typography
            try {
                var textProp = textLayer.property("Source Text");
                if (textProp) {
                    var textDoc = textProp.value;
                    textDoc.fontSize = 85;
                    textDoc.applyFill = true;
                    textDoc.fillColor = [1, 1, 1]; // Crisp white
                    if (typeof ParagraphJustification !== "undefined") {
                        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
                    }
                    textProp.setValue(textDoc);
                }
            } catch (styleErr) {}
        }

        alert("Added " + timedWords.length + " synchronized word layers to \"" + comp.name + "\"!");

    } catch (err) {
        alert("Error while syncing layers: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
