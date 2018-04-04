function Scroller({ displayCtrl }) {

    const state = {
        columns: displayCtrl.grid.columns,
        currentRow: 0,
        isFilled: false
    }

    function drawRow(array) {
        displayCtrl.shiftRows();

        displayCtrl.drawRow(array);

        return array;
    }

    function generateSeedRow() {
        return new Array(state.columns).fill(0).map(() => Math.floor(Math.random() * 2));
    }

    return Object.freeze({
        screen: {
            state,
            drawRow,
            generateSeedRow
        },
        firstRow: generateSeedRow()
    });


}