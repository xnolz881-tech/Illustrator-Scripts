#target illustrator

/*
Ultimate WiFi Voucher Master Pro - Persistent Font Update


 */
var ver = "2.0";
var PropertyRights = "Property of Graphtech Advertizing";

function generateUltimateVoucherMaster() {
    var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add();

    var PaperSizes = {
        'Letter': {
            w: 612,
            h: 792
        },
        'A4': {
            w: 595.28,
            h: 841.89
        },
        'Legal': {
            w: 612,
            h: 936
        }
    };
    var allFonts = app.textFonts;
    var fontNames = [];
    for (var f = 0; f < allFonts.length; f++) {
        fontNames.push(allFonts[f].name);
    }

    var SettingsFolder = new Folder(Folder.userData + '/WiFiVoucherSettings_Ultimate');
    if (!SettingsFolder.exists) {
        SettingsFolder.create();
    }

    // var myFile = new File(myFolder + "/config.txt");

    // --- SETTINGS PERSISTENCE ---
    var settingsFile = new File(SettingsFolder + '/WiFiVoucherSettings_Ultimate.txt');

    // ADDED: lastFont to defaults
    var defaults = {
        unit: 0,
        paper: 0,
        orient: 0,
        w: '30',
        h: '15',
        rad: '2',
        space: '1.833',
        qty: '108',
        len: '6',
        marg: '4',
        gutter: '10',
        sCol: 16777215,
        tCol: 16711680,
        strCol: 0,
        strWidth: '.25',
        ssid: 'GraphtechPisoWifi',
        charType: 0,
        lastPath: 'E:\\Plug-ins\\Corel',
        lastFont: 'SourceCodePro-SemiBold',
        Time: '30',
        Exp: '60',
        Price: '1',
        CropML: '1.5',
        SrN: '1'
    };

    // Preset for A4 Size paper
    var preA4 = {
        unit: 0,
        paper: 0,
        orient: 0,
        w: '30.83',
        h: '15.5',
        rad: '2',
        space: '1.5',
        qty: '108',
        len: '6',
        marg: '3',
        gutter: '10',
        sCol: 16777215,
        tCol: 16711680,
        strCol: 0,
        strWidth: '.25',
        ssid: 'GraphtechPisoWifi',
        charType: 0,
        lastPath: 'E:\\Plug-ins\\Corel',
        lastFont: 'SourceCodePro-SemiBold',
        Time: 'A4',
        Exp: '60',
        Price: '1',
        CropML: '1.5',
        SrN: '1'
    };

    // Preset1 Letter Size Paper
    var preLetter = {
        unit: 0,
        paper: 1,
        orient: 0,
        w: '28.87',
        h: '14.64',
        rad: '2',
        space: '1.5',
        qty: '117',
        len: '6',
        marg: '3',
        gutter: '10',
        sCol: 16777215,
        tCol: 16711680,
        strCol: 0,
        strWidth: '.25',
        ssid: 'GraphtechPisoWifi',
        charType: 0,
        lastPath: 'E:\\Plug-ins\\Corel',
        lastFont: 'SourceCodePro-SemiBold',
        Time: '30',
        Exp: '60',
        Price: '1',
        CropML: '1.5',
        SrN: '1'
    };

    // Preset for Legal size Paper
    var preLegal = {
        unit: 0,
        paper: 2,
        orient: 0,
        w: '27.97',
        h: '14.64',
        rad: '2',
        space: '1.5',
        qty: '143',
        len: '8',
        marg: '3',
        gutter: '10',
        sCol: 16777215,
        tCol: 16711680,
        strCol: 0,
        strWidth: '.25',
        ssid: 'GraphtechPisoWifi',
        charType: 0,
        lastPath: 'E:\\Plug-ins\\Corel',
        lastFont: 'SourceCodePro-SemiBold',
        Time: '30',
        Exp: '60',
        Price: '1',
        CropML: '2',
        SrN: '1'
    };

    function loadSettings(defaults) {

        if (!settingsFile.exists)
            return defaults;
        try {
            settingsFile.open('r');
            var content = settingsFile.read();
            var obj = eval('(' + content + ')');
            settingsFile.close();
            // Merge defaults for missing keys (backwards compatibility)
            for (var key in defaults) {
                if (obj[key] === undefined)
                    obj[key] = defaults[key];
            }
            return obj;
        } catch (e) {
            return defaults;
        }
    }

    function decToRGB(dec) {
        var rgb = new RGBColor();
        rgb.red = (dec >> 16) & 0xFF;
        rgb.green = (dec >> 8) & 0xFF;
        rgb.blue = dec & 0xFF;
        return rgb;
    }

    function saveSettings(obj) {
        settingsFile.open('w');
        settingsFile.write(obj.toSource());
        settingsFile.close();
    }

    var currentSettings = loadSettings(defaults);

    var shapeColorDec = currentSettings.sCol;
    var textColorDec = currentSettings.tCol;
    var strokeColorDec = currentSettings.strCol;

    // --- HELPER FUNCTIONS ---
    function convertToPoints(val, unit) {
        if (unit === 'Inches')
            return val * 72;
        if (unit === 'Millimeters')
            return val * 2.834645;
        return val;
    }

    function getFormattedDate() {
        var date = new Date();

        // Helper to add leading zeros for older JS engines
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        var yyyy = date.getFullYear();
        var mm = pad(date.getMonth() + 1); // Months are 0-11
        var dd = pad(date.getDate());
        var HH = pad(date.getHours());
        var min = pad(date.getMinutes());
        var ss = pad(date.getSeconds());

        // return yyyy + mm + dd + " " + HH + ":" + min + ":" + ss;
        return yyyy + "-" + mm + "-" + dd + "_" + HH + "-" + min + "-" + ss;
    }
    
    // Function to add leading zeros (pads to 4 digits, e.g., 0001)
    function padSn(num, size) {
        var s = num + "";
        while (s.length < size)
            s = "0" + s;
        return s;
    }

    function customAlert(title, message) {
        var win = new Window("dialog", title);
        win.orientation = "column"; // Icon on left, text on right
        win.spacing = 15;
        win.margins = 20;
        // win.alignChildren = ["fill", "top"];


        // 2. The Text Group
        var textGroup = win.add("group");
        // textGroup.orientation = "column"; // Icon on left, text on right

        // 1. The "Icon" (Emoji)
        // We use a separate statictext for the emoji to make it look like an icon
        var icon = textGroup.add("statictext", undefined, "\u2139\uFE0F");
        // var fontSize = 150;
        icon.graphics.font = ScriptUI.newFont("Arial", ScriptUI.FontStyle.BOLD, 40); // Make the emoji large

        textGroup.orientation = "row";
        textGroup.alignChildren = ["left", "top"];

        var msg = textGroup.add("statictext", undefined, message, {
            multiline: true
        });
        // msg.preferredSize.width = 300; // Force wrapping at 300 pixels

        // 3. The OK Button
        var btnGroup = win.add("group");
        // btnGroup.alignChildren = ["center", "top"];
        btnGroup.alignment = "right";
        var okBtn = win.add("button", undefined, "OK");

        win.show();
    }

    // function customAlert(title, message) {
    // var win = new Window("dialog", title);
    // var msg = win.add("statictext", undefined, message, {multiline: true});

    // // You must set a width for wrapping to trigger
    // // msg.preferredSize.width = 300;

    // // win.add("statictext", undefined, message);
    // win.add("button", undefined, "OK");
    // win.show();
    // }
    // // Usage:
    // // customAlert("System Update", "The process is complete.");


    /**
     * Creates a straight line in Adobe Illustrator
     * @param {Array} start [x, y] coordinates for the start point
     * @param {Array} end [x, y] coordinates for the end point
     * @param {Number} weight Stroke weight in points
     * @returns {PathItem} The created path object
     */

    function createLine(parent, start, end, weight) {
        // var parent = app.activeDocument;
        var line = parent.pathItems.add();

        line.setEntirePath([start, end]);

        line.filled = false;
        line.stroked = true;
        line.strokeWidth = weight || 1; // Default to 1pt if weight isn't provided

        return line;
    }

    function MovetoLayer() {
        var doc = app.activeDocument;
        var selectedItems = app.selection;

        if (selectedItems.length === 0) {
            alert("Please select at least one object to move.");
            return;
        }

        // Prompt user for layer name
        // var layerName = prompt("Enter the name of the destination layer:", "Layer 2");
        var layerName = "Layer 2";

        if (layerName === null) {
            // User cancelled or entered empty name
            return;
        }

        var targetLayer;

        // Check if the layer already exists
        try {
            targetLayer = doc.layers.getByName(layerName);
        } catch (e) {
            // If the layer doesn't exist, create it
            targetLayer = doc.layers.add();
            targetLayer.name = layerName;
        }

        // Ensure the target layer is unlocked and visible
        targetLayer.locked = false;
        targetLayer.visible = true;

        // Move selected items to the target layer
        for (var i = selectedItems.length - 1; i >= 0; i--) {
            // Moving an item to a new layer can place it at the top or bottom of that layer's stack.
            // ElementPlacement.PLACEATBEGINNING places it at the top of the target layer's items.
            selectedItems[i].move(targetLayer, ElementPlacement.PLACEATBEGINNING);
            // Deselect the item after moving
            selectedItems[i].selected = false;
        }

        // Set the new layer as the active layer
        doc.activeLayer = targetLayer;

        // Force Illustrator to redraw the application windows to update the layers panel
        var activeLayer = doc.activeLayer;

        // Move the active layer to the bottom
        activeLayer.move(doc, ElementPlacement.PLACEATEND);
        // app.redraw();


        alert("Moved " + selectedItems.length + " objects to layer: \"" + layerName + "\"");

    }

    //input Row
    function addInputRow(parent, labelText, type, labelSize, inputSize, content, tip, shouldFocus) {
        var group = parent.add("group");
        group.orientation = "row";

        // 1. Label (Fixed width + Right align)
        var label = group.add("statictext", undefined, labelText);
        label.preferredSize.width = labelSize;
        label.justify = "right";
        if (tip)
            label.helpTip = tip;

        var input;

        // 2. Conditional Logic
        if (type === "dropdown") {
            input = group.add("dropdownlist", undefined, content);
            input.selection = 0;
            // input.justify = "right"; // Aligns dropdown text to the right
        } else {
            var input = group.add("edittext", undefined, content);
            // input.justify = "right"; // Aligns input text to the right

            input.onActivate = function () {
                // this.textselection = this.text;
            };
        }

        input.preferredSize.width = inputSize;
        if (tip)
            input.helpTip = tip;

        if (shouldFocus)
            input.active = true;

        return input;
    }

    // --- DIALOG SETUP ---

    var title = 'WiFi Voucher Master Pro';

    var dlg = new Window('dialog', title + ' ' + ver);
    dlg.orientation = 'column';
    dlg.alignChildren = ['fill', 'top'];
    dlg.spacing = 10;
    dlg.margins = 10;

    // --- PAGE SETUP ---
    var pnlPage = dlg.add('panel', undefined, 'Page Setup');
    pnlPage.orientation = 'row';
    pnlPage.alignChildren = ['fill', 'top'];
    pnlPage.helpTip = PropertyRights;
	// pnlPage.spacing = 10;
    // pnlPage.margins = 10;

    var row1 = pnlPage.add('group');
    row1.orientation = 'column';

    // var presetDrop = addInputRow(
    // row1,
    // "Preset:",
    // "dropdown",
    // 70,70,
    // ['A4', 'Letter', 'Legal'],
    // "Select Document Unit", 0);

    var paperDrop = addInputRow(
            row1,
            "Paper Size:",
            "dropdown",
            70, 100,
            ['A4', 'Letter', 'Legal'],
            "Select Paper Size", 1);

    var orientDrop = addInputRow(
            row1,
            "Orientation:",
            "dropdown",
            70, 100,
            ['Landscape', 'Portrait'],
            "Select Paper Orientation", 0);
			
	var unitDrop = addInputRow(
            row1,
            "Units:",
            "dropdown",
            70, 100,
            ['Millimeters', 'Points', 'Inches'],
            "Select Document Unit", 0);

    // row1.add('statictext', undefined, 'Paper:');
    // var paperDrop = row1.add('dropdownlist', undefined, ['A4', 'Letter', 'Legal']);
    paperDrop.selection = currentSettings.paper;
    // row1.add('statictext', undefined, 'Orient:');
    // var orientDrop = row1.add('dropdownlist', undefined, ['Landscape', 'Portrait']);
    orientDrop.selection = currentSettings.orient;
	unitDrop.selection = currentSettings.unit;

    var row2 = pnlPage.add('group');
    row2.orientation = 'column';

    var margIn = addInputRow(
            row2,
            "Margin:",
            "text",
            100, 60,
            currentSettings.marg,
            "Enter Margin:", 0);

    var gutterIn = addInputRow(
            row2,
            "Artboard Gutter:",
            "text",
            100, 60,
            currentSettings.gutter,
            "Enter Artboard Gutter:", 0);

    // var unitDrop = addInputRow(
            // row2,
            // "Units:",
            // "dropdown",
            // 100, 100,
            // ['Millimeters', 'Points', 'Inches'],
            // "Select Document Unit", 0);

    // row2.add('statictext', undefined, 'Units:');
    // var unitDrop = row2.add('dropdownlist', undefined, ['Millimeters', 'Points', 'Inches']);
    // unitDrop.selection = currentSettings.unit;
    // row2.add('statictext', undefined, 'Margin:');
    // var margIn = row2.add('edittext', undefined, currentSettings.marg); margIn.characters = 4;
    // row2.add('statictext', undefined, 'Ab Gutter:');
    // var gutterIn = row2.add('edittext', undefined, currentSettings.gutter); gutterIn.characters = 4;

    // --- STYLE & FONT ---
    var pnlStyle = dlg.add('panel', undefined, 'Colors and Font');
    pnlStyle.helpTip = PropertyRights;
    pnlStyle.alignChildren = ['fill', 'top'];

    var colGrp = pnlStyle.add('group');
    colGrp.alignChildren = ['fill', 'top'];

    var bFill = colGrp.add('button', undefined, 'Fill');
    var bStroke = colGrp.add('button', undefined, 'Stroke');
    // var bTxt = colGrp.add("button", undefined, "Text Color");
	
	var strWidthIn = addInputRow(
            colGrp,
            "Stroke Width (pt):",
            "text",
            100, 60,
            currentSettings.strWidth,
            "Enter Sttroke width in pts.", 0);

    bFill.onClick = function () {
        shapeColorDec = $.colorPicker(shapeColorDec);
    };
    bStroke.onClick = function () {
        strokeColorDec = $.colorPicker(strokeColorDec);
    };
    

    var styleRow2 = pnlStyle.add('group');
    styleRow2.alignChildren = ['center', 'top'];
    // styleRow2.orientation = 'column';

    // var strWidthIn = addInputRow(
            // styleRow2,
            // "Stroke Width (pt):",
            // "text",
            // 110, 50,
            // currentSettings.strWidth,
            // "Enter Sttroke width in pts.", 0);

    // styleRow2.add('statictext', undefined, 'Stroke Width (pt):');
    // var strWidthIn = styleRow2.add('edittext', undefined, currentSettings.strWidth);
    // strWidthIn.characters = 5;


    var fontDrop = addInputRow(
            styleRow2,
            "Font:",
            "dropdown",
            40, 200,
            fontNames,
            "Select Font Name", 0);
			
	var bTxt = styleRow2.add("button", undefined, "Font Color");
	bTxt.onClick = function () {
        textColorDec = $.colorPicker(textColorDec);
    };

    // var fontDrop = pnlStyle.add('dropdownlist', undefined, fontNames);
    // fontDrop.preferredSize.width = 250;

    // REVISED: Logic to find and select the persistent font
    var foundIndex = 0;
    for (var i = 0; i < fontNames.length; i++) {
        if (fontNames[i] === currentSettings.lastFont) {
            foundIndex = i;
            break;
        }
    }
    fontDrop.selection = foundIndex;

    // --- VOUCHER CONFIG ---
    var txtLen = 6; // Sets width to roughly 6 characters wide

    var pnlV = dlg.add("panel", undefined, "Voucher Configuration");
    pnlV.alignChildren = ['left', 'top'];
    var rowSSID = pnlV.add("group");
    // rowSSID.alignChildren = ['left', 'top'];

    var ssidIn = addInputRow(
            rowSSID,
            "WiFi SSID:",
            "text",
            60, 180,
            currentSettings.ssid,
            "Enter WiFi SSID", 0);

    var sn = addInputRow(
            rowSSID,
            "SN:",
            "text",
            40, 50,
            currentSettings.SrN,
            "Enter Start of\nSerial Number", 0);

    // rowSSID.add("statictext", undefined, "WiFi SSID:");
    // var ssidIn = rowSSID.add("edittext", undefined, currentSettings.ssid); ssidIn.preferredSize.width = 200;

    var VCgroup = pnlV.add("group");
    // VCgroup.alignChildren = ['left', 'top'];
    var VCGlabelWidth = 60;
    var VCGInputWidth = 50;
	// dlg.spacing = 10;
    // dlg.margins = 10;

    var rowV1 = VCgroup.add("group");
    rowV1.orientation = 'column';

    var lenIn = addInputRow(
            rowV1,
            "Code Len:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.len,
            "Enter Length of Code", 0);

    var qtyIn = addInputRow(
            rowV1,
            "Quantity:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.qty,
            "Enter Number of Codes\n to Generate", 0);

    var cropL = addInputRow(
            rowV1,
            "Cut Marks:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.CropML,
            "Enter Length of Crop Marks", 0);

    // var CodeLen = rowV1.add("statictext", undefined, "Code Len:");
    // CodeLen.characters = txtLen; // Sets width to roughly 20 characters wide
    // CodeLen.justify = "right";
    // var lenIn = rowV1.add("edittext", undefined, currentSettings.len); lenIn.characters = 4;
    // var QtyTxt = rowV1.add("statictext", undefined, "Qty:");
    // QtyTxt.characters = txtLen; // Sets width to roughly 20 characters wide
    // QtyTxt.justify = "right";
    // var qtyIn = rowV1.add("edittext", undefined, currentSettings.qty); qtyIn.characters = 4;

    var rowV4 = VCgroup.add("group");
    rowV4.orientation = 'column';

    var TimeIn = addInputRow(
            rowV4,
            "Time:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.Time,
            "Enter Duration of Voucher", 0);

    var ExpIn = addInputRow(
            rowV4,
            "Expiration:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.Exp,
            "Enter Expiration of Voucher", 0);

    var PriceIn = addInputRow(
            rowV4,
            "Price:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.Price,
            "Enter Price of Voucher", 0);

    // var TimeTxt = rowV4.add("statictext", undefined, "Time:");
    // TimeTxt.characters = txtLen; // Sets width to roughly 20 characters wide
    // TimeTxt.justify = "right";
    // var TimeIn = rowV4.add("edittext", undefined, currentSettings.Time); TimeIn.characters = 4;
    // var ExpTxt = rowV4.add("statictext", undefined, "Exp:");
    // ExpTxt.characters = txtLen; // Sets width to roughly 20 characters wide
    // ExpTxt.justify = "right";
    // var ExpIn = rowV4.add("edittext", undefined, currentSettings.Exp); ExpIn.characters = 4;
    // var PriceTxt = rowV4.add("statictext", undefined, "Price:");
    // PriceTxt.characters = txtLen; // Sets width to roughly 20 characters wide
    // PriceTxt.justify = "right";
    // var PriceIn = rowV4.add("edittext", undefined, currentSettings.Price); PriceIn.characters = 4;

    var rowV2 = VCgroup.add("group");
    rowV2.orientation = 'column';

    var wIn = addInputRow(
            rowV2,
            "Width:",
            "text",
            VCGlabelWidth - 20, VCGInputWidth,
            currentSettings.w,
            "Enter Width of Voucher", 0);

    var hIn = addInputRow(
            rowV2,
            "Height:",
            "text",
            VCGlabelWidth - 20, VCGInputWidth,
            currentSettings.h,
            "Enter Height of Voucher", 0);

    var radIn = addInputRow(
            rowV2,
            "Corner:",
            "text",
            VCGlabelWidth - 20, VCGInputWidth,
            currentSettings.rad,
            "Enter Corner of Voucher", 0);

    // var WidthTxt = rowV2.add("statictext", undefined, "Width:");
    // WidthTxt.characters = txtLen;
    // WidthTxt.justify = "right";
    // var wIn = rowV2.add("edittext", undefined, currentSettings.w); wIn.characters = 4;
    // var HeightTxt = rowV2.add("statictext", undefined, "Height:");
    // HeightTxt.characters = txtLen;
    // HeightTxt.justify = "right";
    // var hIn = rowV2.add("edittext", undefined, currentSettings.h); hIn.characters = 4;
    // var CorTxt = rowV2.add("statictext", undefined, "Corn Rad:");
    // CorTxt.characters = txtLen;
    // CorTxt.justify = "right";
    // var radIn = rowV2.add("edittext", undefined, currentSettings.rad); radIn.characters = 4;

    var rowV3 = pnlV.add("group");
    // rowV3.orientation = 'column';

    

    var typeDrop = addInputRow(
            rowV3,
            "Voucher Type:",
            "dropdown",
            VCGlabelWidth + 50, VCGInputWidth + 60,
            ["Capitals", "Small", "Numbers", "Mixed Alphanumeric", "Mixed Letters"],
            "Select Voucher Type", 0);
			
	var spaceIn = addInputRow(
            rowV3,
            "Spacing:",
            "text",
            VCGlabelWidth, VCGInputWidth,
            currentSettings.space,
            "Enter Gap Spacing\n1.833 for A4\size:30mmx15mm\nQty:108", 0);

    // rowV3.add("statictext", undefined, "Gap Spacing:");
    // var spaceIn = rowV3.add("edittext", undefined, currentSettings.space); spaceIn.characters = 4;
    // var typeDrop = rowV3.add("dropdownlist", undefined, ["Capitals", "Small", "Numbers", "Mixed Alphanumeric", "Mixed Letters"]);
    typeDrop.selection = currentSettings.charType;

    // --- PATH SETUP ---
    var pnlPath = dlg.add('panel', undefined, 'Export Location');
    var pathGrp = pnlPath.add('group');

    var expDrop = pathGrp.add('dropdownlist', undefined, ['No Export', 'PDF', 'PNG']);
    expDrop.helpTip = "Select Export File Format";
    expDrop.selection = 0;

    var pathDisplay = pathGrp.add('edittext', undefined, currentSettings.lastPath);
    pathDisplay.helpTip = "Enter export Path";

    pathDisplay.preferredSize.width = 110;

    var btnPath = pathGrp.add('button', undefined, 'Browse');
    btnPath.helpTip = "Click to Browse Export Path";

    btnPath.onClick = function () {
        var f = Folder.selectDialog('Select Export Folder');
        if (f)
            pathDisplay.text = f.fsName;
    };
    var myCheckbox = pathGrp.add("checkbox", undefined, ".rsc");
    myCheckbox.value = false; // Set default to unchecked
    myCheckbox.helpTip = "Tick to Generate .rsc file for Mikrotik Router";

    var presetGrp = dlg.add('panel', undefined, 'Preset Selection');

    presetGrp.orientation = 'row';
    // presetGrp.alignChildren = ['fill', 'top'];

    var presetDrop = addInputRow(
            presetGrp,
            'Preset:',
            'dropdown',
            50, 140,
            ['A4', 'Letter', 'Legal'],
            "Select Preset", 0);

    var btnPreset = presetGrp.add('button', undefined, 'Load Preset');

    btnPreset.helpTip = "Click to Load Preset";

    btnPreset.onClick = function () {
        var preLabel = defaults;

        // pathDisplay.text = "f.fsName";
        if (presetDrop.selection.index == 0) {
            preLabel = preA4;
        } else if (presetDrop.selection.index == 1) {
            preLabel = preLetter;
        } else {
            preLabel = preLegal;
        }
        // pathDisplay.text = "Legal"

        // currentSettings = loadSettings(preLegal);
		TimeIn.text = preLabel.Time;
        ExpIn.text = preLabel.Exp;
        PriceIn.text = preLabel.Price;
		
		unitDrop.selection = preLegal.unit;

        cropL.text = preLabel.CropML;
        sn.text = preLabel.SrN;

        paperDrop.selection = preLabel.paper;
        orientDrop.selection = preLabel.orient;
        wIn.text = preLabel.w;
        hIn.text = preLabel.h;
        radIn.text = preLabel.rad;
        spaceIn.text = preLabel.space;
        qtyIn.text = preLabel.qty;
        lenIn.text = preLabel.len;
        margIn.text = preLabel.marg;
        gutterIn.text = preLabel.gutter;
        shapeColorDec = preLabel.sCol;
        textColorDec = preLabel.tCol;
        strokeColorDec = preLabel.strCol;
        strWidthIn.text = preLabel.strWidth;
        ssidIn.text = preLabel.ssid;
        typeDrop.selection = preLabel.charType;
        pathDisplay.text = preLabel.lastPath;
        fontDrop.selection = prelabel.lastFont;

    }

    // --- FOOTER ---
    var footer = dlg.add('group');
    footer.alignChildren = ['fill', 'top'];

    // var expDrop = footer.add('dropdownlist', undefined, ['No Export', 'PDF', 'PNG']);
    // expDrop.helpTip = "Select Export File Format";
    // expDrop.selection = 0;

    var btnReset = footer.add('button', undefined, 'Restore Defaults');
    btnReset.helpTip = "Click to Restore Default Values";

    var cancelBtn = footer.add('button', undefined, 'Cancel', {
        name: 'cancel'
    });
    cancelBtn.helpTip = 'Click to cancel Voucher Generation'

        var okBtn = footer.add('button', undefined, 'Generate', {
            name: 'ok',

        });
    okBtn.helpTip = 'Click to Generate Vouchers'

        btnReset.onClick = function () {

        if (settingsFile.exists)
            settingsFile.remove();
        alert("Defaults restored. Please restart the script.");
        dlg.close();
    };

    if (dlg.show() == 1) {

        app.executeMenuCommand("fitall");

        var exportFolder = new Folder(pathDisplay.text);

        if (!exportFolder.exists) {
            alert('Invalid folder path.');
            return;
        }

        // REVISED: saveSettings now includes lastFont
        saveSettings({
            unit: unitDrop.selection.index,
            paper: paperDrop.selection.index,
            orient: orientDrop.selection.index,
            w: wIn.text,
            h: hIn.text,
            rad: radIn.text,
            space: spaceIn.text,
            qty: qtyIn.text,
            len: lenIn.text,
            marg: margIn.text,
            gutter: gutterIn.text,
            sCol: shapeColorDec,
            tCol: textColorDec,
            strCol: strokeColorDec,
            strWidth: strWidthIn.text,
            ssid: ssidIn.text,
            charType: typeDrop.selection.index,
            lastPath: pathDisplay.text,
            lastFont: fontDrop.selection.text,
            Time: TimeIn.text,
            Exp: ExpIn.text,
            Price: PriceIn.text,
            CropML: cropL.text,
            SrN: sn.text
        });

        // Continue with Generation...
        // alert("Generating vouchers with font: " + fontDrop.selection.text);
        // [Rest of your generation logic goes here]

        // alert('Generation will Initialize this might take a while please confirm!', );
        // customAlert(title, qtyIn.text + " Voucher Code Generation will Initialise.\n\nThis might take a few seconds Please Confirm");

        var u = unitDrop.selection.text,
        pBase = PaperSizes[paperDrop.selection.text],
        isLand = (orientDrop.selection.text === 'Landscape');
        var pW = isLand ? pBase.h : pBase.w,
        pH = isLand ? pBase.w : pBase.h;
        var count = parseInt(qtyIn.text),
        vW = convertToPoints(parseFloat(wIn.text), u),
        vH = convertToPoints(parseFloat(hIn.text), u);
        var vRad = convertToPoints(parseFloat(radIn.text), u),
        vSpace = convertToPoints(parseFloat(spaceIn.text), u);
        var vMarg = convertToPoints(parseFloat(margIn.text), u),
        vGutter = convertToPoints(parseFloat(gutterIn.text), u);
        var strW = parseFloat(strWidthIn.text),
        targetFont = allFonts.getByName(fontDrop.selection.text);
        var cLen = convertToPoints(parseFloat(cropL.text), u);
        var SrNo = parseFloat(sn.text)

            var LoadTxt = doc.textFrames.add();
        LoadTxt.contents = "Generating " + qtyIn.text + " Vouchers,\nPlease Wait...";
        // LoadTxt.textRange.characterAttributes.textFont = targetFont;
        LoadTxt.textRange.characterAttributes.size = 30;
        LoadTxt.position = [10, 100];
        app.redraw();

        var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower = "abcdefghijklmnopqrstuvwxyz",
        nums = "0123456789",
        charSet = "";
        var t = typeDrop.selection.text;
        if (t === "Capitals")
            charSet = upper;
        else if (t === "Small")
            charSet = lower;
        else if (t === "Numbers")
            charSet = nums;
        else if (t === "Mixed Letters")
            charSet = upper + lower;
        else
            charSet = upper + lower + nums;

        var codesCSV = [];
        var cols = Math.floor((pW - (vMarg * 2)) / (vW + vSpace)),
        rows = Math.floor((pH - (vMarg * 2)) / (vH + vSpace));
        var perPg = cols * rows;

        // var layerName = "Layer 2";
        // var targetLayer;
        // targetLayer = doc.layers.add();
        // targetLayer.name = layerName;
        try {
            var vGen = 0,
            pgIdx = 0;
            while (vGen < count) {
                var ab;
                if (pgIdx >= doc.artboards.length) {
                    var prev = doc.artboards[pgIdx - 1].artboardRect[2];
                    var newLeft = prev + vGutter;
                    ab = doc.artboards.add([newLeft, 0, newLeft + pW, -pH]);
                } else {
                    ab = doc.artboards[pgIdx];
                    ab.artboardRect = [0, 0, pW, -pH];
                }

                var sX = ab.artboardRect[0] + vMarg,
                sY = ab.artboardRect[1] - vMarg;

                for (var i = 0; i < perPg && vGen < count; i++) {
                    var code = '';
                    for (var j = 0; j < parseInt(lenIn.text); j++) {
                        code += charSet.charAt(Math.floor(Math.random() * charSet.length));
                    }
                    codesCSV.push(code);

                    var r = Math.floor(i / cols),
                    c = i % cols;
                    var cX = sX + (c * (vW + vSpace)),
                    cY = sY - (r * (vH + vSpace));

                    var grp = doc.groupItems.add();
                    var rect = grp.pathItems.roundedRectangle(cY - (vSpace / 2), cX + (vSpace / 2), vW, vH, vRad, vRad);

                    // rec.cornerType = CornerType.INVERTEDROUND;
                    // var line0 = grp.pathItems.add();
                    // var line1 = grp.pathItems.add();
                    // Access the path points to modify corner behavior

                    // Define start and end points [x, y]
                    // Note: Y-axis is positive upwards in Illustrator coordinates
                    // line0.setEntirePath([[cX - (vSpace / 2), cY + (vSpace / 2)], [cX, cY + (vSpace / 2)]]);
                    // line1.setEntirePath([[cX - (vSpace / 2), cY + (vSpace / 2)], [cX - (vSpace / 2), cY]]);

                    createLine(grp, [cX, cY], [cX + cLen, cY], strW);
                    createLine(grp, [cX, cY], [cX, (cY) - cLen], strW);

                    createLine(grp, [(cX + vW) + (vSpace), (cY - vH - vSpace)], [((cX + vW) + (vSpace)) - cLen, (cY - vH - vSpace)], strW);
                    createLine(grp, [(cX + vW) + (vSpace), (cY - vH - vSpace)], [((cX + vW) + (vSpace)), ((cY - vH) - (vSpace)) + cLen], strW);

                    grp.name = code;
                    rect.fillColor = decToRGB(shapeColorDec);
                    rect.strokeColor = decToRGB(strokeColorDec);
                    rect.strokeWidth = strW;
                    var rectName = rect.name = "rect" + i;

                    rectName = rect.name;

                    // var rect1 = doc.pathItems.getByName(rectName);
                    // // Move to target layer, placing it at the beginning
                    // rect1.move(targetLayer, ElementPlacement.PLACEATBEGINNING);

                    var stxt = grp.textFrames.add();
                    stxt.contents = ssidIn.text;
                    stxt.textRange.characterAttributes.textFont = targetFont;
                    stxt.textRange.characterAttributes.size = vH * 0.15;
                    stxt.position = [(cX + vSpace / 2) + (vW / 2) - (stxt.width / 2) + (vW * .02), (cY - vSpace / 2) - (vH * 0.10)];

                    var Ctxt = grp.textFrames.add();
					Ctxt.contents = 'Php ' + PriceIn.text + '.00 | ' + 'Time: ' + TimeIn.text + 'm';
                    // Ctxt.contents = 'P' + PriceIn.text + '.00 / ' + 'T:' + TimeIn.text + 'm - ' + 'Exp:' + ExpIn.text + 'm';
                    // Ctxt.textRange.characterAttributes.textFont = targetFont;
                    Ctxt.textRange.characterAttributes.size = vH * 0.15;
                    Ctxt.position = [(cX + vSpace / 2 + (vW * .02)) + (vW / 2) - (Ctxt.width / 2), (cY - vSpace / 2) - (vH * 0.75)];

                    var sntxt = grp.textFrames.add();
                    sntxt.contents = 'ID#:' + padSn(SrNo + i, 4);

                    sntxt.textRange.characterAttributes.textFont = targetFont;
                    sntxt.textRange.characterAttributes.fillColor = decToRGB(8421504);
                    sntxt.textRange.characterAttributes.size = vH * 0.15;
                    sntxt.rotate(90);
                    sntxt.position = [(cX + vSpace / 2 + 1), ((cY - vSpace / 2) - (vH / 2)) + (sntxt.height / 2)];

                    var txt = grp.textFrames.add();
                    txt.contents = code;
                    txt.textRange.characterAttributes.textFont = targetFont;
                    txt.textRange.characterAttributes.fillColor = decToRGB(textColorDec);
                    txt.textRange.characterAttributes.size = vH * 0.35;
                    // txt.textRange.paragraphAttributes.justification = Justification.CENTER;
                    if (txt.width > (vW * 0.85)) {
                        txt.textRange.characterAttributes.size *= (vW * 0.85) / txt.width;
                    }
                    txt.position = [(cX + vSpace / 2) + (vW / 2) - (txt.width / 2) + (vW * .02), (cY - vSpace / 2) - (vH / 1.8) + (txt.height / 2)];
                    vGen++;
                }
                pgIdx++;
            }

            // var timestamp = new Date().getTime();
            if (myCheckbox.value) {
                var timetext = getFormattedDate();

                var csvFile = new File(exportFolder.fsName + '/WiFi_Vouchers_' + timetext + '.rsc');

                // revised to generate rsc file to be upload and run in mikrotik terminal instead of a csv file

                csvFile.open('w');
                csvFile.writeln('/ip hotspot user');

                // /ip hotspot user
                // add name=codesCSV[k] server="all" profile="default" comment="60m,1,0," limit-uptime="30m" limit-bytes-total="0"

                for (var k = 0; k < codesCSV.length; k++)
                    csvFile.writeln("add name=" +
                        "\"" + codesCSV[k] + "\" server=\"all\" profile=\"default\" comment=\"SN.: " + padSn(SrNo + k, 4)  + " Price: " + PriceIn.text + ".00 / Time: " +
                        TimeIn.text + "m / Exp: " + ExpIn.text + "m\" limit-uptime=\"" +
                        TimeIn.text + "m\" limit-bytes-total=\"0\"");
                csvFile.close();
            }

            if (expDrop.selection.text !== 'No Export') {
                var fName = exportFolder.fsName + '/Voucher_Design_' + timestamp;
                if (expDrop.selection.text === 'PDF')
                    doc.saveAs(new File(fName + '.pdf'), new PDFSaveOptions());
                else
                    doc.exportFile(new File(fName + '.png'), ExportType.PNG24, new ExportOptionsPNG24());
            }
            // alert('Generation Complete!');
            // LoadTxt.remove();
            app.executeMenuCommand("fitall");

            // MovetoLayer();
            LoadTxt.remove();
            alert('Generation Complete!');

        } catch (e) {
            alert('Error: ' + e.message);
        }
    }
}

generateUltimateVoucherMaster();
