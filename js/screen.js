function Scroller({ displayCtrl }) {

    const state = {
        columns: displayCtrl.grid.columns
    }

    function drawRow(array) {
        displayCtrl.shiftRows();

        const image = displayCtrl.drawRow(array);
        
        return image;
    }

    function generateSeedRow() {
        const row = [];
        const noOfPixelsOn = Math.floor(Math.random() * (state.columns + 1));
        for (let i = 0; i < noOfPixelsOn; ++i) {
            row.push(Math.floor(Math.random() * state.columns))
        }
        const seedRow = Array.from(new Set(row))
                    .sort()
                    .map(index => ({ coord: [index] }));

        return seedRow;
    }

    return Object.freeze({
        state,
        drawRow,
        generateSeedRow
    });

}