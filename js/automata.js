function AutomataFactory(firstYear, firstRule) {

    const state = {
        prevYear: firstYear,
        columns: firstYear.length,
        rule: encodeRule(firstRule)
    }

    // public
    function setRule(rule) {
        state.rule = encodeRule(rule);
    }

    // public
    function updateRule(ruleIndex, ruleState) {
        state.rule[Math.abs(ruleIndex - 7)] = ruleState;
    }

    // public
    function createNewYear() {
        const newYear = new Uint8ClampedArray(new ArrayBuffer(state.prevYear.length));
        for(let i = 0; i < state.prevYear.length; ++i) {
            newYear[i] = getNewYearsPixel(i);
        }
        state.prevYear = newYear;
        return newYear.slice();
    }

    // public
    function seedPrevYear(seedYear) {
        state.prevYear = seedYear;
    }

    // private
    function encodeRule(array) {
        return new Uint8Array(array.slice(0).reverse());
    }

    // private
    function getNewYearsPixel(index) {
        return state.rule[getLastYearsPixels(index)];
    }

    // private
    function getLastYearsPixels(index) {
        const begin = index === 0;
        const end = index === state.columns - 1;
        const start = begin ? index : index - 1;
        const stop = end ? state.columns : index + 2;
        let mapKey = state.prevYear.slice(start, stop);
        if (begin) {
            mapKey = [state.prevYear[state.prevYear.length - 1] , ...mapKey];
        } else if (end) {
            mapKey = [...mapKey, state.prevYear[0]]
        }
        return parseInt(mapKey.join(""), 2);
    }

    // private
    function getRule() {
        return Array.from(state.rule).reverse();
    }

    return Object.freeze({
        state,
        setRule,
        updateRule,
        createNewYear,
        seedPrevYear
    });
}


// [
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
// ]

// 3, 4
// y, x

// y - 1, x - 1
// y - 1, x
// y - 1, x + 1
// y, x - 1
// y, x
// y, x + 1
// y + 1, x - 1
// y + 1, x
// y + 1, x + 1

// [
//     [0, 0, 0],
//     [0, 0, 0],
//     [0, 0, 0]
// ]
// ===
// [
//     [y - 1][x - 1],[y - 1][    x],[y - 1][x + 1],
//     [    y][x - 1],[    y][    x],[    y][x + 1],
//     [y + 1][x - 1],[y + 1][    x],[y + 1][x + 1]
// ]
// ===
// [0,1,0] in 1-dimensional cellular Automata
// numbers 0 through 8
// 8 1-dimensional senarios make a rule
// ===
// [0, 0, 0, 0, 0, 0, 0, 0] in 2-dimensional cellular Automata
// numbers 0 through 255
// 512 2-dimensional senarios make a rule
// might need a set to hold all the senarios
// OR just add the senarios to the set that matter