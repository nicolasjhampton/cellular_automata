describe("The Scroller Factory Function", () => {
    let screen;
    let canvasCtrl = {
        shiftRows: jasmine.createSpy('shiftRows'),
        drawRow: jasmine.createSpy('drawRow'),
        grid: {
            columns: 10,
            rows: 10
        }
    }

    beforeEach(() => {
        canvasCtrl.drawRow.calls.reset();
        screen = new Scroller({ displayCtrl: canvasCtrl });
    });

    it("returns a object", function () {
        expect(typeof screen).toBe('object');
    });

    describe("returns a screen object", () => {

        describe("with a drawRow method", () => {

            it("that exists", function () {
                expect(screen.drawRow).not.toBeUndefined();
                expect(typeof screen.drawRow).toBe('function');
            });

            it("that calls the drawRow method on the displayCtrl", function () {
                screen.drawRow([0, 1, 1, 0, 1]);
                expect(canvasCtrl.drawRow.calls.mostRecent().args).toEqual([0, [0, 1, 1, 0, 1]]);
            });

            it("increments the current row one when a row is drawn", function () {
                screen.drawRow([1, 0, 0, 1, 0]);
                expect(screen.state.currentRow).toEqual(1);
            });

            it("that stops incrementing the current row one when equal to the display's row count minus 1", function () {
                for (let i = 0; i < canvasCtrl.grid.rows - 2; ++i) {
                    screen.drawRow([1, 0, 0, 1, 0]);
                }
                expect(screen.state.currentRow).toEqual(8);
                screen.drawRow([1, 0, 0, 0, 1]);
                expect(screen.state.currentRow).toEqual(9);
                screen.drawRow([1, 0, 0, 1, 0]);
                expect(screen.state.currentRow).toEqual(9);
            });

            it("that sets the isFilled state to true when all the rows have been drawn", function () {
                for (let i = 0; i < canvasCtrl.grid.rows - 1; ++i) {
                    screen.drawRow([1, 0, 0, 1, 0]);
                }
                expect(screen.state.isFilled).toEqual(false);
                screen.drawRow([1, 0, 0, 1, 0]);
                expect(screen.state.isFilled).toEqual(true);
            });

            it("that runs displayCtrl.shiftRows function if isFilled is true", function () {
                for (let i = 0; i < canvasCtrl.grid.rows; ++i) {
                    screen.drawRow([1, 0, 0, 1, 0]);
                }
                expect(canvasCtrl.shiftRows.calls.count()).toEqual(0);
                screen.drawRow([1, 0, 0, 1, 0]);
                expect(canvasCtrl.shiftRows.calls.count()).toEqual(1);
            });
        });
    });
});
