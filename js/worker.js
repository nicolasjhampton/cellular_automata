
importScripts('./automata.js');
let automata;
onmessage = (e) => {
    const [eventName, ...data] = e.data;
    if (eventName === "init") {
        const [firstYear, rule] = data;
        automata = AutomataFactory(firstYear);
        initRule = automata.setRule(rule);
    }
    if (eventName === "getNewYear") {
        const newYear = automata.createNewYear();
        postMessage(["newYear", newYear]);
    }
    if (eventName == "ruleUpdate") {
        const [ruleIndex, ruleState] = data;
        automata.updateRule(ruleIndex, ruleState);
    }
    if (eventName == "reseed") {
        const [seedYear] = data;
        automata.seedPrevYear(seedYear);
    }
};




// automata.drawNewYear();