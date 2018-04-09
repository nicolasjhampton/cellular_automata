function AutomataFactory(firstYear) {

    const rule0 = [0, 0, 0, 0, 0, 0, 0, 0];

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
        state.rule = array.slice(0).reverse();
    }

    function getRule() {
        return state.rule.reverse();
    }

    function updateRule(ruleIndex, ruleState) {
        state.rule[Math.abs(ruleIndex - 7)] = ruleState;
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
        return parseInt(mapKey.join(""), 2);
    }

    function getNewYearsPixel(index) {
        return state.rule[getLastYearsPixels(index)];
    }

    function createNewYear() {
        const newYear = [];
        for(let i = 0; i < state.prevYear.length; ++i) {
            newYear.push(getNewYearsPixel(i));
        }
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