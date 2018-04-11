import { DOMHandlerFactory } from "./domhandlers.js";
import { Animator } from "./animator.js";

const canvasWorker = new Worker('js/advcanvasworker.js');
const automatonWorker = new Worker('js/automatonworker.js');

function generateRandomYear() {
    return Uint8ClampedArray.from({length: COLUMNS}, () => Math.floor(Math.random() * 2))
}


/**
 * CONSTANTS
 */
const RULE110 = new Uint8ClampedArray([0, 1, 1, 0, 1, 1, 1, 0]);
const WIDTH = 1000;
const HEIGHT = 600;
const COLUMNS = 1000;
const firstYear = generateRandomYear();


const canvasOnScreen = document.createElement('canvas');
canvasOnScreen.setAttribute('width', WIDTH);
canvasOnScreen.setAttribute('height', HEIGHT);
document.getElementById('screen').appendChild(canvasOnScreen);
const context = canvasOnScreen.getContext('2d', { alpha: false });

/**
 * initialize ctrls
 */

canvasWorker.postMessage(['init', WIDTH, HEIGHT, COLUMNS, firstYear]);
automatonWorker.postMessage(['init', firstYear, RULE110]);


/**
 * manage animations
 */
const ani = Animator(function () {
    automatonWorker.postMessage(['getNewYear']);
    automatonWorker.onmessage = (e) => {
        const [eventName, ...data] = e.data;

        if (eventName === "newYear") {
            const [newYear] = data;
            canvasWorker.postMessage(['genYearImage', newYear])
        }
    }
    canvasWorker.onmessage = (e) => {
        const [eventName, ...data] = e.data;

        if (eventName === "firstYear") {
            const [firstYear] = data;
            canvasWorker.postMessage(['genYearImage', firstYear]);
        }
        if (eventName === "drawYear") {
            const [image] = data;
            context.putImageData(image, 0, 0);
        }
    }
}, 0);


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
    automatonWorker.postMessage(['replaceRule', newRule]);
});
domHandlers.seedYearBtn((e) => {
    automatonWorker.postMessage(['reseed', generateRandomYear()]);
});
domHandlers.ruleByNumberInput((newRule) => {
    automatonWorker.postMessage(['replaceRule', newRule]);
});

domHandlers.playPauseToggle(ani.toggleAnimation);
