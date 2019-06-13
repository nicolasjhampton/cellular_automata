class RuleControl extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        const ruleControl = this.getRuleControl();

        ruleControl.appendChild(this.getPattern());

        const switchBox = this.getSwitchBox();

        ruleControl.appendChild(switchBox);

        shadow.appendChild(this.getStyle());
        shadow.appendChild(ruleControl);
        const pixelSwitch = shadow.querySelector('.pixel-switch');
        pixelSwitch.addEventListener("click", (e) => {
            this.toggleAttribute("on");
            this.dispatchEvent(new Event('pixel-switch', {bubbles: true, composed: true}))
        })
    }

    static get observedAttributes() { return ['on']; }

    attributeChangedCallback(attr, oldValue, newValue) {
        // nor gate tests for initial attribute setting
        // if(!(!oldValue && !newValue)) {
            this.shadowRoot.querySelector('.pixel-switch').classList.toggle("on")
        // }
    }

    getPattern() {
        const patternBox = this.getDiv("pattern-box");

        const pattern = this.getAttribute('data-pattern').split(',');

        for(let value of pattern) {
            const pixel = this.getDiv("pixel");
            if(value === "1") {
                pixel.classList.add('on');
            }
            patternBox.appendChild(pixel);
        }

        return patternBox;
    }

    getDiv(className) {
        const switchBox = document.createElement('div');
        switchBox.setAttribute('class', className);
        return switchBox;
    }

    getRuleControl() {
        return this.getDiv("rule-control");
    }

    getSwitchBox() {
        const switchBox = this.getDiv("switch-box");
        switchBox.appendChild(this.getSpacer("left"));
        switchBox.appendChild(this.getSwitch());
        switchBox.appendChild(this.getSpacer("right"));
        return switchBox;
    }

    getSwitch() {
        const pixelSwitch = this.getDiv('pixel pixel-switch');
        if (this.hasAttribute('on')) {
            pixelSwitch.classList.add('on');
        }
        return pixelSwitch;
    }

    getSpacer(side) {
        return this.getDiv(`spacer ${side}`);
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent = this.stylesheet();
        return style;
    }

    stylesheet() {
        return `
        .rule-control {
            box-sizing: border-box;
            display: grid;
            width: 100%;
            height: 100%;
            grid-template-columns: 20% 20% 20% 20% 20%;
            grid-template-rows: 25% 25% 30% 20%;
            border: 2px solid black;
        }

        .pattern-box, .switch-box {
            display: flex;
            align-content: space-around;

        }

        .pattern-box {
            grid-column: 2/5;
            grid-row: 2;
        }

        .pattern-box .pixel:first-child {
            border-right:none;
        }

        .pattern-box .pixel:last-child {
            border-left:none;
        }

        .switch-box {
            margin-top: 8px;
            grid-column: 2/5;
            grid-row: 3;
        }

        .pixel {
            border: 2px solid black;
            width: 33%;
            height: 100%;
        }

        .spacer {
            width: 33%;
            height: 100%;
        }

        .on {
            background-color: black;
        }
        `
    }
}

customElements.define('rule-control', RuleControl);

{/* 
<div class="rule-control">
    <div class="pattern-box">
        <div class="pixel"></div>
        <div class="pixel on"></div>
        <div class="pixel"></div>
    </div>
    <div class="switch-box">
        <div class="spacer left"></div>
        <div class="pixel pixel-switch off"></div>
        <div class="spacer right"></div>
    </div>
</div> 
*/}




