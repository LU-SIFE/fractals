document.addEventListener('DOMContentLoaded', function() {
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
    const setSelect = document.getElementById('setSelect');  // Dropdown for selecting set type

    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const redSliderNumber = document.getElementById('redSliderNumber');
    const greenSliderNumber = document.getElementById('greenSliderNumber');
    const blueSliderNumber = document.getElementById('blueSliderNumber');

    let panX = 0;
    let panY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function syncInputs() {
        exponentNumber.value = parseFloat(exponentInput.value).toFixed(1);
        maxIterationsNumber.value = maxIterationsInput.value;
        cRealNumber.value = parseFloat(cRealInput.value).toFixed(2);
        cImagNumber.value = parseFloat(cImagInput.value).toFixed(2);
        zoomNumber.value = parseFloat(zoomInput.value).toFixed(1);
        redSliderNumber.value = parseFloat(redSlider.value).toFixed(1);
        greenSliderNumber.value = parseFloat(greenSlider.value).toFixed(1);
        blueSliderNumber.value = parseFloat(blueSlider.value).toFixed(1);
    }

    function syncSliders() {
        exponentInput.value = exponentNumber.value;
        maxIterationsInput.value = maxIterationsNumber.value;
        cRealInput.value = cRealNumber.value;
        cImagInput.value = cImagNumber.value;
        zoomInput.value = zoomNumber.value;
        redSlider.value = redSliderNumber.value;
        greenSlider.value = greenSliderNumber.value;
        blueSlider.value = blueSliderNumber.value;
    }

    // Start Render Function
    function startRender() {
        const width = canvas.width;
        const height = canvas.height;
        const maxIterations = parseInt(maxIterationsInput.value, 10);
        const exponent = parseFloat(exponentInput.value);  // Used for Mandelbrot
        const cReal = parseFloat(cRealInput.value);
        const cImag = parseFloat(cImagInput.value);
        const zoom = parseFloat(zoomInput.value);
        const selectedSet = setSelect.value;
        const redIntensity = parseFloat(redSlider.value);
        const greenIntensity = parseFloat(greenSlider.value);
        const blueIntensity = parseFloat(blueSlider.value);

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
            panY,
            selectedSet,
            redIntensity,
            greenIntensity,
            blueIntensity
        });

        worker.onmessage = function(event) {
            const imageData = event.data;
            ctx.putImageData(new ImageData(new Uint8ClampedArray(imageData), width, height), 0, 0);
        }
    }

    // Sync input ranges with numbers
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

    setSelect.addEventListener('change', () => {
        startRender();
    });

    // Initial synchronization of inputs
    syncInputs();
    startRender();
});
