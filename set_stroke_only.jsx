/**
 * EffectCraft / After Effects Script
 * Sets all text layers in the active comp to:
 * - Stroke Width: 3px
 * - Stroke Color: Black [0, 0, 0]
 * - Fill: Off
 */
(function() {
    var STROKE_WIDTH = 3;
    var STROKE_COLOR = [0, 0, 0]; // Black

    var project = app.project;
    if (!project) return;
    var comp = project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select your composition first.");
        return;
    }

    app.beginUndoGroup("Set Text 3px Black Stroke");

    var modified = 0;
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        var textProp = layer.property("Source Text");
        if (textProp) {
            try {
                var textDoc = textProp.value;
                textDoc.applyFill = false;
                textDoc.applyStroke = true;
                textDoc.strokeColor = STROKE_COLOR;
                textDoc.strokeWidth = STROKE_WIDTH;
                textProp.setValue(textDoc);
                modified++;
            } catch(e) {}
        }
    }

    app.endUndoGroup();
    alert("Updated " + modified + " text layers to 3px Black Stroke!");
})();
