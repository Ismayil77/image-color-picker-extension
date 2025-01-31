# Image Color Picker Extension

A browser extension that analyzes uploaded/pasted images to extract **dominant colors** or **CSS gradients** using pixel data processing. Ideal for developers and designers needing quick color extraction for CSS workflows.

---

## Features

### 1. Image Input Options
- **File Upload**: Supports `PNG`, `JPEG`, and other image formats via `<input type="file">`.
- **Clipboard Paste**: Direct image pasting into a `<textarea>` using the Clipboard API.

### 2. Color Extraction
- **Dominant Color Detection**:  
  Uses frequency analysis of RGB pixel data to identify the most prevalent color.
- **CSS Gradient Generation**:  
  Detects multiple dominant colors and generates a `linear-gradient()` with dynamic angle calculation.

### 3. Output Formats
- **Solid Colors**: Returns `rgb(r, g, b)` or `#hex` values.
- **Gradients**: Generates `linear-gradient(angle, color1, color2, ...)` syntax.

### 4. Clipboard Integration
- One-click copy functionality using `document.execCommand("copy")`.

---

## Installation

### Prerequisites
- Modern browser with **Manifest V3** support (Chrome 88+, Edge 88+).

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ismayil77/image-color-picker-extension.git
