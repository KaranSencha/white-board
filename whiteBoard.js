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
const penSizeButton = document.getElementById("penSizeSelect");
const closeButton = document.querySelectorAll(".closeIconSelect");
const penSideBar = document.getElementById("bothElement");
const penCloseButton = document.getElementById("penCloseSelect");
const shapeSideBar = document.getElementById("shapeSideBarSelect");

// zoom icons
const zoomInButton = document.getElementById("zoomInSelect");
const zoomOutButton = document.getElementById("zoomOutSelect");

// canvas
const canvas = document.getElementById("canvasSelect");
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
ctx.lineCap = "round";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 28;

// let Variable
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let currentColor = "#e1e1e1";
let lineWidth = 5;
let erasorSize = 20;
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

  ctx.strokeStyle = isErasing ? erasorColor : currentColor;
  ctx.lineWidth = isErasing ? erasorSize : lineWidth;

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
    ctx.lineWidth = erasorSize;
  } else {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
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

// updatePenSize - function
function updatePenSize(e) {
  lineWidth = e.target.value;
  document.getElementById("penSizeRange").textContent = lineWidth;
}

// delete all - function
function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
  redoStack = [];
  actionStack = [];
}

// smooth line function
function drawSmoothLine(points) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 2; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

// drawline - function
function drawLine(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  points.push({ x, y });

  // call - smoothline function
  drawSmoothLine(points);

  // undo & redo
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];

  [lastX, lastY] = [x, y];
}

// ZoomIn function
function zoomIn() {
  alert("Zoom In");
}

// Zoom out Function
function zoomOut() {
  alert("Zoom Out");
}

// SECTION  - addEventListener
//  cursor
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", function () {
  stopDrawing();
  points = [];
});

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
penSizeButton.addEventListener("input", updatePenSize);

// zoom icon FIX 
// zoomInButton.addEventListener("click", zoomIn);
// zoomOutButton.addEventListener("click", zoomOut);

// close pen side bar
penCloseButton.addEventListener("click", function () {
  penSideBar.classList.toggle("hidden");
});

// stop to to parent when child is clicked
penSideBar.addEventListener("click", function (event) {
  event.stopPropagation();
});
penButton.addEventListener("click", function () {
  penSideBar.classList.toggle("hidden");
});

// close shape side bar
shapeButton.addEventListener("click", function () {
  shapeSideBar.classList.toggle("hidden");
});



// background color change
 const bgColors = document.querySelectorAll(".bg-color");

 bgColors.forEach((bgColor) => {
   bgColor.addEventListener("click", () => {
     const iElement = bgColor.querySelector("i");
     const color = iElement.style.color;
     canvas.style.backgroundColor = color;
   });
 });


 // grid view change
 
 const grids= ["grid", "grid-line-v", "grid-line-h"]; 
 let gridIndex = 0;
 
 const bgGrids = document.querySelectorAll(".bg-grid");

     bgGrids.forEach((span) => {
       span.addEventListener("click", () => {
         const selectedGrid = grids[gridIndex % grids.length];
         gridIndex++;
         canvas.classList.toggle(selectedGrid);
       });
     });