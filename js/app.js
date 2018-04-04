const worker = new Worker('js/worker.js');

const rule110 = [0, 1, 1, 0, 1, 1, 1, 0];
const canvasDetails = { id: 'automata', target: document.getElementById('screen') };


const canvasCtrl = new CanvasControllerFactory(canvasDetails, 1200, 600, 1200);
const { screen, firstRow: firstYear } = new Scroller({ displayCtrl: canvasCtrl });
worker.postMessage(['init', screen.drawRow(firstYear), rule110]);


const domHandlers = DOMHandlerFactory({
    numberInputSelector: "#numberInput",
    numberSubmitSelector: "#numberSubmit",
    animateToggleSelector: '#animate',
    seedYearSelector: '#seedYear',
    ctrlBoxSelector: '#automata_controls',
    buttonClass: 'pixel-switch',
    onClass: 'on'
});
domHandlers.initRuleBtns(rule110, (index, state) => {
    worker.postMessage(['ruleUpdate', index, state]);
});
domHandlers.seedYearBtn((e) => {
    worker.postMessage(['reseed', screen.generateSeedRow()]);
});
domHandlers.ruleByNumberInput((newRule) => {
    console.log(newRule)
    worker.postMessage(['replaceRule', newRule]);
});

const ani = Animator(function () {
    worker.postMessage(['getNewYear']);
    worker.onmessage = (e) => {
        const [eventName, ...data] = e.data;

        if (eventName === "newYear") {
            const [newYear] = data;
            screen.drawRow(newYear);
        }
    }
}, 0);

domHandlers.playPauseToggle(ani.toggleAnimation);
