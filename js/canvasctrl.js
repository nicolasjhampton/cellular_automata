function CanvasControllerFactory(width = 300, height = 300, columns = 50) {

    const grid = {
        width,
        height,
        columns,
        rows: height / (width / columns),
        pixel: {
            width: width / columns,
            color: 'black'
        },
        context: setupVirtualCanvas(width, height)
    }

    // public
    function drawRow(array, y = 0) {
        const endOfArray = { coord: [undefined] };
        let pixelWidth = 1;
        array.sort(sortPixels);
        for (let index = 0; index < array.length; ++index) {
            const { coord: [pixel] } = array[index];
            const { coord: [nextPixel] } = array.length - 1 === index ? endOfArray : array[index + 1];
            if (pixel + 1 === nextPixel) {
                ++pixelWidth;
            } else {
                drawPixel(pixel - (pixelWidth - 1), y, pixelWidth);
                pixelWidth = 1;
            }
        }
        return copyCanvas();
    }

    // Public
    function shiftRows() {
        grid.context.save();
        const prevFrameMinusLastRow = copyCanvas({ minusColumns: 0, minusRows: 1 });
        clearCanvas();
        printCopy(prevFrameMinusLastRow);
        grid.context.restore();
    }

    // private
    function setupVirtualCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        return canvas.getContext('2d', { alpha: false });
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

    // private
    function drawPixel(x, y, pixelWidth = 1) {
        grid.context.fillStyle = grid.pixel.color;
        grid.context.fillRect(
            x * grid.pixel.width,
            y * grid.pixel.width,
            pixelWidth * grid.pixel.width,
            grid.pixel.width
        );
    }

    // private
    function sortPixels(a, b) {
        if (a.coord[0] < b.coord[0]) {
            return -1;
        } else if (a.coord[0] > b.coord[0]) {
            return 1;
        }
        return 0;
    }

    // private
    function clearRow(y) {
        grid.context.fillStyle = grid.pixel.color;
        grid.context.clearRect(
            0,
            y * grid.pixel.width,
            grid.pixel.width * grid.columns,
            grid.pixel.width
        );
    }

    return Object.freeze({
        shiftRows,
        drawRow,
        grid,
    });
}


// function drawRow(array, y = 0) {
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


