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

    const workerCount = navigator.hardwareConcurrency || 4;  // Use number of CPU cores or fallback to 4
    const workers = [];
    let renderTimeout;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Sync input values with numbers for user interface
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

    // Throttled render start function to optimize performance
    let lastRenderTime = 0;
    const throttleDelay = 70; // ms
    function startRenderThrottled() {
        const now = Date.now();
        if (now - lastRenderTime > throttleDelay) {
            startRender();
            lastRenderTime = now;
        }
    }

    function initializeWorkers() {
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker('worker.js');
            worker.onmessage = handleWorkerMessage;
            workers.push(worker);
        }
    }

    function handleWorkerMessage(event) {
        const { imageData, startY, chunkHeight } = event.data;
        
        // Ensure the imageData array is the correct length
        const expectedSize = canvas.width * chunkHeight * 4;  // Expected size for the chunk
        if (imageData.length !== expectedSize) {
            console.error('Invalid imageData size:', imageData.length, 'Expected size:', expectedSize);
            return;
        }
    
        // Now, create and render the ImageData
        try {
            const imgData = new ImageData(imageData, canvas.width, chunkHeight);
            ctx.putImageData(imgData, 0, startY);  // Place the chunk on the canvas at the correct startY
        } catch (error) {
            console.error('Error creating ImageData:', error);
        }
    }

    // Start the rendering process
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

        const chunkHeight = Math.ceil(height / workerCount);
        let completedWorkers = 0;

        // Adjust resolution dynamically based on zoom level
        const scale = 1 / zoom;
        const adaptiveResolution = Math.max(1, Math.floor(width * scale));

        let idx = 0;
        workers.forEach((worker, i) => {
            const startY = i * chunkHeight;
            const endY = Math.min(startY + chunkHeight, height);

            worker.postMessage({
                width,
                height,
                startY,
                endY,
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
                blueIntensity,
                adaptiveResolution,
                set,
                invert
            });
        });
    }

    let set = "mandelbrot";
    let invert = false;
    function swap(type) {
        if (type == 1) {
            if (invert == true) {
                invert = false;
            } else {
                invert = true;
            }
        }
        else if (type == 2) {
            if (set == 'mandelbrot') {
                set = 'burning'
            } else {
                set = 'mandelbrot'
            }
        }
        startRenderThrottled();  // Re-render after swapping
    }

    // Bind the swap function to the button
    const swapButton = document.getElementById('swap');
    swapButton.addEventListener('click', function() {swap(1)});

    const swapButton2 = document.getElementById('swap2');
    swapButton2.addEventListener('click', function() {swap(2)});

    let collapsed = false;
    const collapse = document.getElementById('collapse');
    collapse.addEventListener('click', function() {
        if (collapsed == false) {
            collapsed = true;
            collapse.innerHTML = '>';
            document.getElementById('controls').style.transform = 'translateX(-120%)';
        } else {
            collapsed = false;
            collapse.innerHTML = '<';
            document.getElementById('controls').style.transform = 'translateX(0)';
        }
    })

    // Handle input range and number synchronization
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', () => {
            syncInputs();
            startRenderThrottled();  // Throttled render
        });
    });

    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            syncSliders();
            startRenderThrottled();  // Throttled render
        });
    });

    // Scroll wheel zoom handling
    let lastZoom = 0;
    canvas.addEventListener('wheel', function(event) {
        event.preventDefault();
        let zoomDelta = event.deltaY < 0 ? 0.1 : -0.1;
        let newZoom = parseFloat(zoomInput.value) + zoomDelta;

        newZoom = Math.min(Math.max(newZoom, 0.1), 10);
        if (Math.abs(newZoom - lastZoom) > 0.1) {
            zoomInput.value = newZoom.toFixed(1);
            syncInputs();
            startRenderThrottled();
            lastZoom = newZoom;
        }
    });

    // Initialize workers once on load
    initializeWorkers();

    // Initial sync and render
    syncInputs();
    startRender();
});
