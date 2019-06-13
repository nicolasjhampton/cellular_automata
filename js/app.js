import { DOMHandlerFactory } from "./domhandlers.js";
import { Animator } from "./animator.js";
const canvasWorker = new Worker('js/advcanvasworker.js');
const automatonWorker = new Worker('js/automatonworker.js');

/**
 * CONSTANTS
 */
const RULE126 = new Uint16Array([0, 1, 1, 1, 1, 1, 1, 0]);
const WIDTH = Uint16Array.of(1000);
const HEIGHT = Uint16Array.of(600);
const COLUMNS = Uint16Array.of(1000);
const COLUMNS_COPY = COLUMNS.slice();
const FIRST_YEAR = generateRandomYear();


/**
 * CONSTANTS copies
 */
const RULE126_COPY = RULE126.slice();
const WIDTH_COPY = WIDTH.slice();
const HEIGHT_COPY = HEIGHT.slice();
const FIRST_YEAR_COPY = FIRST_YEAR.slice();


/**
 * Helper functions
 */
function generateRandomYear() {
    return Uint16Array.from({length: COLUMNS_COPY}, () => Math.floor(Math.random() * 2)).slice();
}


/**
 * initialize and attach the canvas
 */
const canvasOnScreen = document.createElement('canvas');
canvasOnScreen.setAttribute('width', WIDTH);
canvasOnScreen.setAttribute('height', HEIGHT);
document.getElementById('screen').appendChild(canvasOnScreen);
const context = canvasOnScreen.getContext('2d', { alpha: true });


/**
 * initialize ctrls working off the main thread
 */
canvasWorker.postMessage({ eventName: 'init', WIDTH, HEIGHT, COLUMNS, FIRST_YEAR}, 
                         [ WIDTH.buffer, HEIGHT.buffer, COLUMNS.buffer, FIRST_YEAR.buffer ]);
automatonWorker.postMessage({ eventName: 'init', FIRST_YEAR_COPY, RULE126}, 
                            [ FIRST_YEAR_COPY.buffer, RULE126.buffer ]);


/**
 * manage animations
 */
const ani = Animator(function () {

    automatonWorker.postMessage({ eventName: 'getNewYear' });

    automatonWorker.onmessage = (e) => {
        const { eventName } = e.data;

        if (eventName === "newYear") {
            const { newYear } = e.data;

            canvasWorker.postMessage({ eventName: 'genYearImage', newYear }, [newYear.buffer]);
        }
    }
    canvasWorker.onmessage = (e) => {
        const { eventName } = e.data;

        if (eventName === "drawYear") {
            const { image } = e.data;

            context.putImageData(new ImageData(
                new Uint8ClampedArray(image), WIDTH_COPY, HEIGHT_COPY
            ), 0, 0);
        }
    }
});


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
domHandlers.initRuleBtns(RULE126_COPY, (newRule) => {
    automatonWorker.postMessage({ eventName: 'replaceRule', newRule }, [newRule.buffer]);
});
domHandlers.seedYearBtn((e) => {
    const seedYear = generateRandomYear();
    automatonWorker.postMessage({ eventName: 'reseed', seedYear }, [seedYear.buffer]);
});
domHandlers.ruleByNumberInput((newRule) => {
    automatonWorker.postMessage({ eventName: 'replaceRule', newRule }, [newRule.buffer]);
});

domHandlers.playPauseToggle(ani.toggleAnimation);
