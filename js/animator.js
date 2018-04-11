function Animator(callback, refreshRate = 0) {

    const state = {
        isRunning: false,
        timeId: null,
        aniId: null
    }

    function refreshImage() {
        if(refreshRate !== 0) {
            state.timeId = window.setTimeout(() => {
                run();
            }, refreshRate);
        } else {
            run();
        }
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
        if(state.timeId) {
            window.clearTimeout(state.timeId);
        }
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
