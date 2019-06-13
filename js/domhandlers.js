function DOMHandlerFactory({ numberInputSelector, numberSubmitSelector, animateToggleSelector, seedYearSelector, ctrlBoxSelector }) {

    const numberSubmit = document.querySelector(numberSubmitSelector);
    const playPause = document.querySelector(animateToggleSelector);
    const seedYear = document.querySelector(seedYearSelector);
    const ctrlBox = document.querySelector(ctrlBoxSelector);
    const buttons = document.getElementsByTagName('rule-control');
    const onClass = "on";

    function setRuleButtons(rule) {
        rule.forEach((state, index) => {
            const button = buttons[index];
            state ? button.setAttribute(onClass, "") : button.removeAttribute(onClass);
        });
    }

    function initRuleBtns(rule, callback) {
        setRuleButtons(rule);
        setRuleNumber(rule);
        ctrlBox.addEventListener('pixel-switch', (e) => {
            const ruleChange = Array.from(buttons)
                                    .map(button => button.hasAttribute(onClass) ? 1 : 0);
            setRuleNumber(ruleChange);
            return callback(Uint16Array.from(ruleChange).slice());
        });
    }

    function setRuleNumber(rule) {
        const ruleNumber = parseInt(rule.join(""), 2);
        document.querySelector(numberInputSelector).value = ruleNumber;
    }

    function ruleByNumberInput(callback) {
        numberSubmit.addEventListener('click', (e) => {
            const numberInput = document.querySelector(numberInputSelector).value;
            const newRule = parseInt(numberInput, 10).toString(2)
                .split("")
                .map((v) => parseInt(v));
            while (newRule.length < 8) {
                newRule.unshift(0);
            }
            setRuleButtons(newRule)
            return callback(Uint16Array.from(newRule).slice());
        });
    }

    function playPauseToggle(callback) {
        playPause.addEventListener('click', callback);
    }

    function seedYearBtn(callback) {
        seedYear.addEventListener('click', callback);
    }

    return Object.freeze({
        setRuleButtons,
        ruleByNumberInput,
        initRuleBtns,
        playPauseToggle,
        seedYearBtn
    });
}

export {
    DOMHandlerFactory
}