document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const exponentRInput = document.getElementById('exponentr');
    const exponentIInput = document.getElementById('exponenti');
    const maxIterationsInput = document.getElementById('maxIterations');
    const zRealInput = document.getElementById('zReal');
    const zImagInput = document.getElementById('zImag');
    const zoomInput = document.getElementById('zoom');
    const exponentRNumber = document.getElementById('exponentRNumber');
    const exponentINumber = document.getElementById('exponentINumber');
    const maxIterationsNumber = document.getElementById('maxIterationsNumber');
    const zRealNumber = document.getElementById('zRealNumber');
    const zImagNumber = document.getElementById('zImagNumber');
    const zoomNumber = document.getElementById('zoomNumber');

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
        exponentRNumber.value = parseFloat(exponentRInput.value).toFixed(1);
        exponentINumber.value = parseFloat(exponentIInput.value).toFixed(1);
        maxIterationsNumber.value = maxIterationsInput.value;
        zRealNumber.value = parseFloat(zRealInput.value).toFixed(2);
        zImagNumber.value = parseFloat(zImagInput.value).toFixed(2);
        zoomNumber.value = parseFloat(zoomInput.value).toFixed(1);
        redSliderNumber.value = parseFloat(redSlider.value).toFixed(1);
        greenSliderNumber.value = parseFloat(greenSlider.value).toFixed(1);
        blueSliderNumber.value = parseFloat(blueSlider.value).toFixed(1);
    }

    function syncSliders() {
        exponentRInput.value = exponentRNumber.value;
        exponentIInput.value = exponentINumber.value;
        maxIterationsInput.value = maxIterationsNumber.value;
        zRealInput.value = zRealNumber.value;
        zImagInput.value = zImagNumber.value;
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
        const exponentr = parseFloat(exponentRInput.value);
        const exponenti = parseFloat(exponentIInput.value);
        const zReal = parseFloat(zRealInput.value);
        const zImag = parseFloat(zImagInput.value);
        const zoom = parseFloat(zoomInput.value);
        const redIntensity = parseFloat(redSlider.value);
        const greenIntensity = parseFloat(greenSlider.value);
        const blueIntensity = parseFloat(blueSlider.value);

        const worker = new Worker('worker.js');
        worker.postMessage({
            width,
            height,
            maxIterations,
            exponentr,
            exponenti,
            zReal,
            zImag,
            zoom,
            panX,
            panY,
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


    // Initial synchronization of inputs
    syncInputs();
    startRender();
});
