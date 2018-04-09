function CanvasControllerFactory({ id, target } = { id: 'automata', target: document.body }, width = 300, height = 300, columns = 50) {

    const grid = {
        width,
        height,
        columns,
        rows: height / (width / columns),
        pixel: {
            width: width / columns,
            color: 'black'
        },
        context: setupCanvas(id, target, width, height)
    }

    function drawScroll(array) {
        shiftRows();
        drawRow(array);
        return array;
    }

    function generateSeedRow() {
        const firstRow = new Array(grid.columns).fill(0).map(() => Math.floor(Math.random() * 2));
        drawScroll(firstRow);
        return firstRow;
    }

    // private
    function setupCanvas(id, target, width, height) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.id = id;
        target.appendChild(canvas);
        return canvas.getContext('2d', { alpha: false })
    }

    // private
    function clearCanvas() {
        grid.context.clearRect(
            0,
            0,
            grid.width,
            grid.height
        );
    }

    // private
    function copyCanvas({ minusColumns, minusRows } = { minusColumns: 0, minusRows: 0 }) {
        return grid.context.getImageData(
            0, 
            0, 
            grid.width - grid.pixel.width * minusColumns, 
            grid.height - grid.pixel.width * minusRows
        );
    }

    // private
    function printCopy(imageData) {
        grid.context.putImageData(imageData, 0, grid.pixel.width)
    }

    function drawPixel(x, y, pixelWidth = 1) {
        grid.context.fillStyle = grid.pixel.color;
        grid.context.fillRect(
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

    function clearRow(y) {
        grid.context.fillStyle = grid.pixel.color;
        grid.context.clearRect(
            0,
            y * grid.pixel.width,
            grid.pixel.width * grid.columns,
            grid.pixel.width
        );
    }

    function shiftRows() {
        grid.context.save();
        const prevFrameMinusLastRow = copyCanvas({ minusColumns: 0, minusRows: 0 });
        clearCanvas();
        printCopy(prevFrameMinusLastRow);
        grid.context.restore();
    }

    return Object.freeze({
        shiftRows,
        clearRow,
        drawRow,
        drawPixel,
        drawScroll,
        generateSeedRow,
        grid
    });
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


