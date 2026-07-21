# Advanced Layer Mover & Organizer for Adobe Illustrator

A production-grade ExtendScript (`.jsx`) utility designed for Adobe Illustrator that accelerates layout workflows, artwork channel isolation, and prepress organization. It allows operators to move selected objects to a destination layer instantly while dynamically handling naming rules, structural layer formatting, preset profiles, auto-saving choices, and automatic alphabetical sorting.

---

## 🚀 Key Features

* **Smart Target Generation**: Prompts for a layer name, automatically identifying if it exists or generating it on the fly without breaking artwork stacks.
* **Automated Name Modifiers**: Append suffixes or prepend prefixes (like `_cut` or `_print`) instantly using a dynamic, clean drop-down structure.
* **Dynamic Content Stacking**: Choose whether incoming items are placed at the absolute **Top** or **Bottom** of the destination layer's stack.
* **Persistent Preferences Memory**: Auto-saves your checkboxes, radio selections, custom entries, and last-used configurations directly to Illustrator's local registry so they reload automatically next time.
* **Dynamic Project Presets System**: Create, save, and delete custom workspace templates directly within the panel interface for repeatable, zero-error workflows.
* **Hybrid Layer UI Color Engine**: Automatically assigns standardized printing indicator colors (like **Magenta** for dielines or **Cyan** for print info) to the layer, with an interactive drop-down override.
* **Omni-Directional Smart Triggers**: Detects critical production phrases (like "cut" or "print") *anywhere* in your final layer name to automatically toggle advanced environment security:
  * **Auto-Locking**: Instantly padlocks structural folders to safeguard paths from human error.
  * **Auto-Hiding**: Toggles layer visibility off to clear up your visual workspace.
* **Memory-Stable Flattened Sorting**: Safely reorganizes top-level layers or deeply nested sublayers alphabetically without triggering legacy heap allocation application crashes.

---

## 🛠️ Installation Guide

### Method 1: standard Script Menu installation (Recommended)
To make the script permanently accessible directly inside Adobe Illustrator's native interface:

1. Download or compile the consolidated `.jsx` script file.
2. Copy the file into your local Adobe Illustrator Scripts directory:
   * **Windows**: `C:\Program Files\Adobe\Adobe Illustrator [Version]\Presets\[Language]\Scripts\`
   * **macOS**: `/Applications/Adobe Illustrator [Version]/Presets/[Language]/Scripts/`
3. Restart Adobe Illustrator.
4. The tool will now be accessible via **File > Scripts > [Script Name]**.

### Method 2: On-The-Fly Execution
1. In Illustrator, go to **File > Scripts > Other Script...** (or press `Ctrl + F12` / `Cmd + F12`).
2. Target your saved `.jsx` file and click open to instantly launch the panel workspace.

---

## 📖 How to Use

1. **Select Elements**: Select at least one path, group, or object on your artboard that you wish to relocate.
2. **Launch the Panel**: Open the script.
3. **Configure Settings**:
   * Select a saved template from the **Project Presets** menu or type a **Destination Layer** name.
   * Customize layout tag modifiers (None, Cut, Print, or write a Custom entry field tag).
   * Pick an optional **Layer UI Color** highlighting standard.
   * Check whether you want the script to **Sort layers alphabetically** (Main folders only, or include all nested sublayers).
4. **Execute**: Click **OK**. Your selected elements will be seamlessly migrated, and any matching safety filters (locking or hiding) will instantly deploy in the background.

---

## 🎨 Production Examples

### 1. Dieline Separation (Stickers/Packaging)
Select a path, launch the script, and select the **Die-Cut Sticker** preset. The script automatically creates an `Artwork_cut` layer, colorizes its tracking wireframe highlight to **Magenta**, transfers the paths to the top, and **instantly locks the layer** to prevent accidental shifting during edits.

### 2. Prepress Information Layer
Select printing registration marks or dimension callouts, launch the script, and pick **Apparel Screenprint**. The script creates a `print_Base` folder, colorizes it to **Cyan**, transfers the paths, and **instantly toggles the layer visibility eye off** to clean up your canvas workspace for core design tasks.

---

## 🖥️ Compatibility

* Fully backwards compatible across older versions of Creative Cloud (CC).
* Extensively verified on modern, newer versions of **Adobe Illustrator (v29.x)** and up.
* Runs cross-platform across **Windows** and **macOS** environments.

---

## 📝 Author Note
Developed with precision loop logic architectures to guarantee speed, efficiency, and zero software engine allocation deadlocks. 

---

## 📄 License & Credits

This project is licensed under the **MIT License** — free to use, modify, and distribute for both personal and commercial projects. 

### 🌟 Credit the Author

If this script saves you time in your production workflow, giving the repository a ⭐ **Star** on GitHub is highly appreciated!

---

## 🤝 How to Contribute

Contributions are welcome! If you want to help improve this script, please follow these steps:

1. **Report Bugs / Request Features**: Open an **Issue** on GitHub describing the bug or feature request.
2. **Fork the Repository**: Click the **Fork** button at the top right of this page to create your own copy of the project.
3. **Create a Feature Branch**: Work on your changes in a separate branch (e.g., `git checkout -b feature/AmazingFeature`).
4. **Test Your Code**: Ensure your script variations compile cleanly and run across Adobe Illustrator versions without crashing the memory heap.
5. **Submit a Pull Request**: Commit your changes, push them to your fork, and open a **Pull Request** back to the main repository for review.

### 📜 Scripting Guidelines
* Code must be written in **ExtendScript (ES3 compatible)** to ensure backward compatibility.
* Avoid using recursive functions on Illustrator DOM object collections (`doc.layers.move()`) to protect against application crashes.
* Always use defensive coding wrappers (`try/catch` blocks) when interacting with application preferences or system color engines.

*Maintained and developed by **Noli A. Navarro  (Graphtech Advertizing)**.*
