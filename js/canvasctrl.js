function CanvasControllerFactory({ id, target } = { id: 'automata', target: document.body }, width = 300, height = 300, columns = 50) {
    const { context, canvas } = setupCanvas(id, target, width, height);

    const grid = {
        width,
        height,
        columns,
        rows: height / (width / columns),
        pixel: {
            width: width / columns,
            color: 'black'
        }
    }

    // private
    function setupCanvas(id, target, width, height) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.id = id;
        target.appendChild(canvas);
        return {
            context: canvas.getContext('2d'),
            canvas
        }
    }

    // private
    function clearCanvas() {
        context.clearRect(
            0,
            0,
            grid.width,
            grid.height
        );
    }

    // private
    function copyCanvas() {
        //context.fillStyle = context.createPattern(canvas, 'no-repeat');
        return context.getImageData(0, 0, grid.width, grid.height - grid.pixel.width);
    }

    // private
    function printCopy(imageData) {
        // context.translate(0, -grid.pixel.width);
        // context.fillRect(0, grid.pixel.width, grid.width, grid.height);
        context.putImageData(imageData, 0, grid.pixel.width)
    }

    function drawPixel(x, y, pixelWidth = 1) {
        context.fillStyle = grid.pixel.color;
        context.fillRect(
            x * grid.pixel.width,
            y * grid.pixel.width,
            pixelWidth * grid.pixel.width,
            grid.pixel.width
        );
    }

    function drawRow(array, y = 0) {
        let pixelWidth = 1;
        let nextPixel;
        for (let index = 0; index < array.length; ++index) {
            const pixel = array[index];
            if (pixel === 1) {
                nextPixel = array[index + 1];
                if (pixel === nextPixel) {
                    ++pixelWidth;
                } else {
                    drawPixel(index - (pixelWidth - 1), y, pixelWidth);
                    pixelWidth = 1;
                }
            }
        }
    }


    // function drawRow(array, y = 0) {

    //     array.reduce((acc, pixel, index) => {
    //         let { pixelWidth, _array: [
    //             /* dont need pixel */,
    //             nextPixel,
    //             ...rest]
    //         } = acc;
    //         if (pixel === 1) {
    //             if (pixel === nextPixel) {
    //                 ++pixelWidth;
    //             } else {
    //                 drawPixel(index - (pixelWidth - 1), y, pixelWidth);
    //                 pixelWidth = 1;
    //             }
    //         }
    //         return { pixelWidth, _array: [nextPixel, ...rest] };
    //     }, { pixelWidth: 0, _array: array });

    // }

    function clearRow(y) {
        context.fillStyle = grid.pixel.color;
        context.clearRect(
            0,
            y * grid.pixel.width,
            grid.pixel.width * grid.columns,
            grid.pixel.width
        );
    }

    function shiftRows() {
        context.save();
        const prevFrameMinusLastRow = copyCanvas();
        clearCanvas();
        printCopy(prevFrameMinusLastRow);
        context.restore();
    }

    return Object.freeze({
        shiftRows,
        clearRow,
        drawRow,
        drawPixel,
        grid,
        canvas,
        context
    });
}



// function drawRow(array, y = 0) {

//     array.reduce((acc, pixel, index) => {
//         let { pixelWidth, _array: [
//                 /* dont need pixel */,
//             nextPixel,
//             ...rest]
//         } = acc;
//         if (pixel === 1) {
//             if (pixel === nextPixel) {
//                 ++pixelWidth;
//             } else {
//                 drawPixel(index - (pixelWidth - 1), y, pixelWidth);
//                 pixelWidth = 1;
//             }
//         }
//         return { pixelWidth, _array: [nextPixel, ...rest] };
//     }, { pixelWidth: 0, _array: array });

// }

    // function drawRow(y, array) {
    //     let pixelWidth = 1;
    //     let nextPixel;
    //     for (let index = 0; index < array.length; ++index) {
    //         const pixel = array[index];
    //         if (pixel === 1) {
    //             nextPixel = array[index + 1];
    //             if (pixel === nextPixel) {
    //                 ++pixelWidth;
    //             } else {
    //                 drawPixel(index - (pixelWidth - 1), y, pixelWidth);
    //                 pixelWidth = 1;
    //             }
    //         }
    //     }
    // }

    // function drawRow(y, array) {
    //     array.forEach((pixel, index) => {
    //         if (pixel === 1) {
    //             drawPixel(index, y);
    //         }
    //     })
    // }

    // function drawRow(y, array) {
    //     for (let index = 0; index < array.length; ++index) {
    //         const pixel = array[index];
    //         if (pixel === 1) {
    //             drawPixel(index, y);
    //         }
    //     }
    // }


