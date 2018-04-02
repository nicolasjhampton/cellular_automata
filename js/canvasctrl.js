function CanvasControllerFactory({ id, target } = { id: 'automata', target: document.body }, width = 500, height = 500, columns = 50) {
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
        context.fillStyle = context.createPattern(canvas, 'no-repeat');
    }

    // private
    function printCopy() {
        context.translate(0, -grid.pixel.width);
        context.fillRect(0, grid.pixel.width, grid.width, grid.height);
    }

    function drawPixel(x, y) {
        context.fillStyle = grid.pixel.color;
        context.fillRect(
            x * grid.pixel.width,
            y * grid.pixel.width,
            grid.pixel.width,
            grid.pixel.width
        );
    }

    function drawRow(y, array) {
        array.forEach((isFilled, index) => {
            if (isFilled === 1) {
                drawPixel(index, y);
            }
        });
    }

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
        copyCanvas();
        clearCanvas();
        printCopy();
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


