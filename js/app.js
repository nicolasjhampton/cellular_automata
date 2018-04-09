// constants
const width = 1000;
const height = 600;
const columns = 200;
const rule110 = [0, 1, 1, 0, 1, 1, 1, 0];

// grab and set onscreen canvas
const canvas = document.getElementById('canvas');
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
const canvasContext = canvas.getContext('2d', { alpha: false });

// initialize screen controllers
const canvasCtrl = new CanvasControllerFactory(width, height, columns);
const screen = new Scroller({ displayCtrl: canvasCtrl });

// create and draw random first year
const firstYear = screen.generateSeedRow();
const image = screen.drawRow(firstYear);
canvasContext.putImageData(image, 0, 0);

// initialize automaton model
const automatonWorker = new Worker('js/automatonworker.js');
automatonWorker.postMessage(['init', firstYear, rule110, columns]);

// attach event handlers
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
    automatonWorker.postMessage(['ruleUpdate', index, state]);
});
domHandlers.ruleByNumberInput((newRule) => {
    automatonWorker.postMessage(['replaceRule', newRule]);
});
domHandlers.seedYearBtn((e) => {
    automatonWorker.postMessage(['reseed', screen.generateSeedRow()]);
});

// sync each process time with each frame rendered
const ani = Animator(function () {
    automatonWorker.postMessage(['getNewYear']);
    automatonWorker.onmessage = (e) => {
        const [eventName, ...data] = e.data;

        if (eventName === "newYear") {
            const [newYear] = data;
            const image = screen.drawRow(newYear);
            canvasContext.putImageData(image, 0, 0);
        }
    }
}, 0);

domHandlers.playPauseToggle(ani.toggleAnimation);




