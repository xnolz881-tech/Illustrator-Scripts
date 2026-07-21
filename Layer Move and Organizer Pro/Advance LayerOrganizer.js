// =================================================================
// Advanced Layer Mover & Organizer
// Copyright (c) 2026 Noli A. Navarro  (Graphtech Advertyizing)
// Licensed under the MIT License (See repository root for details)
// =================================================================


// PART 1A: SETUP & COLOR MAPPINGS
function main() {
    if (app.documents.length === 0) {
        alert("Please open a document first.");
        return;
    }

    var doc = app.activeDocument;
    var selectedItems = app.selection;

    if (selectedItems.length === 0) {
        alert("Please select at least one object to move.");
        return;
    }

    var aiPrefs = app.preferences;

    // Professional Native RGB Color Mapping Table
    var colorNames = ["Default (AI Choice)", "Magenta (Cut Lines)", "Cyan (Print Info)", "Red", "Blue", "Green", "Yellow", "Orange", "Light Blue", "Gold", "Dark Green", "Pink"];
    
    var getAiRgbColor = function(index) {
        var rgbData = [
            null,
,   // Magenta,   // Cyan,     // Red,     // Blue,     // Green,   // Yellow,   // Orange, // Light Blue,   // Gold,     // Dark Green
            [255, 192, 203]  // Pink
        ];
        
        var selectedRGB = rgbData[index];
        if (!selectedRGB) return null;

        var targetColor = new RGBColor();
        targetColor.red = selectedRGB[0];
        targetColor.green = selectedRGB[1];
        targetColor.blue = selectedRGB[2];
        return targetColor;
    };

    var defaultPresets = [
        "Manual Setup:Layer 2:0:0:custom:0",
        "Die-Cut Sticker:Artwork:1:0:custom:1", 
        "Apparel Screenprint:Base:2:1:custom:2"  
    ];
    // PART 1B: PRESET DECODER & UPPER UI CONSTRUCTION
    var presetStrings = [];
    var presetNames = [];
    var presetData = {};

    try {
        var rawCustomStr = "";
        if (aiPrefs.getIntegerPreference("AdvMover_HasCustomPresets") === 1) {
            rawCustomStr = aiPrefs.getStringPreference("AdvMover_CustomPresetData");
        }
        
        var fullPresetList = defaultPresets;
        if (rawCustomStr !== "") {
            fullPresetList = defaultPresets.concat(rawCustomStr.split("|"));
        }

        for (var p = 0; p < fullPresetList.length; p++) {
            var parts = fullPresetList[p].split(":");
            if (parts.length >= 4) {
                var pName = parts[0]; 
                presetStrings.push(fullPresetList[p]);
                presetNames.push(pName);
                presetData[pName] = {
                    layerName: parts[1],
                    tagIndex: parseInt(parts[2], 10),
                    isPrefix: parts[3] === "1",
                    customText: parts[4] || "custom",
                    colorIndex: parts[5] ? parseInt(parts[5], 10) : 0
                };
            }
        }
    } catch(e) {
        presetNames = ["Manual Setup"];
        presetData["Manual Setup"] = { layerName: "Layer 2", tagIndex: 0, isPrefix: false, customText: "custom", colorIndex: 0 };
    }

    var activePresetIndex = 0;
    var savedPlaceTop = true;
    var savedShouldSort = false;
    var savedSortDepth = 0;
    var savedAutoLock = true;   
    var savedAutoHide = true;   

    try {
        if (aiPrefs.getIntegerPreference("AdvMover_HasSaved") === 1) {
            activePresetIndex = aiPrefs.getIntegerPreference("AdvMover_ActivePresetIndex");
            savedPlaceTop = (aiPrefs.getIntegerPreference("AdvMover_PlaceTop") === 1);
            savedShouldSort = (aiPrefs.getIntegerPreference("AdvMover_ShouldSort") === 1);
            savedSortDepth = aiPrefs.getIntegerPreference("AdvMover_SortDepth");
            savedAutoLock = (aiPrefs.getIntegerPreference("AdvMover_AutoLock") !== 0); 
            savedAutoHide = (aiPrefs.getIntegerPreference("AdvMover_AutoHide") !== 0);
            
            if (activePresetIndex >= presetNames.length || activePresetIndex < 0) {
                activePresetIndex = 0;
            }
        }
    } catch(prefError) {}

    var dialog = new Window("dialog", "Advanced Layer Mover & Organizer");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    var presetPanel = dialog.add("panel", undefined, "Project Presets");
    presetPanel.orientation = "row";
    presetPanel.alignChildren = ["left", "center"];
    presetPanel.margins = 12;
    presetPanel.spacing = 8;

    var presetDropdown = presetPanel.add("dropdownlist", undefined, presetNames);
    presetDropdown.selection = activePresetIndex;
    presetDropdown.alignment = ["fill", "center"];

    var btnSavePreset = presetPanel.add("button", undefined, "Save");
    var btnDeletePreset = presetPanel.add("button", undefined, "Delete");

    var namePanel = dialog.add("panel", undefined, "Destination Layer");
    namePanel.orientation = "column";
    namePanel.alignChildren = ["fill", "top"];
    namePanel.margins = 12;
    var nameInput = namePanel.add("edittext", undefined, "");
    nameInput.active = true;

    var modPanel = dialog.add("panel", undefined, "Name Modifiers & Layer Colors");
    modPanel.orientation = "column";
    modPanel.alignChildren = ["fill", "top"];
    modPanel.margins = 12;
    modPanel.spacing = 8;
    
    var dropGroup = modPanel.add("group");
    dropGroup.orientation = "row";
    dropGroup.add("statictext", undefined, "Select Tag:");
    var tagDropdown = dropGroup.add("dropdownlist", undefined, ["None", "Add _cut", "Add _print", "Custom Tag..."]);

    var customGroup = dropGroup.add("group");
    customGroup.orientation = "row";
    customGroup.add("statictext", undefined, "Custom Tag text:");
    var customInput = customGroup.add("edittext", undefined, "");
    customInput.characters = 12;

    var placementGroup = modPanel.add("group");
    placementGroup.orientation = "row";
    placementGroup.spacing = 20;
    var radSuffix = placementGroup.add("radiobutton", undefined, "Append as Suffix");
    var radPrefix = placementGroup.add("radiobutton", undefined, "Prepend as Prefix");

    var colorGroup = modPanel.add("group");
    colorGroup.orientation = "row";
    colorGroup.add("statictext", undefined, "Layer UI Color:");
    var colorDropdown = colorGroup.add("dropdownlist", undefined, colorNames);
    colorDropdown.selection = 0;
    // PART 1C: DYNAMIC EVENT LISTENERS & INTERFACE COMPLETION
    var updateModifierUI = function() {
        var isNone = (tagDropdown.selection.index === 0);
        var isCustom = (tagDropdown.selection.index === 3);
        customGroup.visible = isCustom;
        placementGroup.enabled = !isNone;
        dialog.layout.layout(true); 
    };

    tagDropdown.onChange = updateModifierUI;

    presetDropdown.onChange = function() {
        if (!presetDropdown.selection) return;
        var currentPresetName = presetDropdown.selection.text;
        var config = presetData[currentPresetName];
        if (config) {
            nameInput.text = config.layerName;
            tagDropdown.selection = config.tagIndex;
            customInput.text = config.customText;
            colorDropdown.selection = config.colorIndex; 
            if (config.isPrefix) { radPrefix.value = true; } else { radSuffix.value = true; }
            updateModifierUI();
        }
    };

    var placePanel = dialog.add("panel", undefined, "Item Stacking Order");
    placePanel.orientation = "row";
    placePanel.alignChildren = ["left", "center"];
    placePanel.spacing = 20;
    placePanel.margins = 12;
    var radTop = placePanel.add("radiobutton", undefined, "Top of Layer");
    var radBottom = placePanel.add("radiobutton", undefined, "Bottom of Layer");
    if (savedPlaceTop) { radTop.value = true; } else { radBottom.value = true; }

    var triggersPanel = dialog.add("panel", undefined, "Smart Rule Triggers");
    triggersPanel.orientation = "row";
    triggersPanel.alignChildren = ["left", "center"];
    triggersPanel.spacing = 20;
    triggersPanel.margins = 12;

    var chkAutoLock = triggersPanel.add("checkbox", undefined, "Auto-Lock if name contains 'cut'");
    var chkAutoHide = triggersPanel.add("checkbox", undefined, "Auto-Hide if name contains 'print'");
    chkAutoLock.value = savedAutoLock;
    chkAutoHide.value = savedAutoHide;

    var actionPanel = dialog.add("panel", undefined, "Post-Move Actions");
    actionPanel.orientation = "column";
    actionPanel.alignChildren = ["fill", "top"];
    actionPanel.margins = 12;
    actionPanel.spacing = 8;
    
    var chkSort = actionPanel.add("checkbox", undefined, "Sort layers alphabetically");
    chkSort.value = savedShouldSort;
    
    var sortDepthGroup = actionPanel.add("group");
    sortDepthGroup.orientation = "row";
    sortDepthGroup.spacing = 20;
    sortDepthGroup.margins = 12; 
    var radMainOnly = sortDepthGroup.add("radiobutton", undefined, "Main layers only");
    var radIncludeSubs = sortDepthGroup.add("radiobutton", undefined, "Include nested sublayers");
    if (savedSortDepth === 1) { radIncludeSubs.value = true; } else { radMainOnly.value = true; }

    sortDepthGroup.enabled = chkSort.value;
    chkSort.onClick = function() { sortDepthGroup.enabled = chkSort.value; };

    var btnGroup = dialog.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignment = ["right", "top"];
    var btnCancel = btnGroup.add("button", undefined, "Cancel", {name: "cancel"});
    var btnOk = btnGroup.add("button", undefined, "OK", {name: "ok"});
	
    // -------------------------------------------------------------
    // VISUAL FOOTER: Etched Line Divider & Author Credit Line
    // -------------------------------------------------------------
    // Add a structural horizontal rule across the dialog window
    var footerDivider = dialog.add("panel", undefined, undefined);
    footerDivider.alignment = ["fill", "bottom"];
    footerDivider.height = 2; // Renders as a thin, crisp etched separator line

    var footerGroup = dialog.add("group");
    footerGroup.orientation = "row";
    footerGroup.alignment = ["center", "bottom"];
    footerGroup.margins = 2;
    
    var txtAuthor = footerGroup.add("statictext", undefined, "Developed by: Noli A. Navarro  (Graphtech Advertizing)");
    txtAuthor.graphics.font = ScriptUI.newFont("sans", "ITALIC", 8);
    // -------------------------------------------------------------

	

    dialog.layout.layout(true);
    presetDropdown.onChange();
    dialog.layout.layout(true);
    // PART 2: DYNAMIC PRESET ALTERATION & SMART LAYER MIGRATION

    // Event Handler: Save Current Settings as a New Custom Preset
    btnSavePreset.onClick = function() {
        var rawName = prompt("Enter a unique name for this preset:", "My Custom Preset");
        if (rawName === null) return;

        var cleanName = rawName.replace(/^\s+|\s+$/g, "").replace(/[:|]/g, "-");
        if (cleanName === "") {
            alert("Preset name cannot be empty.");
            return;
        }

        if (cleanName === "Manual Setup" || cleanName === "Die-Cut Sticker" || cleanName === "Apparel Screenprint") {
            alert("Cannot overwrite factory defaults. Please use a unique name.");
            return;
        }

        var layerVal = nameInput.text.replace(/^\s+|\s+$/g, "").replace(/[:|]/g, "-");
        var tagVal = tagDropdown.selection.index;
        var customVal = customInput.text.replace(/^\s+|\s+$/g, "").replace(/[:|]/g, "-");
        var prefixVal = radPrefix.value ? "1" : "0";
        var colorVal = colorDropdown.selection.index;

        // Compression syntax: Name:LayerName:TagIndex:IsPrefix:CustomText:ColorIndex
        var newPresetString = cleanName + ":" + layerVal + ":" + tagVal + ":" + prefixVal + ":" + customVal + ":" + colorVal;

        var cleanCustomList = [];
        var rawCustomStr = "";
        try {
            if (aiPrefs.getIntegerPreference("AdvMover_HasCustomPresets") === 1) {
                rawCustomStr = aiPrefs.getStringPreference("AdvMover_CustomPresetData");
            }
        } catch(e) {}

        if (rawCustomStr !== "") {
            var oldCustomArray = rawCustomStr.split("|");
            for (var c = 0; c < oldCustomArray.length; c++) {
                var firstColon = oldCustomArray[c].indexOf(":");
                if (firstColon !== -1) {
                    var oldName = oldCustomArray[c].substring(0, firstColon);
                    if (oldName !== cleanName && oldCustomArray[c] !== "") {
                        cleanCustomList.push(oldCustomArray[c]);
                    }
                }
            }
        }

        cleanCustomList.push(newPresetString);
        var finalCustomDataString = cleanCustomList.join("|");

        try {
            aiPrefs.setIntegerPreference("AdvMover_HasCustomPresets", 1);
            aiPrefs.setStringPreference("AdvMover_CustomPresetData", finalCustomDataString);
        } catch(err) {
            alert("Error saving custom preferences to system storage registry.");
            return;
        }

        alert("Preset \"" + cleanName + "\" saved!\nIt will load completely into your list the next time you launch the script.");
    };

    // Event Handler: Delete the Currently Selected Custom Preset
    btnDeletePreset.onClick = function() {
        if (!presetDropdown.selection) return;
        var targetDeleteName = presetDropdown.selection.text;

        if (targetDeleteName === "Manual Setup" || targetDeleteName === "Die-Cut Sticker" || targetDeleteName === "Apparel Screenprint") {
            alert("Cannot delete standard factory default configurations.");
            return;
        }

        if (!confirm("Are you sure you want to permanently delete the custom preset \"" + targetDeleteName + "\"?")) {
            return;
        }

        var remainingCustomList = [];
        var rawCustomStr = "";
        try {
            if (aiPrefs.getIntegerPreference("AdvMover_HasCustomPresets") === 1) {
                rawCustomStr = aiPrefs.getStringPreference("AdvMover_CustomPresetData");
            }
        } catch(e) {}

        if (rawCustomStr !== "") {
            var oldCustomArray = rawCustomStr.split("|");
            for (var d = 0; d < oldCustomArray.length; d++) {
                var firstColon = oldCustomArray[d].indexOf(":");
                if (firstColon !== -1) {
                    var oldName = oldCustomArray[d].substring(0, firstColon);
                    if (oldName !== targetDeleteName && oldCustomArray[d] !== "") {
                        remainingCustomList.push(oldCustomArray[d]);
                    }
                }
            }
        }

        var finalCustomDataString = remainingCustomList.join("|");

        try {
            if (remainingCustomList.length === 0) {
                aiPrefs.setIntegerPreference("AdvMover_HasCustomPresets", 0);
                aiPrefs.setStringPreference("AdvMover_CustomPresetData", "");
            } else {
                aiPrefs.setIntegerPreference("AdvMover_HasCustomPresets", 1);
                aiPrefs.setStringPreference("AdvMover_CustomPresetData", finalCustomDataString);
            }
            aiPrefs.setIntegerPreference("AdvMover_ActivePresetIndex", 0); 
        } catch(err) {
            alert("Error updating registry preferences cache.");
            return;
        }

        alert("Preset \"" + targetDeleteName + "\" removed successfully!\nChanges will reflect fully upon reloading the script.");
        dialog.close(0); 
    };

    if (dialog.show() !== 1) {
        return; 
    }

    var rawLayerName = nameInput.text.replace(/^\s+|\s+$/g, "");
    if (rawLayerName === "") {
        alert("Layer name cannot be empty.");
        return;
    }

    try {
        aiPrefs.setIntegerPreference("AdvMover_HasSaved", 1);
        aiPrefs.setIntegerPreference("AdvMover_ActivePresetIndex", presetDropdown.selection.index);
        aiPrefs.setIntegerPreference("AdvMover_PlaceTop", radTop.value ? 1 : 0);
        aiPrefs.setIntegerPreference("AdvMover_ShouldSort", chkSort.value ? 1 : 0);
        aiPrefs.setIntegerPreference("AdvMover_SortDepth", radIncludeSubs.value ? 1 : 0);
        aiPrefs.setIntegerPreference("AdvMover_AutoLock", chkAutoLock.value ? 1 : 0);
        aiPrefs.setIntegerPreference("AdvMover_AutoHide", chkAutoHide.value ? 1 : 0);
    } catch(saveError) {}

    var finalLayerName = rawLayerName;
    var activeTag = "";
    var selectedIndex = tagDropdown.selection.index;

    if (selectedIndex === 1) {
        activeTag = "_cut";
    } else if (selectedIndex === 2) {
        activeTag = "_print";
    } else if (selectedIndex === 3) {
        activeTag = customInput.text.replace(/^\s+|\s+$/g, "");
    }

    if (activeTag !== "") {
        if (radPrefix.value) {
            var cleanPrefix = activeTag.replace(/^[_|-]+/, "") + "_";
            finalLayerName = cleanPrefix + finalLayerName;
        } else {
            finalLayerName = finalLayerName + activeTag;
        }
    }

    var placementMethod = radBottom.value ? ElementPlacement.PLACEATEND : ElementPlacement.PLACEATBEGINNING;

    var targetLayer;
    try {
        targetLayer = doc.layers.getByName(finalLayerName);
    } catch (e) {
        targetLayer = doc.layers.add();
        targetLayer.name = finalLayerName;
    }

    targetLayer.locked = false;
    targetLayer.visible = true;

    var nativeColorSelection = getAiRgbColor(colorDropdown.selection.index);
    if (nativeColorSelection !== null) {
        try { targetLayer.color = nativeColorSelection; } catch(e) {}
    }

    var itemsCount = selectedItems.length;
    for (var i = itemsCount - 1; i >= 0; i--) {
        selectedItems[i].move(targetLayer, placementMethod);
        selectedItems[i].selected = false; 
    }

    var lowerCaseFinalName = finalLayerName.toLowerCase();
    
    if (chkAutoLock.value && lowerCaseFinalName.indexOf("cut") !== -1) {
        targetLayer.locked = true;
    }
    
    if (chkAutoHide.value && lowerCaseFinalName.indexOf("print") !== -1) {
        targetLayer.visible = false;
    }

    if (!targetLayer.locked && targetLayer.visible) {
        doc.activeLayer = targetLayer;
    }
    // PART 3: FLATTENED LAYER SORTING LOGIC AND SCRIPT FINALIZATION

    // Check if the user opted to sort layers alphabetically
    if (chkSort.value) {
        
        // 1. Sort Top-Level Main Layers (Exactly like your original working script)
        var mainLayerArray = [];
        var mainLayersCount = doc.layers.length;

        for (var l = 0; l < mainLayersCount; l++) {
            mainLayerArray.push(doc.layers[l]);
        }

        mainLayerArray.sort(function(a, b) {
            var nameA = a.name.toLowerCase();
            var nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        for (var s = mainLayerArray.length - 1; s >= 0; s--) {
            mainLayerArray[s].move(doc, ElementPlacement.PLACEATBEGINNING);
        }

        // 2. Sort Sublayers (Only runs if chosen, using safe, isolated single-level loops)
        if (radIncludeSubs.value) {
            // Re-fetch sorted main layers to ensure order integrity
            for (var m = 0; m < doc.layers.length; m++) {
                var parentLayer = doc.layers[m];
                var subLayersCount = parentLayer.layers.length;

                // Only sort if this specific main layer actually contains nested sublayers
                if (subLayersCount > 1) {
                    var subLayerArray = [];

                    // Collect sublayers for this specific folder row
                    for (var n = 0; n < subLayersCount; n++) {
                        subLayerArray.push(parentLayer.layers[n]);
                    }

                    // Sort the sublayers alphabetically
                    subLayerArray.sort(function(a, b) {
                        var nameA = a.name.toLowerCase();
                        var nameB = b.name.toLowerCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });

                    // Rearrange sublayers locally within their parent layer container
                    for (var k = subLayerArray.length - 1; k >= 0; k--) {
                        subLayerArray[k].move(parentLayer, ElementPlacement.PLACEATBEGINNING);
                    }
                }
            }
        }
    }

    // Force Illustrator to redraw the application windows to update the layers panel UI cleanly
    app.redraw();

    // Final confirmation to user
    alert("Success!\nMoved " + itemsCount + " objects to layer: \"" + finalLayerName + "\"");
}

// Safely execute the complete process
main();
