
importScripts('./advcanvasctrl.js');

let canvas;
onmessage = (e) => {

    const { eventName } = e.data;
    if (eventName === "init") {
        const { WIDTH, HEIGHT, COLUMNS, FIRST_YEAR } = e.data;

        canvas = new AdvancedCanvasControllerFactory(...WIDTH, ...HEIGHT, ...COLUMNS, FIRST_YEAR);
        postMessage({ eventName: 'drawYear', image: canvas.firstRow }, [canvas.firstRow.buffer])
    }
    if (eventName === "genYearImage") {
        const { newYear } = e.data;
       
        const image = canvas.drawScroll(newYear);
        postMessage({ eventName: 'drawYear', image}, [image.buffer]);
    }
};