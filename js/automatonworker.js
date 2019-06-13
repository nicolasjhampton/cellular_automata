
importScripts('./automata.js');

let automata;
onmessage = (e) => {
    const { eventName } = e.data;

    if (eventName === "init") {
        const { FIRST_YEAR_COPY, RULE126 } = e.data;

        automata = AutomataFactory(FIRST_YEAR_COPY, RULE126);
    }
    if (eventName === "getNewYear") {
        const newYear = automata.createNewYear();
        postMessage({ eventName: 'newYear', newYear }, [newYear.buffer]);
    }
    if (eventName === "replaceRule") {
        const { newRule } = e.data;

        automata.setRule(newRule);
    }
    if (eventName === "reseed") {
        const { seedYear } = e.data;

        automata.seedPrevYear(seedYear);
    }
};
