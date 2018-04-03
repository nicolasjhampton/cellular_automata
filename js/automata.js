function AutomataFactory(firstYear) {

    const rule0 = {
        "[1,1,1]": 0, "[1,1,0]": 0, "[1,0,1]": 0, "[1,0,0]": 0,
        "[0,1,1]": 0, "[0,1,0]": 0, "[0,0,1]": 0, "[0,0,0]": 0,
    };

    const order = [
        "[1,1,1]", "[1,1,0]", "[1,0,1]", "[1,0,0]",
        "[0,1,1]", "[0,1,0]", "[0,0,1]", "[0,0,0]",
    ];

    const state = {
        sideValue: 1,
        prevYear: firstYear,
        columns: firstYear.length,
        rule: rule0
    }

    function clearRule() {
        state.rule = rule0;
    }

    function setRule(array) {
        const newRule = Object.assign({}, rule0);
        array.forEach((value, index) => newRule[order[index]] = value)
        state.rule = newRule;
    }

    function getRule() {
        return order.map(key => state.rule[key])
    }

    function updateRule(ruleIndex, ruleState) {
        state.rule[order[ruleIndex]] = ruleState;
    }

    function getLastYearsPixels(index) {
        const begin = index === 0;
        const end = index === state.columns - 1;
        const start = begin ? index : index - 1;
        const stop = end ? state.columns : index + 2;
        const mapKey = state.prevYear.slice(start, stop);
        if (begin) {
            mapKey.unshift(state.prevYear[state.prevYear.length - 1]);
        } else if (end) {
            mapKey.push(state.prevYear[0]);
        }
        return JSON.stringify(mapKey);
    }

    function getNewYearsPixel(index) {
        const mapKey = getLastYearsPixels(index);
        return state.rule[mapKey];
    }

    function createNewYear() {
        const newYear = state.prevYear.map((pixel, index) => getNewYearsPixel(index));
        state.prevYear = newYear;
        return newYear;
    }

    function seedPrevYear(seedYear) {
        state.prevYear = seedYear;
    }

    return Object.freeze({
        state,
        setRule,
        getRule,
        updateRule,
        createNewYear,
        seedPrevYear
    });
}