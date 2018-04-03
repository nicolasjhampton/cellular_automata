function DOMHandlerFactory({ animateToggleSelector, seedYearSelector, ctrlBoxSelector, buttonClass, onClass }) {

    const playPause = document.querySelector(animateToggleSelector);
    const seedYear = document.querySelector(seedYearSelector);
    const ctrlBox = document.querySelector(ctrlBoxSelector);
    const buttons = document.getElementsByClassName(buttonClass);

    function initRuleBtns(rule, callback) {
        rule.forEach((state, index) => {
            const button = buttons[index];
            state ? button.classList.add(onClass) : button.classList.remove(onClass);
        });
        ctrlBox.addEventListener('click', (e) => {
            if (e.target.classList.contains(buttonClass)) {
                const ruleState = e.target.classList.toggle(onClass) ? 1 : 0;
                const ruleIndex = Array.from(e.currentTarget.children)
                    .indexOf(e.target.parentNode.parentNode);
                return callback(ruleIndex, ruleState);
            }
        });
    }

    function playPauseToggle(callback) {
        playPause.addEventListener('click', callback);
    }

    function seedYearBtn(callback) {
        seedYear.addEventListener('click', callback);
    }

    return Object.freeze({
        initRuleBtns,
        playPauseToggle,
        seedYearBtn
    });
}