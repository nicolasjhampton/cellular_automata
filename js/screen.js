function Scroller({ displayCtrl }) {

    const state = {
        columns: displayCtrl.grid.columns,
        currentRow: 0,
        isFilled: false
    }

    function drawRow(array) {
        if (state.isFilled) {
            displayCtrl.shiftRows();
        }

        displayCtrl.drawRow(state.currentRow, array);

        if (state.currentRow < displayCtrl.grid.rows - 1) {
            ++state.currentRow;
        } else {
            state.isFilled = true;
        }
    }

    return Object.freeze({
        state,
        drawRow
    })

}