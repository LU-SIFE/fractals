const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const exponentInput = document.getElementById('exponent');
const maxIterationsInput = document.getElementById('maxIterations');
const cRealInput = document.getElementById('cReal');
const cImagInput = document.getElementById('cImag');
const zoomInput = document.getElementById('zoom');
const exponentNumber = document.getElementById('exponentNumber');
const maxIterationsNumber = document.getElementById('maxIterationsNumber');
const cRealNumber = document.getElementById('cRealNumber');
const cImagNumber = document.getElementById('cImagNumber');
const zoomNumber = document.getElementById('zoomNumber');

let panX = 0;
let panY = 0;
let isPanning = false;
let startX, startY;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function syncInputs() {
    exponentNumber.value = parseFloat(exponentInput.value).toFixed(1); // Ensure decimal format
    maxIterationsNumber.value = maxIterationsInput.value;
    cRealNumber.value = parseFloat(cRealInput.value).toFixed(2); // Ensure decimal format
    cImagNumber.value = parseFloat(cImagInput.value).toFixed(2); // Ensure decimal format
    zoomNumber.value = parseFloat(zoomInput.value).toFixed(1); // Ensure decimal format
}

function syncSliders() {
    exponentInput.value = exponentNumber.value;
    maxIterationsInput.value = maxIterationsNumber.value;
    cRealInput.value = cRealNumber.value;
    cImagInput.value = cImagNumber.value;
    zoomInput.value = zoomNumber.value;
}

function startRender() {
    const width = canvas.width;
    const height = canvas.height;
    const maxIterations = parseInt(maxIterationsInput.value, 10);
    const exponent = parseFloat(exponentInput.value); // Use parseFloat to handle decimal values
    const cReal = parseFloat(cRealInput.value);
    const cImag = parseFloat(cImagInput.value);
    const zoom = parseFloat(zoomInput.value);

    const worker = new Worker('worker.js');
    worker.postMessage({
        width,
        height,
        maxIterations,
        exponent,
        cReal,
        cImag,
        zoom,
        panX,
        panY
    });

    worker.onmessage = function(event) {
        const imageData = event.data;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(imageData), width, height), 0, 0);
    }
}

// Add event listeners to update rendering and sync inputs when values change
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', () => {
        syncInputs();
        startRender();
    });
});

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
        syncSliders();
        startRender();
    });
});

// Initial synchronization of inputs
syncInputs();

// Add mouse panning functionality
canvas.addEventListener('mousedown', (event) => {
    isPanning = true;
    startX = event.clientX - panX;
    startY = event.clientY - panY;
});

canvas.addEventListener('mousemove', (event) => {
    if (isPanning) {
        panX = event.clientX - startX;
        panY = event.clientY - startY;
        startRender();
    }
});

canvas.addEventListener('mouseup', () => {
    isPanning = false;
});

canvas.addEventListener('mouseleave', () => {
    isPanning = false;
});
