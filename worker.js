onmessage = function(event) {
    const { width, height, maxIterations, exponentr, exponenti, zReal, zImag, zoom, panX, panY, redIntensity, greenIntensity, blueIntensity } = event.data;

    const imageData = new Uint8ClampedArray(width * height * 4);

    // General Mandelbrot function with any exponent
    function mandelbrot(re, im, maxIterations, xr, xi, zRe, zIm) {
        let iteration = 0;


        while (zRe * zRe + zIm * zIm <= 4 && iteration < maxIterations) {

            let r = Math.sqrt(zRe * zRe + zIm * zIm);
            let theta = Math.atan2(zIm, zRe);


            // Add C to z_n^exponent
            zRe = Math.pow(r, xr) * Math.cos(xr * theta) + re;
            zIm = Math.pow(r, xi) * Math.sin(xi * theta) + im;

            iteration++;
        }

        return iteration;
    }

    const scale = 1 / zoom;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const re = ((x - panX) / width) * 5 * scale - 3 * scale;
            const im = ((y - panY) / height) * 4 * scale - 2 * scale;

            let iterations = mandelbrot(re, im, maxIterations, exponentr, exponenti, zReal, zImag);

            const colorValue = iterations === maxIterations ? 0 : (255 * iterations / maxIterations);

            const index = (x + y * width) * 4;
            imageData[index] = colorValue / redIntensity;     // Red component
            imageData[index + 1] = colorValue / greenIntensity; // Green component
            imageData[index + 2] = colorValue / blueIntensity;  // Blue component
            imageData[index + 3] = 255;       // Alpha component
        }
    }

    postMessage(imageData);
};
