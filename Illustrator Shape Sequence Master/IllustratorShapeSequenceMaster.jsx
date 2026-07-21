#target illustrator

// =================================================================
// Illustrator Shape Sequence: THE COMPLETE ULTIMATE MASTER SCRIPT
// Copyright (c) 2026 Noli A. Navarro  (Graphtech Advertyizing)
// Licensed under the MIT License (See repository root for details)
// =================================================================
/*
  
  Features: Stroke Weight, Reset Defaults, Persistent Settings, CSV, Multi-Page, Gutter, Margins, Orientation, Fonts, Units, Colors
  UPDATES: Smart Text Auto-Fitting, Text Alignment, Start/End Number Range Generation, Font Size Input, Text Justify Alignment, Dynamic Zero Padding, Live Stats, Font Name Persistence, Color Persistence, Prefix/Suffix Strings, Custom Top-Left Coordinates Override, Asymmetrical Spacing & Column Auto-Distribution, Bidirectional Layout Flow Sorting, Bidirectional Auto-Distribution (Rows/Cols), Dynamic Base Artboard Resizing, Real-Time Swatch Panel Bindings (Fill, Stroke, & Text)
  FIXES: Fixed array index references on artboardRect parsing to completely eliminate duplicate Swatches.
*/

function generateUltimateMasterSequence() {
    var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add();
    var PaperSizes = { "Letter": { w: 612, h: 792 }, "A4": { w: 595.28, h: 841.89 }, "Legal": { w: 612, h: 1008 } };
    var allFonts = app.textFonts;
    var fontNames = [];
    for (var f = 0; f < allFonts.length; f++) { fontNames.push(allFonts[f].name); }

    // --- SETTINGS PERSISTENCE ---
    var settingsFile = new File(Folder.userData + "/IllustratorMasterSettings_Final.txt");
    var defaults = { 
        unit: 0, paper: 0, orient: 0, shape: 0, w: "50", h: "50", rad: "0", 
        startNum: "1", endNum: "20", marg: "40", gutter: "50", 
        stroke: "1", opacity: 100, fCol: 16711680, sCol: 0, tCol: 16777215, 
        textAlign: 0, fontSize: "18", textJustify: 1, paddingIndex: 0,
        savedFont: "", prefix: "", suffix: "",
        useCustomPos: false, customX: "40", customY: "40",
        spaceMode: 0, spaceX: "10", spaceY: "10", distributeCols: "5", distributeRows: "5",
        layoutFlow: 0 
    };

    function loadSettings() {
        if (!settingsFile.exists) return defaults;
        try {
            settingsFile.open('r');
            var obj = eval("(" + settingsFile.read() + ")");
            settingsFile.close();
            if (obj.startNum === undefined) obj.startNum = "1";
            if (obj.endNum === undefined) obj.endNum = "20";
            if (obj.textAlign === undefined) obj.textAlign = 0;
            if (obj.fontSize === undefined) obj.fontSize = "18";
            if (obj.textJustify === undefined) obj.textJustify = 1;
            if (obj.paddingIndex === undefined) obj.paddingIndex = 0;
            if (obj.savedFont === undefined) obj.savedFont = "";
            if (obj.prefix === undefined) obj.prefix = "";
            if (obj.suffix === undefined) obj.suffix = "";
            if (obj.useCustomPos === undefined) obj.useCustomPos = false;
            if (obj.customX === undefined) obj.customX = "40";
            if (obj.customY === undefined) obj.customY = "40";
            if (obj.spaceMode === undefined) obj.spaceMode = 0;
            if (obj.spaceX === undefined) obj.spaceX = "10";
            if (obj.spaceY === undefined) obj.spaceY = "10";
            if (obj.distributeCols === undefined) obj.distributeCols = "5";
            if (obj.distributeRows === undefined) obj.distributeRows = "5";
            if (obj.layoutFlow === undefined) obj.layoutFlow = 0;
            if (obj.fCol === undefined) obj.fCol = 16711680;
            if (obj.sCol === undefined) obj.sCol = 0;
            if (obj.tCol === undefined) obj.tCol = 16777215;
            return obj;
        } catch(e) { return defaults; }
    }
    function saveSettings(obj) {
        settingsFile.open('w');
        settingsFile.write(obj.toSource());
        settingsFile.close();
    }
    var currentSettings = loadSettings();

    var csvData = [];
    var fillGradientDec = currentSettings.fCol;
    var strokeColorDec = currentSettings.sCol; 
    var textColorDec = currentSettings.tCol; 

    function padZero(num, targetLength) {
        var str = num.toString();
        while (str.length < targetLength) { str = "0" + str; }
        return str;
    }

    function convertToPoints(val, unit) {
        if (unit === "Inches") return val * 72;
        if (unit === "Millimeters") return val * 2.834645;
        return val;
    }

    function decToRGB(dec) {
        var rgb = new RGBColor();
        rgb.red = (dec >> 16) & 0xFF;
        rgb.green = (dec >> 8) & 0xFF;
        rgb.blue = dec & 0xFF;
        return rgb;
    }

    // function getOrCreateSwatch(name, decColor) {
        // var targetSwatch;
        // var rgbColor = decToRGB(decColor);
        // try {
            // targetSwatch = doc.swatches.getByName(name);
            // targetSwatch.color.spot.color.red = rgbColor.red;
            // targetSwatch.color.spot.color.green = rgbColor.green;
            // targetSwatch.color.spot.color.blue = rgbColor.blue;
        // } catch (e) {
            // var newSpot = doc.spots.add();
            // newSpot.name = name;
            // newSpot.colorType = ColorModel.SPOT;
            
            // var spotRGB = new RGBColor();
            // spotRGB.red = rgbColor.red;
            // spotRGB.green = rgbColor.green;
            // spotRGB.blue = rgbColor.blue;
            // newSpot.color = spotRGB;

            // targetSwatch = doc.swatches.add();
            // var finalSpotColor = new SpotColor();
            // finalSpotColor.spot = newSpot;
            // targetSwatch.color = finalSpotColor;
        // }
        // return targetSwatch.color;
    // }
	
function getOrCreateSwatch(name, decColor) {
    var targetSwatch;
    var rgbColor = decToRGB(decColor);
    
    // Step 1: Force find or update the underlying Spot Channel to prevent Illustrator renaming duplicates
    var targetSpot;
    try {
        targetSpot = doc.spots.getByName(name);
        // If spot channel exists, safely update its RGB sliders
        targetSpot.color.red = rgbColor.red;
        targetSpot.color.green = rgbColor.green;
        targetSpot.color.blue = rgbColor.blue;
    } catch (e) {
        // If spot channel is totally missing from document memory, add it fresh
        targetSpot = doc.spots.add();
        targetSpot.name = name;
        targetSpot.colorType = ColorModel.SPOT;
        
        var spotRGB = new RGBColor();
        spotRGB.red = rgbColor.red;
        spotRGB.green = rgbColor.green;
        spotRGB.blue = rgbColor.blue;
        targetSpot.color = spotRGB;
    }

    // Step 2: Force find or map the Swatches palette panel block to the Spot Channel
    try {
        targetSwatch = doc.swatches.getByName(name);
    } catch (e) {
        // Only if the visual Swatch icon is missing from the panel UI, assign it cleanly
        targetSwatch = doc.swatches.add();
        var finalSpotColor = new SpotColor();
        finalSpotColor.spot = targetSpot;
        targetSwatch.color = finalSpotColor;
    }
    
    return targetSwatch.color;
}

	

    var dlg = new Window("dialog", "Shape Sequence Master Pro");
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    // --- PANEL 1: DATA & PAGE SETUP ---
    var pnlPage = dlg.add("panel", undefined, "Data & Page Setup");
    var row1 = pnlPage.add("group");
    row1.add("statictext", undefined, "Paper:");
    var paperDrop = row1.add("dropdownlist", undefined, ["Letter", "A4", "Legal"]);
    paperDrop.selection = currentSettings.paper;
    row1.add("statictext", undefined, "Orient:");
    var orientDrop = row1.add("dropdownlist", undefined, ["Portrait", "Landscape"]);
    orientDrop.selection = currentSettings.orient;

    var row2 = pnlPage.add("group");
    row2.add("statictext", undefined, "Units:");
    var unitDrop = row2.add("dropdownlist", undefined, ["Points", "Inches", "Millimeters"]);
    unitDrop.selection = currentSettings.unit;
    row2.add("statictext", undefined, "Gutter:");
    var gutterIn = row2.add("edittext", undefined, currentSettings.gutter); gutterIn.characters = 4;

    var row3 = pnlPage.add("group");
    row3.add("statictext", undefined, "Margin:");
    var margIn = row3.add("edittext", undefined, currentSettings.marg); margIn.characters = 4;
    var btnCSV = row3.add("button", undefined, "Load CSV");

    btnCSV.onClick = function() {
        var f = File.openDialog("Select CSV", "CSV:*.csv");
        if (f) {
            f.open('r'); csvData = [];
            while (!f.eof) { 
                var l = f.readln(); 
                if (l) { var entry = l.split(',')[0].replace(/^\s+|\s+$/g, ''); if (entry) csvData.push(entry); }
            }
            f.close(); btnCSV.text = "CSV (" + csvData.length + ")";
            if (typeof updateLiveStats === "function") updateLiveStats();
        }
    };

    // --- PANEL 2: STYLE & FONT ---
    var pnlStyle = dlg.add("panel", undefined, "Style & Font");
    var fontDrop = pnlStyle.add("dropdownlist", undefined, fontNames);
    
    var selectedFontIdx = 0;
    if (currentSettings.savedFont !== "") {
        for (var idx = 0; idx < fontNames.length; idx++) {
            if (fontNames[idx] === currentSettings.savedFont) {
                selectedFontIdx = idx;
                break;
            }
        }
    }
    fontDrop.selection = selectedFontIdx;
    fontDrop.preferredSize.width = 250;

    var fSizeRow = pnlStyle.add("group");
    fSizeRow.add("statictext", undefined, "Font Size (pt):");
    var sizeIn = fSizeRow.add("edittext", undefined, currentSettings.fontSize); sizeIn.characters = 4;
    fSizeRow.add("statictext", undefined, "Justify:");
    var justifyDrop = fSizeRow.add("dropdownlist", undefined, ["Left", "Center", "Right"]);
    justifyDrop.selection = currentSettings.textJustify;

    var colGrp = pnlStyle.add("group");
    var bFillCol = colGrp.add("button", undefined, "Fill Color");
    var bShpCol = colGrp.add("button", undefined, "Stroke Color");
    var bTxtCol = colGrp.add("button", undefined, "Text Color");
    
    var strokeGrp = pnlStyle.add("group");
    strokeGrp.add("statictext", undefined, "Stroke (pt):");
    var strokeIn = strokeGrp.add("edittext", undefined, currentSettings.stroke); strokeIn.characters = 3;
    strokeGrp.add("statictext", undefined, "V-Align:");
    var alignDrop = strokeGrp.add("dropdownlist", undefined, ["Center", "Top", "Bottom"]);
    alignDrop.selection = currentSettings.textAlign;

    bFillCol.onClick = function() { fillGradientDec = $.colorPicker(fillGradientDec); if (typeof updateLiveStats === "function") updateLiveStats(); };
    bShpCol.onClick = function() { strokeColorDec = $.colorPicker(strokeColorDec); if (typeof updateLiveStats === "function") updateLiveStats(); };
    bTxtCol.onClick = function() { textColorDec = $.colorPicker(textColorDec); if (typeof updateLiveStats === "function") updateLiveStats(); };

    // --- PANEL 3: DIMENSIONS & SEQUENCING ---
    var pnlDim = dlg.add("panel", undefined, "Dimensions & Spacing");
    var shapeType = pnlDim.add("dropdownlist", undefined, ["Circle", "Square", "Rectangle", "Star"]);
    shapeType.selection = currentSettings.shape;

    var dimRow = pnlDim.add("group");
    dimRow.add("statictext", undefined, "W:");
    var wIn = dimRow.add("edittext", undefined, currentSettings.w); wIn.characters = 4;
    var hLbl = dimRow.add("statictext", undefined, "H:");
    var hIn = dimRow.add("edittext", undefined, currentSettings.h); hIn.characters = 4;
    dimRow.add("statictext", undefined, "Corner:");
    var rIn = dimRow.add("edittext", undefined, currentSettings.rad); rIn.characters = 3;

    var fixRow = pnlDim.add("group");
    fixRow.add("statictext", undefined, "Prefix:");
    var prefixIn = fixRow.add("edittext", undefined, currentSettings.prefix); prefixIn.characters = 6;
    fixRow.add("statictext", undefined, "Suffix:");
    var suffixIn = fixRow.add("edittext", undefined, currentSettings.suffix); suffixIn.characters = 6;

    var customPosGrp = pnlDim.add("group");
    var customPosChk = customPosGrp.add("checkbox", undefined, "Custom Start Pos");
    customPosChk.value = currentSettings.useCustomPos;
    customPosGrp.add("statictext", undefined, "X:");
    var customXIn = customPosGrp.add("edittext", undefined, currentSettings.customX); customXIn.characters = 4;
    customPosGrp.add("statictext", undefined, "Y:");
    var customYIn = customPosGrp.add("edittext", undefined, currentSettings.customY); customYIn.characters = 4;

    // --- ASYMMETRICAL SPACING & DISTRIBUTION ROW ---
    var spaceRow = pnlDim.add("group");
    spaceRow.add("statictext", undefined, "Mode:");
    var spaceModeDrop = spaceRow.add("dropdownlist", undefined, ["Fixed Gaps", "Auto-Distribute"]);
    spaceModeDrop.selection = currentSettings.spaceMode;
    
    spaceRow.add("statictext", undefined, "Flow:");
    var flowDrop = spaceRow.add("dropdownlist", undefined, ["Left-to-Right", "Top-to-Bottom"]);
    flowDrop.selection = currentSettings.layoutFlow;

    var spaceInputGrp = pnlDim.add("group");
    var spaceXLbl = spaceInputGrp.add("statictext", undefined, "Space X:");
    var spaceXIn = spaceInputGrp.add("edittext", undefined, currentSettings.spaceX); spaceXIn.characters = 4;
    var spaceYLbl = spaceInputGrp.add("statictext", undefined, "Space Y:");
    var spaceYIn = spaceInputGrp.add("edittext", undefined, currentSettings.spaceY); spaceYIn.characters = 4;
    var distColsLbl = spaceInputGrp.add("statictext", undefined, "Cols Count:");
    var distColsIn = spaceInputGrp.add("edittext", undefined, currentSettings.distributeCols); distColsIn.characters = 3;
    var distRowsLbl = spaceInputGrp.add("statictext", undefined, "Rows Count:");
    var distRowsIn = spaceInputGrp.add("edittext", undefined, currentSettings.distributeRows); distRowsIn.characters = 3;

    var rangeRow = pnlDim.add("group");
    rangeRow.add("statictext", undefined, "Start:");
    var startIn = rangeRow.add("edittext", undefined, currentSettings.startNum); startIn.characters = 3;
    rangeRow.add("statictext", undefined, "End:");
    var endIn = rangeRow.add("edittext", undefined, currentSettings.endNum); endIn.characters = 3;
    
    rangeRow.add("statictext", undefined, "Zeros:");
    var paddingDrop = rangeRow.add("dropdownlist", undefined, ["None (1)", "2 Digits (01)", "3 Digits (001)", "4 Digits (0001)"]);
    paddingDrop.selection = currentSettings.paddingIndex;
    // --- PANEL 4: LIVE STATISTICS STATUS PANEL ---
    var pnlStats = dlg.add("panel", undefined, "Live Status");
    pnlStats.alignChildren = ["left", "center"];
    var lblStats = pnlStats.add("statictext", undefined, "Calculating variables...", {multiline: true});

    // Dedicated Isolated Calculator Function
    function updateLiveStats() {
        try {
            var u = unitDrop.selection.text;
            var pBase = PaperSizes[paperDrop.selection.text];
            var isLand = (orientDrop.selection.text === "Landscape");
            var pW = isLand ? pBase.h : pBase.w;
            var pH = isLand ? pBase.w : pBase.h;

            var startVal = parseInt(startIn.text) || 1;
            var endVal = parseInt(endIn.text) || 1;
            var count = csvData.length > 0 ? csvData.length : (endVal - startVal + 1);
            if (count < 1) count = 1;

            var w = convertToPoints(parseFloat(wIn.text) || 0, u);
            var h = (shapeType.selection.text === "Rectangle") ? convertToPoints(parseFloat(hIn.text) || 0, u) : w;
            var marg = convertToPoints(parseFloat(margIn.text) || 0, u);

            var availableW, availableH;
            if (customPosChk.value) {
                var cX = convertToPoints(parseFloat(customXIn.text) || 0, u);
                var cY = convertToPoints(parseFloat(customYIn.text) || 0, u);
                availableW = pW - cX - marg; 
                availableH = pH - cY - marg; 
            } else {
                availableW = pW - (marg * 2);
                availableH = pH - (marg * 2);
            }

            if (availableW <= 0 || availableH <= 0 || w <= 0 || h <= 0) {
                lblStats.text = "⚠️ Layout Error:\nCoordinates or shape values are invalid.";
                return;
            }

            var cols = 0;
            var rows = 0;
            var sX = 0;
            var sY = 0;

            var currentMode = spaceModeDrop.selection.index;
            var currentFlow = flowDrop.selection.index;

            if (currentMode === 0) {
                // Manual Fixed Gaps Mode
                sX = convertToPoints(parseFloat(spaceXIn.text) || 0, u);
                sY = convertToPoints(parseFloat(spaceYIn.text) || 0, u);
                
                cols = Math.floor(availableW / (w + sX));
                if (Math.floor((availableW - w) / (w + sX)) >= cols) cols++;
                
                rows = Math.floor(availableH / (h + sY));
                if (Math.floor((availableH - h) / (h + sY)) >= rows) rows++;
            } else {
                // Auto-Distribute Mode
                if (currentFlow === 0) {
                    sY = convertToPoints(parseFloat(spaceYIn.text) || 0, u);
                    cols = parseInt(distColsIn.text) || 1;
                    if (cols < 1) cols = 1;
                    
                    if (cols === 1) {
                        sX = 0;
                    } else {
                        var totalShapesW = cols * w;
                        var remainingW = availableW - totalShapesW;
                        sX = remainingW / (cols - 1);
                    }
                    
                    rows = Math.floor(availableH / (h + sY));
                    if (Math.floor((availableH - h) / (h + sY)) >= rows) rows++;
                } else {
                    sX = convertToPoints(parseFloat(spaceXIn.text) || 0, u);
                    rows = parseInt(distRowsIn.text) || 1;
                    if (rows < 1) rows = 1;
                    
                    if (rows === 1) {
                        sY = 0;
                    } else {
                        var totalShapesH = rows * h;
                        var remainingH = availableH - totalShapesH;
                        sY = remainingH / (rows - 1);
                    }
                    
                    cols = Math.floor(availableW / (w + sX));
                    if (Math.floor((availableW - w) / (w + sX)) >= cols) cols++;
                }
            }

            if (cols < 0) cols = 0;
            if (rows < 0) rows = 0;

            var perPg = cols * rows;

            if (perPg <= 0 || 
               (currentMode === 1 && currentFlow === 0 && (cols * w) > availableW) ||
               (currentMode === 1 && currentFlow === 1 && (rows * h) > availableH)) {
                lblStats.text = "⚠️ Layout Error:\nShapes do not fit within the page bounds.";
                return;
            }

            var totalPages = Math.ceil(count / perPg);
            lblStats.text = "Grid layout: " + cols + " Cols x " + rows + " Rows (" + perPg + " per page)\n" +
                            "Total Elements: " + count + "  |  Artboards Needed: " + totalPages;
        } catch(err) {
            lblStats.text = "Error parsing variables.";
        }
    }

    function adjustSpacingFields() {
        var isManual = (spaceModeDrop.selection.index === 0);
        var isHorizFlow = (flowDrop.selection.index === 0);

        if (isManual) {
            spaceXLbl.visible = spaceXIn.visible = true;
            spaceYLbl.visible = spaceYIn.visible = true;
            distColsLbl.visible = distColsIn.visible = false;
            distRowsLbl.visible = distRowsIn.visible = false;
        } else {
            if (isHorizFlow) {
                spaceXLbl.visible = spaceXIn.visible = false;
                spaceYLbl.visible = spaceYIn.visible = true;
                distColsLbl.visible = distColsIn.visible = true;
                distRowsLbl.visible = distRowsIn.visible = false;
            } else {
                spaceXLbl.visible = spaceXIn.visible = true;
                spaceYLbl.visible = spaceYIn.visible = false;
                distColsLbl.visible = distColsIn.visible = false;
                distRowsLbl.visible = distRowsIn.visible = true;
            }
        }
        updateLiveStats();
    }

    spaceModeDrop.onChange = function() { adjustSpacingFields(); };
    flowDrop.onChange = function() { adjustSpacingFields(); };
    paperDrop.onChange = function() { updateLiveStats(); };
    orientDrop.onChange = function() { updateLiveStats(); };
    unitDrop.onChange = function() { updateLiveStats(); };
    fontDrop.onChange = function() { updateLiveStats(); };
    paddingDrop.onChange = function() { updateLiveStats(); };

    customPosChk.onClick = function() {
        customXIn.enabled = customYIn.enabled = customPosChk.value;
        updateLiveStats();
    };
    customXIn.enabled = customYIn.enabled = customPosChk.value;

    adjustSpacingFields();

    shapeType.onChange = function() {
        hLbl.enabled = hIn.enabled = (shapeType.selection.text === "Rectangle");
        rIn.enabled = (shapeType.selection.text === "Square" || shapeType.selection.text === "Rectangle");
        updateLiveStats();
    };

    wIn.onChanging = hIn.onChanging = margIn.onChanging = function() { updateLiveStats(); };
    spaceXIn.onChanging = spaceYIn.onChanging = distColsIn.onChanging = distRowsIn.onChanging = function() { updateLiveStats(); };
    startIn.onChanging = endIn.onChanging = gutterIn.onChanging = function() { updateLiveStats(); };
    prefixIn.onChanging = suffixIn.onChanging = customXIn.onChanging = customYIn.onChanging = function() { updateLiveStats(); };
    // --- FOOTER ---
    var footer = dlg.add("group");
    var btnReset = footer.add("button", undefined, "Reset Defaults");
    footer.add("button", undefined, "Cancel", {name: "cancel"});
    var okBtn = footer.add("button", undefined, "Generate", {name: "ok"});

    btnReset.onClick = function() {
        if (settingsFile.exists) settingsFile.remove();
        alert("Defaults reset. Please restart the script.");
        dlg.close();
    };

    // Run the live calculator immediately upon loading the interface window
    updateLiveStats();

    if (dlg.show() == 1) {
        var selectedFontName = fontDrop.selection ? fontDrop.selection.text : "";

        saveSettings({
            unit: unitDrop.selection.index, paper: paperDrop.selection.index, orient: orientDrop.selection.index,
            shape: shapeType.selection.index, w: wIn.text, h: hIn.text, rad: rIn.text, 
            startNum: startIn.text, endNum: endIn.text, marg: margIn.text, gutter: gutterIn.text, stroke: strokeIn.text, opacity: 100,
            fCol: fillGradientDec, sCol: strokeColorDec, tCol: textColorDec, textAlign: alignDrop.selection.index,
            fontSize: sizeIn.text, textJustify: justifyDrop.selection.index, paddingIndex: paddingDrop.selection.index,
            savedFont: selectedFontName, prefix: prefixIn.text, suffix: suffixIn.text,
            useCustomPos: customPosChk.value, customX: customXIn.text, customY: customYIn.text,
            spaceMode: spaceModeDrop.selection.index, spaceX: spaceXIn.text, spaceY: spaceYIn.text, 
            distributeCols: distColsIn.text, distributeRows: distRowsIn.text, layoutFlow: flowDrop.selection.index
        });

        var u = unitDrop.selection.text;
        var pBase = PaperSizes[paperDrop.selection.text];
        var isLand = (orientDrop.selection.text === "Landscape");
        var pW = isLand ? pBase.h : pBase.w;
        var pH = isLand ? pBase.w : pBase.h;

        var startVal = parseInt(startIn.text) || 1;
        var endVal = parseInt(endIn.text) || 20;
        if (endVal < startVal) endVal = startVal; 

        var count = csvData.length > 0 ? csvData.length : (endVal - startVal + 1); 
        var w = convertToPoints(parseFloat(wIn.text), u);
        var h = (shapeType.selection.text === "Rectangle") ? convertToPoints(parseFloat(hIn.text), u) : w;
        var rad = convertToPoints(parseFloat(rIn.text), u);
        var marg = convertToPoints(parseFloat(margIn.text), u);
        var gutter = convertToPoints(parseFloat(gutterIn.text), u);
        var sWeight = parseFloat(strokeIn.text);
        var tAlign = alignDrop.selection.text;
        var tJustify = justifyDrop.selection.text;
        var userFontSize = parseFloat(sizeIn.text) || 18;
        var targetPaddingLength = paddingDrop.selection.index + 1; 
        
        var currentMode = spaceModeDrop.selection.index;
        var currentFlow = flowDrop.selection.index;

        // --- NATIVE SWATCH BINDING INITIALIZATION ---
        var boundFillColor = getOrCreateSwatch("Master Fill Color", fillGradientDec);
        var boundStrokeColor = getOrCreateSwatch("Master Stroke Color", strokeColorDec);
        var boundTextColor = getOrCreateSwatch("Master Text Color", textColorDec);

        var checkW = customPosChk.value ? (pW - convertToPoints(parseFloat(customXIn.text), u) - marg) : (pW - (marg*2));
        var checkH = customPosChk.value ? (pH - convertToPoints(parseFloat(customYIn.text), u) - marg) : (pH - (marg*2));
        
        var cols = 0;
        var rows = 0;
        var sX = 0;
        var sY = 0;

        if (currentMode === 0) {
            sX = convertToPoints(parseFloat(spaceXIn.text), u);
            sY = convertToPoints(parseFloat(spaceYIn.text), u);
            
            cols = Math.floor(checkW / (w + sX));
            if (Math.floor((checkW - w) / (w + sX)) >= cols) cols++;
            
            rows = Math.floor(checkH / (h + sY));
            if (Math.floor((checkH - h) / (h + sY)) >= rows) rows++;
        } else {
            if (currentFlow === 0) {
                sY = convertToPoints(parseFloat(spaceYIn.text), u);
                cols = parseInt(distColsIn.text) || 1;
                if (cols < 1) cols = 1;
                if (cols === 1) {
                    sX = 0;
                } else {
                    var totalShapesW = cols * w;
                    var remainingW = checkW - totalShapesW;
                    sX = remainingW / (cols - 1);
                }
                rows = Math.floor(checkH / (h + sY));
                if (Math.floor((checkH - h) / (h + sY)) >= rows) rows++;
            } else {
                sX = convertToPoints(parseFloat(spaceXIn.text), u);
                rows = parseInt(distRowsIn.text) || 1;
                if (rows < 1) rows = 1;
                if (rows === 1) {
                    sY = 0;
                } else {
                    var totalShapesH = rows * h;
                    var remainingH = checkH - totalShapesH;
                    sY = remainingH / (rows - 1);
                }
                cols = Math.floor(checkW / (w + sX));
                if (Math.floor((checkW - w) / (w + sX)) >= cols) cols++;
            }
        }
        var perPg = cols * rows;

        try {
            var shpGen = 0; var pgIdx = 0;
            while (shpGen < count) {
                // var ab;
                // if (pgIdx >= doc.artboards.length) {
                    // var prevLeft = doc.artboards[pgIdx-1].artboardRect[0]; // FIXED: Extract clean numeric array index coordinate point
                    // var newLeft = prevLeft + gutter + pW;
                    // ab = doc.artboards.add([newLeft, 0, newLeft + pW, -pH]);
                // } else {
                    // ab = doc.artboards[pgIdx];
                    // if (pgIdx === 0) {
                        // ab.artboardRect = [0, 0, pW, -pH];
                    // }
                // }

                // var sX_coord, sY_coord;
                // if (customPosChk.value) {
                    // sX_coord = ab.artboardRect[0] + convertToPoints(parseFloat(customXIn.text), u); // FIXED: Added array bracket indexes
                    // sY_coord = ab.artboardRect[1] - convertToPoints(parseFloat(customYIn.text), u); // FIXED: Added array bracket indexes
                // } else {
                    // sX_coord = ab.artboardRect[0] + marg; // FIXED: Added array bracket indexes
                    // sY_coord = ab.artboardRect[1] - marg; // FIXED: Added array bracket indexes
                // }
								
				var ab;
				if (pgIdx >= doc.artboards.length) {
					// FIXED: Strict numeric array parsing to completely bypass text concatenation errors
					var prevLeft = doc.artboards[pgIdx-1].artboardRect[0]; 
					var newLeft = prevLeft + gutter + pW;
					ab = doc.artboards.add([newLeft, 0, newLeft + pW, -pH]);
				} else {
					ab = doc.artboards[pgIdx];
					if (pgIdx === 0) {
						ab.artboardRect = [0, 0, pW, -pH];
					}
				}

				var sX_coord, sY_coord;
				if (customPosChk.value) {
					sX_coord = ab.artboardRect[0] + convertToPoints(parseFloat(customXIn.text), u);
					sY_coord = ab.artboardRect[1] - convertToPoints(parseFloat(customYIn.text), u);
				} else {
					sX_coord = ab.artboardRect[0] + marg;
					sY_coord = ab.artboardRect[1] - marg;
				}

				

                for (var i=0; i<perPg && shpGen < count; i++) {
                    var coreContent = csvData.length > 0 ? csvData[shpGen] : padZero(startVal + shpGen, targetPaddingLength);
                    var content = prefixIn.text + coreContent + suffixIn.text;

                    var r, c;
                    if (currentFlow === 1) {
                        r = i % rows;
                        c = Math.floor(i / rows);
                    } else {
                        r = Math.floor(i / cols);
                        c = i % cols;
                    }

                    var cX = sX_coord + (c * (w + sX));
                    var cY = sY_coord - (r * (h + sY));

                    var grp = doc.groupItems.add();
                    var shp;
                    var st = shapeType.selection.text;
                    if (st === "Circle") shp = grp.pathItems.ellipse(cY, cX, w, w);
                    else if (st === "Star") shp = grp.pathItems.star(cX+(w/2), cY-(h/2), w/2, w/4, 5);
                    else shp = grp.pathItems.roundedRectangle(cY, cX, w, h, rad, rad);

                    shp.fillColor = boundFillColor;
                    shp.filled = true;
                    
                    shp.strokeColor = boundStrokeColor;
                    shp.strokeWidth = sWeight;
                    shp.stroked = (sWeight > 0);

                    var txt = grp.textFrames.add();
                    txt.contents = content;
                    txt.textRange.characterAttributes.fillColor = boundTextColor;
                    txt.textRange.characterAttributes.textFont = allFonts.getByName(selectedFontName);
                    
                    var pJust = Justification.CENTER;
                    if (tJustify === "Left") pJust = Justification.LEFT;
                    else if (tJustify === "Right") pJust = Justification.RIGHT;
                    txt.textRange.paragraphAttributes.justification = pJust;

                    txt.textRange.characterAttributes.size = userFontSize;
                    var maxSafeWidth = w * 0.85; 
                    var iterations = 0;
                    while (txt.width > maxSafeWidth && txt.textRange.characterAttributes.size > 4 && iterations < 30) {
                        txt.textRange.characterAttributes.size -= 0.5;
                        iterations++;
                    }

                    var posX = cX + (w / 2) - (txt.width / 2);
                    var posY = cY - (h / 2) + (txt.height / 2); 

                    if (tAlign === "Top") {
                        posY = cY - (h * 0.15) + (txt.height / 2); 
                    } else if (tAlign === "Bottom") {
                        posY = cY - (h * 0.85) + (txt.height / 2); 
                    }

                    txt.position = [posX, posY];
                    shpGen++;
                }
                pgIdx++;
            }
        } catch (e) { alert("Error: " + e.message); }
    }
}
generateUltimateMasterSequence();
