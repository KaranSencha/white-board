"use strict";
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
const backgroundButton = document.getElementById("backgroundSelect");

// sideBar icons
const penColor = document.getElementById("colorSelect");
const penSize = document.getElementById("penSizeSelect");
const penCloseButton = document.getElementById("penClose");
const penSideBar = document.getElementById("penSideBar");
const shapeSideBar = document.getElementById("shapeSideBar");
const backgroundSideBar = document.getElementById("backgroundSideBar");

// zoom icons
const zoomInButton = document.getElementById("zoomInSelect");
const zoomOutButton = document.getElementById("zoomOutSelect");
const zoomDefaultButton = document.getElementById("zoomDefaultSelect");

// canvas
const canvas = document.getElementById("canvasSelect");
const ctx = canvas.getContext("2d");
ctx.lineJoin = "round";
ctx.lineCap = "round";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

  const textBoxes = document.querySelectorAll(".text-box");
  textBoxes.forEach((textBox) => {
  canvas.parentElement.removeChild(textBox);
  });
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
  console.log("Zoom In");
}

// Zoom out Function
function zoomOut() {
  console.log("Zoom Out");
}

// Zoom default function
function zoomDefault() {
  console.log("Zoom Default");
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
// textButton.addEventListener("click", stopDrawing);
shapeButton.addEventListener("click", stopDrawing);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
erasorButton.addEventListener("click", toggleEraser);
saveButton.addEventListener("click", saveAll);
deleteAllButton.addEventListener("click", clearAll);
penColor.addEventListener("input", updateColor);
penSize.addEventListener("input", updatePenSize);

// zoom icon FIX
zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);
zoomDefaultButton.addEventListener("click", zoomDefault);

// Side Bar   SECTION
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

// Shape Side Bar (open & close)
shapeButton.addEventListener("click", function () {
  shapeSideBar.classList.toggle("hidden");
});


//  document.querySelectorAll(".shape-icon").forEach((shapeicon) => {
//    shapeicon.addEventListener("click", (event) => {
//   event.stopPropagation();
//    });
//  });

// Background Side Bar (open & close)
backgroundButton.addEventListener("click", function () {
  backgroundSideBar.classList.toggle("hidden");
});

// Change - background color
const bgColors = document.querySelectorAll(".bg-color"); // Changed the selector to target the individual color spans

bgColors.forEach((bgColor) => {
  bgColor.addEventListener("click", () => {
    const color = bgColor.style.backgroundColor;
    erasorColor = color;
    canvas.style.backgroundColor = color;
  });
});

// Change - background Grid
const gridIcons = document.querySelectorAll(".bg-grid");

gridIcons.forEach((gridIcon) => {
  gridIcon.addEventListener("click", () => {
    const selectedGridClass = gridIcon.getAttribute("data-grid-class");
    canvas.classList.remove(
      "grid-both",
      "grid-horizontal",
      "grid-dot"
    );
    canvas.classList.add(selectedGridClass);
  });
});



// text box 
let isTextMode = false;

textButton.addEventListener("click", () => {
  isTextMode = true;
  canvas.removeEventListener("mousedown", startDrawing);
  canvas.removeEventListener("mousemove", drawLine);
  stopDrawing();
  canvas.style.cursor = "text";
});

canvas.addEventListener("click", (e) => {
  if (isTextMode) {
    createTextBox(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    isTextMode = false;
  }
});

function createTextBox(x, y) {
  const textBox = document.createElement("div");
  textBox.className = "text-box";
  textBox.style.left = x + "px";
  textBox.style.top = y + "px";
  canvas.parentElement.appendChild(textBox);

  const input = document.createElement("textarea");
  input.className = "text-input";
  textBox.appendChild(input);

  input.focus();
}


// dragable code - old

 let isDragging = false;
 let activeTextBox = null;
 let initialX = 0;
 let initialY = 0;

 canvas.addEventListener("mousedown", (e) => {
   if (isTextMode) {
     const x = e.clientX - canvas.offsetLeft;
     const y = e.clientY - canvas.offsetTop;
     createTextBox(x, y);
     isTextMode = false;
   }
 });

 canvas.addEventListener("mousemove", (e) => {
   if (isDragging && activeTextBox) {
     const newX = e.clientX - initialX;
     const newY = e.clientY - initialY;

     activeTextBox.style.left = newX + "px";
     activeTextBox.style.top = newY + "px";

     initialX = e.clientX - newX;
     initialY = e.clientY - newY;
   }
 });

 canvas.addEventListener("mouseup", () => {
   isDragging = false;
   activeTextBox = null;
 });

 document.addEventListener("mousedown", (e) => {
   if (e.target.classList.contains("text-box")) {
     isDragging = true;
     activeTextBox = e.target;
     initialX = e.clientX - e.target.getBoundingClientRect().left;
     initialY = e.clientY - e.target.getBoundingClientRect().top;
   }
 });

 document.addEventListener("mouseup", () => {
   isDragging = false;
   activeTextBox = null;
 });