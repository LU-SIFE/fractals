onmessage = function(event) {
    const { width, height, maxIterations, exponent, cReal, cImag, zoom, panX, panY, selectedSet, redIntensity, greenIntensity, blueIntensity } = event.data;

    const imageData = new Uint8ClampedArray(width * height * 4);

    // Mandelbrot Set Function (with Exponent)
    function mandelbrot(re, im, maxIterations, exponent) {
        let cRe = re, cIm = im;
        let zRe = 0, zIm = 0;
        let iteration = 0;

        while (zRe * zRe + zIm * zIm <= 4 && iteration < maxIterations) {
            const zRe2 = Math.pow(zRe, exponent) - Math.pow(zIm, exponent);
            const zIm2 = 2 * Math.pow(zRe, exponent - 1) * zIm;
            zRe = zRe2 + cRe;
            zIm = zIm2 + cIm;
            iteration++;
        }
        return iteration;
    }

    // Julia Set Function
    function julia(re, im, cRe, cIm, maxIterations) {
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

    // Newtonian Fractal Function
function newton(re, im, maxIterations) {
    let zRe = re, zIm = im;
    for (let i = 0; i < maxIterations; i++) {
        // f(z) = z^3 - 1
        const fRe = zRe * zRe * zRe - 1 + 0 * zIm;  // Real part of f(z)
        const fIm = 3 * zRe * zRe * zIm;  // Imaginary part of f(z)
        
        // f'(z) = 3z^2
        const fPrimeRe = 3 * (zRe * zRe - zIm * zIm);  // Real part of f'(z)
        const fPrimeIm = 6 * zRe * zIm;  // Imaginary part of f'(z)

        // Newton-Raphson update step: z_{n+1} = z_n - f(z_n) / f'(z_n)
        const denominator = fPrimeRe * fPrimeRe + fPrimeIm * fPrimeIm;  // |f'(z)|^2
        const newRe = zRe - (fRe * fPrimeRe + fIm * fPrimeIm) / denominator;
        const newIm = zIm - (fIm * fPrimeRe - fRe * fPrimeIm) / denominator;

        zRe = newRe;
        zIm = newIm;

        // Escape condition: If the point doesn't converge, break the loop
        if (zRe * zRe + zIm * zIm > 4) return i;
    }
    return maxIterations;  // Return maxIterations if the point converges
}

// Nova Fractal Function
function nova(re, im, maxIterations) {
    let zRe = re, zIm = im;
    for (let i = 0; i < maxIterations; i++) {
        // f(z) = z^4 - 1
        const fRe = zRe * zRe * zRe * zRe - 1 + 0 * zIm;  // Real part of f(z)
        const fIm = 4 * zRe * zRe * zRe * zIm;  // Imaginary part of f(z)
        
        // f'(z) = 4z^3
        const fPrimeRe = 4 * (zRe * zRe * zRe - zIm * zIm * zIm);  // Real part of f'(z)
        const fPrimeIm = 12 * zRe * zRe * zIm;  // Imaginary part of f'(z)

        // Newton-Raphson update step: z_{n+1} = z_n - f(z_n) / f'(z_n)
        const denominator = fPrimeRe * fPrimeRe + fPrimeIm * fPrimeIm;  // |f'(z)|^2
        const newRe = zRe - (fRe * fPrimeRe + fIm * fPrimeIm) / denominator;
        const newIm = zIm - (fIm * fPrimeRe - fRe * fPrimeIm) / denominator;

        zRe = newRe;
        zIm = newIm;

        // Escape condition: If the point doesn't converge, break the loop
        if (zRe * zRe + zIm * zIm > 4) return i;
    }
    return maxIterations;  // Return maxIterations if the point converges
}



    const scale = 1 / zoom;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const re = ((x - panX) / width) * 4 * scale - 2 * scale;
            const im = ((y - panY) / height) * 4 * scale - 2 * scale;

            let iterations;
            if (selectedSet === "julia") {
                iterations = julia(re, im, cReal, cImag, maxIterations);
            } else if (selectedSet === 'mandelbrot') {
                iterations = mandelbrot(re, im, maxIterations, exponent);
            } else if (selectedSet === 'newtonian') {
                iterations = newton(re, im, maxIterations);
            } else if (selectedSet === 'nova') {
                iterations = nova(re, im, maxIterations);
            }

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
