describe("The Animator Factory Function", () => {
    const callback = jasmine.createSpy('callback');
    let animation;

    beforeEach(() => {
        callback.calls.reset();
        animation = new Animator(callback, 200);
    });

    afterEach(() => {
        animation.stop();
    });


    it("returns a object", function () {
        expect(typeof animation).toBe('object');
    });

    describe("returns a run method", () => {

        it("that exists", function () {
            expect(animation.run).not.toBeUndefined();
            expect(typeof animation.run).toBe('function');
        });

        it("which calls the callback when ran", function () {
            animation.run();
            setTimeout(function () {
                expect(callback).toHaveBeenCalledTimes(1);
            }, 100);
        });

        it("which stores an animation id in the state when ran", function () {
            animation.run();
            expect(animation.state.aniId).not.toBeNull();
            expect(animation.state.timeId).toBeNull();
        });

        it("which stores a timeout id in the state when animation frame runs", function () {
            animation.run();
            setTimeout(function () {
                expect(animation.state.aniId).not.toBeNull();
                expect(animation.state.timeId).not.toBeNull();
            }, 100)
        });

        it("which calls the callback every x ms as the refreshRate argument", function () {
            animation.run();
            setTimeout(function () {
                expect(callback.calls.count()).toBe(4);
            }, 600)
        });

    });
});