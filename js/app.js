const worker = new Worker('js/worker.js');

/**
 * CONSTANTS
 */
const RULE110 = [0, 1, 1, 0, 1, 1, 1, 0];
const WIDTH = 1200;
const HEIGHT = 600;
const COLUMNS = 1000;
const DOM_DETAILS = { id: 'automata', target: document.getElementById('screen') };


/**
 * initialize ctrls
 */
const canvas = new CanvasControllerFactory(DOM_DETAILS, WIDTH, HEIGHT, COLUMNS);
worker.postMessage(['init', canvas.generateSeedRow(), RULE110]);


/**
 * Activate Event Handlers
 */
const domHandlers = DOMHandlerFactory({
    numberInputSelector: "#numberInput",
    numberSubmitSelector: "#numberSubmit",
    animateToggleSelector: '#animate',
    seedYearSelector: '#seedYear',
    ctrlBoxSelector: '#automata_controls',
    buttonClass: 'pixel-switch',
    onClass: 'on'
});
domHandlers.initRuleBtns(RULE110, (newRule) => {
    worker.postMessage(['replaceRule', newRule]);
});
domHandlers.seedYearBtn((e) => {
    worker.postMessage(['reseed', canvas.generateSeedRow()]);
});
domHandlers.ruleByNumberInput((newRule) => {
    worker.postMessage(['replaceRule', newRule]);
});


/**
 * manage animations
 */
const ani = Animator(function () {
    worker.postMessage(['getNewYear']);
    worker.onmessage = (e) => {
        const [eventName, ...data] = e.data;

        if (eventName === "newYear") {
            const [newYear] = data;
            canvas.drawScroll(newYear);
        }
    }
}, 0);

domHandlers.playPauseToggle(ani.toggleAnimation);
