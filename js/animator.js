function Animator(callback, refreshRate = 20) {

    const state = {
        isRunning: false,
        timeId: null,
        aniId: null
    }

    function refreshImage() {
        //state.timeId = window.setTimeout(() => {
            run();
        //}, refreshRate);
    }

    function updater(timestamp) {
        callback();
        refreshImage();
    }

    function run() {
        state.isRunning = true;
        state.aniId = window.requestAnimationFrame(updater);
    }

    function stop() {
        state.isRunning = false;
        //window.clearTimeout(state.timeId);
        window.cancelAnimationFrame(state.aniId);
    }

    function toggleAnimation() {
        if (state.isRunning) {
            stop();
        } else {
            run();
        }
    }


    return {
        state,
        toggleAnimation
    }
}

export {
    Animator
}
