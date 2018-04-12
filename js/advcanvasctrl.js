function AdvancedCanvasControllerFactory(width = 300, height = 300, columns = 50, firstYear) {
    
    const grid = {
        width,
        height,
        columns,
        rows: height / (width / columns),
        rowBitLength: width * 4,
        pixel: {
            width: width / columns,
            color: 'black'
        },
        image: new Uint8ClampedArray(new ArrayBuffer(width * height * 4))
    }

    const firstRow = drawScroll(firstYear);

    // wip public
    function drawScreen(array) {
        drawRow(array);
        return array;
    }

    // public
    function drawScroll(array) {
        shiftRows();
        clearRow();
        drawRow(array);
        return grid.image.slice();
    }

    // private
    function shiftRows() {
        grid.image.copyWithin(grid.pixel.width * grid.rowBitLength, 0);
    }

    // private
    function clearRow(y = 0) {
        grid.image.fill(
            0,
            y * grid.rowBitLength,
            y * grid.rowBitLength + grid.rowBitLength
        );
    }

    // private
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

    // private
    function drawPixel(x, y, pixelWidth = 1) {
        const onePixelThickLine = Uint8ClampedArray.from( 
            {length: pixelWidth * grid.pixel.width * 4}, 
            (x, i) => (i + 1) % 4 === 0 ? 255 : 0);

        const startingPositionOfPixelToBeDrawn = x * grid.pixel.width * 4 + y * grid.pixel.width * grid.rowBitLength;
        const endingPositionOfPixelToBeDrawn = startingPositionOfPixelToBeDrawn + onePixelThickLine.length;

        grid.image.set(onePixelThickLine, startingPositionOfPixelToBeDrawn);
        for(let i = y + 1; i < (grid.height / grid.rows); ++i) {
            grid.image.copyWithin(
                startingPositionOfPixelToBeDrawn + grid.rowBitLength * i,
                startingPositionOfPixelToBeDrawn,
                endingPositionOfPixelToBeDrawn
            )
        }
    }

    return Object.freeze({
        drawScreen,
        drawScroll,
        grid,
        firstRow
    });
}