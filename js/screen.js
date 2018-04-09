function Scroller({ displayCtrl }) {

    const state = {
        columns: displayCtrl.grid.columns
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
        state,
        drawRow,
        generateSeedRow
    });


}