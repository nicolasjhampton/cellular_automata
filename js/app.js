const worker = new Worker('js/worker.js');
const canvasCtrl = new CanvasControllerFactory({ id: 'automata', target: document.getElementById('screen') }, 800, 600, 200);
const screen = new Scroller({ displayCtrl: canvasCtrl });


document.getElementById('automata_controls').addEventListener('click', (e) => {
    if (e.target.classList.contains('pixel-switch')) {
        const pixelState = e.target.classList.toggle('on') ? 1 : 0;
        const pixelIndex = Array.from(e.currentTarget.children).indexOf(e.target.parentNode.parentNode);
        worker.postMessage(['ruleUpdate', pixelIndex, pixelState]);
    }
});





const firstYear = new Array(screen.state.columns).fill(0).map(() => Math.floor(Math.random() * 2));
screen.drawRow(firstYear);


const rule110 = [0, 1, 1, 0, 1, 1, 1, 0];
const buttons = document.querySelectorAll('.pixel-switch')
rule110.forEach((state, index) => {
    const button = buttons[index];
    state ? button.classList.add('on') : button.classList.remove('on');
});


worker.postMessage(['init', firstYear, rule110]);

const ani = Animator(function () {
    worker.postMessage(['getNewYear']);
    worker.onmessage = (e) => {
        const [eventName, ...data] = e.data;
        if (eventName === "newYear") {
            const [newYear] = data;
            screen.drawRow(newYear);
        }
    }
}, 30);

document.getElementById('animate')
    .addEventListener('click', ani.toggleAnimation);
