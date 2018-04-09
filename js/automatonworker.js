
importScripts('./automata.js');
let automata;
onmessage = (e) => {
    const [eventName, ...data] = e.data;
    if (eventName === "init") {
        const [firstYear, rule, columns] = data;
        automata = AutomataFactory(firstYear);
        automata.setRule(rule);
    }
    if (eventName === "getNewYear") {
        const newYear = automata.createNewYear();
        postMessage(["newYear", newYear]);
    }
    if (eventName === "ruleUpdate") {
        const [ruleIndex, ruleState] = data;
        automata.updateRule(ruleIndex, ruleState);
    }
    if (eventName === "replaceRule") {
        const [newRule] = data;
        automata.setRule(newRule);
    }
    if (eventName === "reseed") {
        const [seedYear] = data;
        automata.setPrevYear(seedYear);
    }
};