const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 150;

let painting = false;
let currentColor = document.getElementById('color').value;
let currentOpacity = document.getElementById('opacity').value;

let undoStack = [];
let redoStack = [];

const saveState = () => {
    undoStack.push(canvas.toDataURL());
    redoStack = [];  // Clear redo stack on new action
};

const restoreState = (stack) => {
    if (stack.length) {
        const state = stack.pop();
        const img = new Image();
        img.src = state;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
};

const startPosition = (e) => {
    painting = true;
    saveState();
    draw(e);
};

const endPosition = () => {
    painting = false;
    ctx.beginPath();
};

const draw = (e) => {
    if (!painting) return;
    ctx.lineWidth = document.getElementById('width').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.globalAlpha = currentOpacity;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};

const addColorToPalette = () => {
    const color = document.getElementById('color').value;
    const colorPalette = document.getElementById('colorPalette');
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = color;
    colorSwatch.addEventListener('click', () => {
        currentColor = color;
    });
    colorPalette.appendChild(colorSwatch);
};

const clearCanvas = () => {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const undo = () => {
    if (undoStack.length) {
        redoStack.push(canvas.toDataURL());
        restoreState(undoStack);
    }
};

const redo = () => {
    if (redoStack.length) {
        undoStack.push(canvas.toDataURL());
        restoreState(redoStack);
    }
};

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

document.getElementById('color').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

document.getElementById('opacity').addEventListener('input', (e) => {
    currentOpacity = e.target.value;
});

document.getElementById('addColor').addEventListener('click', addColorToPalette);
document.getElementById('clear').addEventListener('click', clearCanvas);
document.getElementById('previous').addEventListener('click', undo);
document.getElementById('next').addEventListener('click', redo);
