function CanvasControllerFactory(width = 300, height = 300, columns = 50, firstYear) {

    const grid = {
        width,
        height,
        columns,
        rows: height / (width / columns),
        pixel: {
            width: width / columns,
            color: 'black'
        },
        image: new Array(width * height * 4).fill(0, 0)
    }
    const firstRow = drawScroll(firstYear);

    // Public
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

    function drawPixel(x, y, pixelWidth = 1) {
        const onePixelThickLine = Array.from( 
            {length: pixelWidth * grid.pixel.width * 4}, 
            (x, i) => (i + 1) % 4 === 0 ? 255 : 0
        )
        const startingPositionOfPixelToBeDrawn = x * grid.pixel.width * 4 + y * grid.pixel.width * grid.pixel.width * 4 * grid.columns;
        const endingPositionOfPixelToBeDrawn = startingPositionOfPixelToBeDrawn + onePixelThickLine.length;
        const lengthOfRow = grid.columns * grid.pixel.width * 4;
        grid.image.splice(
            startingPositionOfPixelToBeDrawn, // start
            onePixelThickLine.length, // number of items we'll remove
            ...onePixelThickLine,
        );
        for(let i = y + 1; i < (grid.height / grid.rows); ++i) {
            grid.image.copyWithin(
                startingPositionOfPixelToBeDrawn + lengthOfRow * i,
                startingPositionOfPixelToBeDrawn, // start
                endingPositionOfPixelToBeDrawn // number of items we'll remove
            )
        }
    }

    // wip
    function drawScreen(array) {
        drawRow(array);
        return array;
    }

    // public
    function drawScroll(array) {
        shiftRows();
        clearRow();
        drawRow(array);
        return new ImageData(new Uint8ClampedArray(grid.image), width, height);
    }

    function clearRow(y = 0) {
        const oneRow = Array.from( 
            {length: grid.columns * grid.pixel.width * 4 * (grid.height / grid.rows)}, 
            () => 0
        )
        grid.image.fill(
            0, // fill with what?
            y * oneRow.length, // start
            y * oneRow.length + oneRow.length, // end
        )
    }

    // private
    function clearCanvas() {
        grid.image = new Array(width * height * 4).fill(0);
    }

    function shiftRows() {
        grid.image.copyWithin(grid.pixel.width * grid.pixel.width * grid.columns * 4, 0);
    }

    return Object.freeze({
        shiftRows,
        drawRow,
        drawPixel,
        drawScroll,
        grid,
        firstRow
    });
}