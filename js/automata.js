function AutomataFactory(firstYear) {
    // = new Array(columns).fill(0).map(() => Math.floor(Math.random() * 2))
    // dispInterface.drawRow(firstYear);

    const rule0 = {
        "[1,1,1]": 0,
        "[1,1,0]": 0,
        "[1,0,1]": 0,
        "[1,0,0]": 0,
        "[0,1,1]": 0,
        "[0,1,0]": 0,
        "[0,0,1]": 0,
        "[0,0,0]": 0,
    };

    const order = [
        "[1,1,1]",
        "[1,1,0]",
        "[1,0,1]",
        "[1,0,0]",
        "[0,1,1]",
        "[0,1,0]",
        "[0,0,1]",
        "[0,0,0]",
    ];

    const state = {
        sideValue: 1,
        prevYear: firstYear,
        columns: firstYear.length,
        rules: rule0
    }

    function clearRules() {
        state.rules = rule0;
    }

    function setRule(array) {
        const newRule = Object.assign({}, rule0);
        array.forEach((value, index) => newRule[order[index]] = value)
        state.rules = newRule;
    }

    function getLastYearsPixels(index) {
        const begin = index === 0;
        const end = index === state.columns - 1;
        const start = begin ? index : index - 1;
        const stop = end ? state.columns : index + 2;
        const mapKey = state.prevYear.slice(start, stop);
        if (begin) {
            mapKey.unshift(state.sideValue);
        } else if (end) {
            mapKey.push(state.sideValue);
        }
        return JSON.stringify(mapKey);
    }

    function getNewYearsPixel(index) {
        const mapKey = getLastYearsPixels(index);
        return state.rules[mapKey];
    }

    function updateRule(ruleIndex, ruleState) {
        state.rules[order[ruleIndex]] = ruleState;
    }

    function createNewYear() {
        const newYear = state.prevYear.map((pixel, index) => {
            const newPixel = getNewYearsPixel(index);
            return newPixel;
        });
        state.prevYear = newYear;
        return newYear;
        // dispInterface.drawRow(newYear);
    }

    return Object.freeze({
        state,
        setRule,
        createNewYear,
        updateRule
    });
}