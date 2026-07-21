# Ultimate Illustrator Shape Sequence Master Pro

An advanced automation script for Adobe Illustrator that dynamically generates structured grids of shapes, custom sequence text mappings, and serial number grids across multiple artboards. Built with strict ES3 compliance, this tool includes real-time calculation status modules, auto-fitting typography algorithms, and global swatch panel hooks for maximum post-generation design flexibility.

## 🌟 Key Features

*   **Bidirectional Layout Flow Sorting**: Generate grids horizontally (**Left-to-Right then Down**) or vertically (**Top-to-Bottom then Right**) to fit diverse printing layout formats.
*   **Asymmetrical Spacing & Bidirectional Auto-Distribution**: Choose between setting strict, fixed millimeter/inch/point gaps manually, or inputting a specific **Rows/Cols Count** to let the script distribute your shapes with equal air-gap calculations perfectly across the container bounds.
*   **Three-Channel Swatch Panel Bindings**: Automatically generates or maps native, global Illustrator Spot Swatches (`Master Fill Color`, `Master Stroke Color`, and `Master Text Color`). Change colors natively inside Illustrator later, and your whole layout updates globally on the fly.
*   **Smart Text Auto-Fitting**: Automatically fits long sequence strings or multi-digit values by downscaling typography font size incrementally until the text fits inside your boundaries safely.
*   **Dynamic Base Artboard Resizing**: Instantly resizes and reorients your active workspace canvas base to match your exact setup preferences, while building additional trailing multi-page layers cleanly with custom gutters.
*   **Custom Origin Overrides**: Lock down an explicit `X, Y` coordinate point on your artboard for drawing the very first box, or seamlessly fall back to uniform boundary margins.
*   **Data Injection Arrays**: Supports standard number ranges (with dynamic leading/trailing zero padding choices like `01`, `001`, `0001`), or a custom text layout prefix/suffix wrapper (e.g., matching `Item-001-A`). Also includes a manual **CSV File Reader** loop.
*   **Live Status Evaluation Panel**: Displays real-time, non-blocking calculations of page capacities, shape column matrices, and estimated artboard totals directly inside the interface window as you type or tweak dropdown options.

## 🛠️ Installation & Setup

1.  Download or copy the complete unified `.jsx` script file.
2.  Save the file as `IllustratorShapeSequenceMaster.jsx`.
3.  Place the script file inside your local Illustrator scripts installation folder:
    *   **Windows**: `C:\Program Files\Adobe\Adobe Illustrator [Version]\Presets\[Language]\Scripts`
    *   **macOS**: `/Applications/Adobe Illustrator [Version]/Presets/[Language]/Scripts`
4.  Restart Adobe Illustrator to allow the script to register natively inside the interface menu bars.

## 🚀 How to Use

1.  Open or create any document in Adobe Illustrator.
2.  Navigate to the top menu bar and select: **File > Scripts > IllustratorShapeSequenceMaster**.
3.  **Configure Page Layout**: Select your paper target dimension (Letter, A4, Legal), orientation setup, and workspace unit metrics.
4.  **Style Matrix Elements**: Set up your typography properties (font family, font size, paragraph horizontal alignment, and vertical grid axis snapping matrices). Click the color buttons to define your custom fill, border stroke outlines, and label text fills.
5.  **Set Dimensions & Sequencing**: Input shape sizes, corner boundary radii, prefixes/suffixes, and choosing between standard index counts or clicking **Load CSV** to upload external values.
6.  **Review Live Status Display**: Examine the summary panel at the bottom of the tool dialogue window to check grid counts and page requirements before compiling.
7.  Click **Generate**.

## 💡 Pro-Tips for Flawless Execution

*   **Global Swatch Power**: After the script finishes running, do not spend time selecting individual shapes to tweak color aesthetics. Open your Illustrator **Swatches Panel**, double-click `Master Fill Color` or `Master Stroke Color`, modify the sliders, and your changes will instantly apply to every single asset on the canvas.
*   **Dynamic Visibility Handlers**: When shifting Spacing Mode settings from `Fixed Gaps` to `Auto-Distribute`, irrelevant input panels will automatically hide or lock out contextually based on your active Layout Flow direction. This prevents configuration errors or overlapping boundaries.
*   **Clean Settings Resets**: The script saves your parameter selections into your local user preferences data path automatically so it loads your last setup on next use. If you ever need a fresh start, click the **Reset Defaults** button in the window footer to safely clear out your persistent configuration files.

## 👤 Author

*   **Original Creator** - [Noli A. Navarro ](https://github.com/xnolz881-tech)

*Feel free to reach out, open an issue, or submit a pull request if you want to collaborate on expanding this utility!*

## 📄 License & Attribution

This project is open-source and available under the MIT License - feel free to use, modify, and distribute it for personal or commercial automation tasks.

⚠️ **Attribution Note:** If you fork, distribute, or modify this script, please retain a credit mention to the original author: **[[Noli A. Navarro ](https://github.com/xnolz881-tech)]**.
