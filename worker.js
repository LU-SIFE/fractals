onmessage = function(event) {
    const { width, height, maxIterations, exponent, cReal, cImag, zoom, panX, panY } = event.data;

    const imageData = new Uint8ClampedArray(width * height * 4);

    function julia(re, im, cRe, cIm, maxIterations, exponent) {
        let zRe = re, zIm = im;
        for (let i = 0; i < maxIterations; i++) {
            const zRe2 = zRe * zRe - zIm * zIm;
            const zIm2 = 2 * zRe * zIm;
            zRe = zRe2 + cRe;
            zIm = zIm2 + cIm;
            if (zRe * zRe + zIm * zIm > 4) return i;
        }
        return maxIterations;
    }

    const scale = 1 / zoom;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const re = ((x - panX) / width) * 4 * scale - 2 * scale;
            const im = ((y - panY) / height) * 4 * scale - 2 * scale;
            const iterations = julia(re, im, cReal, cImag, maxIterations, exponent);

            const colorValue = iterations === maxIterations ? 0 : (255 * iterations / maxIterations);
            const index = (x + y * width) * 4;
            imageData[index] = colorValue;     // Red component (for purple)
            imageData[index + 1] = 0;          // Green component (for purple)
            imageData[index + 2] = colorValue; // Blue component (for purple)
            imageData[index + 3] = 255;        // Alpha component
        }
    }

    postMessage(imageData);
}
