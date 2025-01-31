let imageSrc = null;

// Handle image upload
document.getElementById("image-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc = e.target.result;
      showImagePreview(imageSrc);
    };
    reader.readAsDataURL(file);
  }
});

// Handle image paste
document.getElementById("image-paste").addEventListener("paste", (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (const item of items) {
    if (item.type.indexOf("image") !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (e) => {
        imageSrc = e.target.result;
        showImagePreview(imageSrc);
      };
      reader.readAsDataURL(blob);
      break;
    }
  }
});

// Show image preview
function showImagePreview(imageSrc) {
  const previewImage = document.getElementById("preview-image");
  previewImage.src = imageSrc;
  previewImage.style.display = "block";
}

// Handle Generate button click
document.getElementById("generate-button").addEventListener("click", () => {
  if (imageSrc) {
    processImage(imageSrc);
  } else {
    alert("Please upload or paste an image first.");
  }
});

// Handle Clear button click
document.getElementById("clear-button").addEventListener("click", () => {
  resetUI();
});

// Reset the UI
function resetUI() {
  imageSrc = null;
  document.getElementById("image-upload").value = "";
  document.getElementById("image-paste").value = "";
  document.getElementById("preview-image").style.display = "none";
  document.getElementById("preview-image").src = "#";
  document.getElementById("color-box").style.display = "none";
  document.getElementById("color-value").value = "";
}

// Process the image and extract colors
function processImage(imageSrc) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get pixel data
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Analyze colors
    const colors = extractColors(pixelData);

    // Detect gradient direction
    const gradientAngle = detectGradientDirection(pixelData, canvas.width, canvas.height);

    // Generate CSS gradient or solid color
    const cssColor = generateCSSColor(colors, gradientAngle);
    displayColor(cssColor);
  };
}

// Extract colors from pixel data
function extractColors(pixelData) {
  const colorMap = new Map();
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const color = `rgb(${r}, ${g}, ${b})`;
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }

  // Sort colors by frequency
  const sortedColors = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);

  // Return top 5 colors
  return sortedColors.slice(0, 5).map((entry) => entry[0]);
}

// Detect gradient direction
function detectGradientDirection(pixelData, width, height) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = pixelData[index];
      const g = pixelData[index + 1];
      const b = pixelData[index + 2];
      const brightness = (r + g + b) / 3; // Calculate brightness

      sumX += x * brightness;
      sumY += y * brightness;
      count += brightness;
    }
  }

  // Calculate the gradient angle
  const centerX = sumX / count;
  const centerY = sumY / count;
  const angle = Math.atan2(centerY - height / 2, centerX - width / 2) * (180 / Math.PI);

  return angle;
}

// Generate CSS color or gradient
function generateCSSColor(colors, angle) {
  if (colors.length === 1) {
    return colors[0]; // Single color
  } else {
    // Generate a linear gradient with the detected angle
    return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
  }
}

// Display the color and enable copying
function displayColor(cssColor) {
  const colorBox = document.getElementById("color-box");
  const colorValue = document.getElementById("color-value");
  const copyButton = document.getElementById("copy-button");

  colorValue.value = cssColor;
  colorBox.style.display = "block";

  // Copy color to clipboard
  copyButton.addEventListener("click", () => {
    colorValue.select();
    document.execCommand("copy");
    alert("Color copied to clipboard!");
  });
}