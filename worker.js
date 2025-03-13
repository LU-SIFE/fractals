onmessage = function(event) {
    const { width, height, startY, endY, maxIterations, exponentr, exponenti, zReal, zImag, zoom, panX, panY, redIntensity, greenIntensity, blueIntensity, set, invert } = event.data;

    const chunkHeight = endY - startY;
    const imageData = new Uint8ClampedArray(chunkHeight * width * 4);  // Ensure this matches the chunk size

    function mandelbrot(re, im, maxIterations, xr, xi, zRe, zIm) {
        let rSquared = zRe * zRe + zIm * zIm;
        let iteration = 0;
        while (rSquared <= 4 && iteration < maxIterations) {
            let r = Math.sqrt(rSquared);
            let theta = Math.atan2(zIm, zRe);
            zRe = Math.pow(r, xr) * Math.cos(xr * theta) + re;
            zIm = Math.pow(r, xi) * Math.sin(xi * theta) + im;
            rSquared = zRe * zRe + zIm * zIm;
            iteration++;
        }
        return iteration;
    }

    function burning(re, im, maxIterations, xr, xi, zRe, zIm) {
        let rSquared = zRe * zRe + zIm * zIm;
        let iteration = 0;
        while (rSquared <= 4 && iteration < maxIterations) {
            let r = Math.sqrt(rSquared);
            let theta = Math.atan2(zIm, zRe);
            zRe = Math.abs(Math.pow(r, xr) * Math.cos(xr * theta) + re);
            zIm = Math.abs(Math.pow(r, xi) * Math.sin(xi * theta) + im);
            rSquared = zRe * zRe + zIm * zIm;
            iteration++;
        }
        return iteration;
    }
    
    

    let idx = 0;
    for (let y = startY; y < endY; y++) {
        for (let x = 0; x < width; x++) {
            const re = ((x - panX) / width) * 5 / zoom - 2.5 / zoom;
            const im = ((y - panY) / height) * 4 / zoom - 2 / zoom;
            let iterations;

            if (set == 'mandelbrot') {
                if (invert == true) {
                    iterations = mandelbrot(zReal, zImag, maxIterations, exponentr, exponenti, re, im);
                } else {
                    iterations = mandelbrot(re, im, maxIterations, exponentr, exponenti, zReal, zImag);
                }

            } else if (set == 'burning') {
                if (invert == true) {
                    iterations = burning(zReal, zImag, maxIterations, exponentr, exponenti, re, im);
                } else {
                    iterations = burning(re, im, maxIterations, exponentr, exponenti, zReal, zImag);
                }
            }

            const colorValue = iterations === maxIterations ? 0 : (255 * iterations / maxIterations);
            const index = idx * 4;

            imageData[index] = colorValue / redIntensity;
            imageData[index + 1] = colorValue / greenIntensity;
            imageData[index + 2] = colorValue / blueIntensity;
            imageData[index + 3] = 255;  // Alpha component

            idx++;
        }
    }

    postMessage({ imageData, startY, chunkHeight });  // Send chunk data with startY and chunkHeight
};
