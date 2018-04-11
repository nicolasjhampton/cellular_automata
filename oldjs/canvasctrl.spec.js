

describe("The CanvasControllerFactory Function", () => {
    const id = 'automata';
    const target = document.body;
    let canvas;
    let canvasController;
    beforeEach(() => {
        canvasController = new CanvasControllerFactory({ id, target }, 300, 300, 10);
    });

    it("returns a object", function () {
        expect(typeof canvasController).toBe('object');
    });

    describe("returns a canvasController object", () => {

        it("that has a canvas property", function () {
            expect(canvasController.canvas).not.toBeUndefined();
            expect(canvasController.canvas.id).toBe(id);
        });

        it("who's second argument sets the width of the canvas", function () {
            expect(window.getComputedStyle(canvasController.canvas).width).toBe('300px');
            expect(canvasController.grid.width).toBe(300);
        });

        it("who's third argument sets the height of the canvas", function () {
            expect(window.getComputedStyle(canvasController.canvas).height).toBe('300px');
            expect(canvasController.grid.height).toBe(300);
        });

        it("who's fourth argument sets the number of columns we'll split the grid into", function () {
            expect(canvasController.grid.columns).toBe(10);
        });

        it("will set the pixel width to be the width of the grid divided by the columns", function () {
            expect(canvasController.grid.pixel.width).toBe(30);
        });

        it("will set the the number of grid rows to be the height divided by the pixel width", function () {
            expect(canvasController.grid.rows).toBe(10);
        });

        it("who's default arguments sets the height, width, and columns to be 300, 300 and 100", function () {
            const canvasController = new CanvasControllerFactory();
            expect(canvasController.canvas.id).toBe('automata');
            expect(canvasController.canvas.parentNode).toBe(document.body);
            expect(canvasController.grid.width).toBe(500);
            expect(canvasController.grid.height).toBe(500);
            expect(canvasController.grid.columns).toBe(50);
        });


        describe("with a drawPixel method", () => {
            let canvasController;
            beforeEach(() => {
                canvasController = new CanvasControllerFactory({ id, target }, 300, 300, 300);
            });

            it("that exists", function () {
                expect(canvasController.drawPixel).not.toBeUndefined();
                expect(typeof canvasController.drawPixel).toBe('function');
            });

            it("that draws pixel on the canvas at the specified coordinates", function () {
                canvasController.drawPixel(40, 50);
                const imageData = canvasController.context.getImageData(40, 50, 2, 2);
                expect(imageData.data.toString()).toBe('0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0');
            });

        });


        describe("with a drawRow method", () => {
            let canvasController;
            beforeEach(() => {
                canvasController = new CanvasControllerFactory({ id, target }, 5, 5, 5);
            });

            it("that exists", function () {
                expect(canvasController.drawRow).not.toBeUndefined();
                expect(typeof canvasController.drawRow).toBe('function');
            });

            it("that draws the correct points in a specified row", function () {
                canvasController.drawRow(1, [1, 0, 1, 1, 0]);
                const imageData = canvasController.context.getImageData(0, 0, 5, 2);
                expect(imageData.data.toString()).toBe(
                    '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,' +
                    '0,0,0,255,0,0,0,0,0,0,0,255,0,0,0,255,0,0,0,0'
                );
            });

        });


        describe("with a clearRow method", () => {
            let canvasController;
            beforeEach(() => {
                canvasController = new CanvasControllerFactory({ id, target }, 5, 5, 5);
                canvasController.drawRow(1, [1, 0, 1, 1, 1]);
            });

            it("that exists", function () {
                expect(canvasController.clearRow).not.toBeUndefined();
                expect(typeof canvasController.clearRow).toBe('function');
            });

            it("that clear all the points in a specified row", function () {
                canvasController.clearRow(1);
                const imageData = canvasController.context.getImageData(0, 0, 5, 2);
                expect(imageData.data.toString()).toBe(
                    '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,' +
                    '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'
                );
            });

        });


        describe("with a shiftRows method", () => {
            let canvasController;
            beforeEach(() => {
                canvasController = new CanvasControllerFactory({ id, target }, 5, 5, 5);
                canvasController.drawRow(0, [1, 0, 1, 1, 0]);
                canvasController.drawRow(1, [0, 1, 0, 0, 1]);
                canvasController.drawRow(2, [1, 0, 0, 1, 1]);
            });

            it("that exists", function () {
                expect(canvasController.shiftRows).not.toBeUndefined();
                expect(typeof canvasController.shiftRows).toBe('function');
            });

            it("that shifts the entire image on the canvas up one row", function () {
                canvasController.shiftRows();
                const imageData = canvasController.context.getImageData(0, 0, 5, 3);
                expect(imageData.data.toString()).toBe(
                    '0,0,0,0,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,255,' +
                    '0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,255,' +
                    '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'
                );
            });

        });
    });
});

