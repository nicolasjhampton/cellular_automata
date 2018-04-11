
importScripts('./advcanvasctrl.js');
let canvas;
onmessage = (e) => {
    const [eventName, ...data] = e.data;
    if (eventName === "init") {
        const [WIDTH, HEIGHT, COLUMNS, firstYear] = data;
        canvas = new AdvancedCanvasControllerFactory(WIDTH, HEIGHT, COLUMNS, firstYear);
        postMessage(['drawYear', canvas.firstRow])
    }
    if (eventName === "genYearImage") {
        const [yearModel] = data;
        const image = canvas.drawScroll(yearModel);
        postMessage(["drawYear", image]);
    }
};