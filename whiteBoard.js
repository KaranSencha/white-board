// Constant Variable
// menu icons
const cursorButton = document.getElementById("cursorSelect");
const penButton = document.getElementById("penSelect");
const textButton = document.getElementById("textSelect");
const shapeButton = document.getElementById("shapeSelect");
const undoButton = document.getElementById("undoSelect");
const redoButton = document.getElementById("redoSelect");
const erasorButton = document.getElementById("erasorSelect");
const saveButton = document.getElementById("saveSelect");
const deleteAllButton = document.getElementById("deleteSelect");
const colorButton = document.getElementById("colorSelect");

// zoom icons
const zoomInButton = document.getElementById("zoomInSelect");
const zoomOutButton = document.getElementById("zoomOutSelect");

// canvas
const canvas = document.getElementById("canvasSelect");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 5;

// let Variable
let lineWidth = 5;
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let currentColor = "#e1e1e1";
let eraserSize = 10;
let erasorColor = "#212529";
let undoStack = [];
let redoStack = [];
let actionStack = [];
let points = [];

// SECTION  - Functions
// Stop Drawing Function
function stopDrawing() {
  isDrawing = false;
  canvas.style.cursor = "default";
}

// Start Drawing Function
function startDrawing(e) {
  isDrawing = true;

  canvas.style.cursor = "crosshair";
  [lastX, lastY] = [
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
  ];
}

// undo Function
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(undoStack.pop(), 0, 0);
    actionStack.pop();
  }
}

// redo function
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(redoStack.pop(), 0, 0);
  }
}

// toggleErasor - function
function toggleEraser() {
  isErasing = !isErasing;
  if (isErasing) {
    ctx.strokeStyle = erasorColor;
    ctx.lineWidth = eraserSize;
    canvas.style.cursor = "grab";
  } else {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 5;
    canvas.style.cursor = "crosshair";
  }
}

// saveAll - Function
function saveAll() {
  return alert("All Saved");
}

// updateColor - function
function updateColor(e) {
  currentColor = e.target.value;
}

// delete all - function
function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
  actionStack = [];
}

// draw line - function
function drawLine(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  points.push({ x, y }); // Store the current point

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = isErasing ? erasorColor : currentColor;
    ctx.lineWidth = isErasing ? eraserSize : ctx.lineWidth;
    ctx.stroke();
  }
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];
}

function drawLine(e) {
  if (!isDrawing) return;
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = isErasing ? erasorColor : currentColor;
  ctx.lineWidth = isErasing ? eraserSize : ctx.lineWidth;
  ctx.stroke();

  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];

  [lastX, lastY] = [x, y];
}

// ZoomIn function
function zoomIn() {
  canvas.style.transformOrigin = "0 0"; // Set the origin of scaling
  canvas.style.transform = `scale(1.1)`; // Increase the scale (zoom in)
}

// Zoom out Function
function zoomOut() {
  canvas.style.transformOrigin = "0 0"; // Set the origin of scaling
  canvas.style.transform = `scale(0.9)`; // Decrease the scale (zoom out)
}

// SECTION  - addEventListener
//  cursor
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", stopDrawing);

// menu icons
cursorButton.addEventListener("click", () => {
  canvas.removeEventListener("mousedown", startDrawing);
  canvas.removeEventListener("mousemove", drawLine);
  stopDrawing();
});
penButton.addEventListener("click", () => {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", drawLine);
});
textButton.addEventListener("click", stopDrawing);
shapeButton.addEventListener("click", stopDrawing);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
erasorButton.addEventListener("click", toggleEraser);
saveButton.addEventListener("click", saveAll);
deleteAllButton.addEventListener("click", clearAll);
colorButton.addEventListener("input", updateColor);

// zoom icon
zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);
