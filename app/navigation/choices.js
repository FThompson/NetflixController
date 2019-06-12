class InteractiveChoices extends StaticNavigatable {
    constructor(dispatchKeyFunction) {
        super();
        this.ready = false;
        this.dispatchKey = dispatchKeyFunction;
    }

    getComponents() {
        return document.querySelectorAll('.BranchingInteractiveScene--choice-selection');
    }

    interact(component) {
        let keycode = '0'.charCodeAt() + this.position + 1;
        this.dispatchKey(keycode, false);
    }

    // select if component has delay and return true, otherwise return false.
    // this delay is the time it takes for the component to load in visually.
    selectAfterDelay(target) {
        let delay = parseInt(target.style.transitionDelay);
        if (delay) {
            // extra 500ms necessary to avoid losing the focus we set
            setTimeout(() => {
                this.ready = true;
                this.select(0);
            }, delay + 500);
            return true;
        }
        return false;
    }

    enter(params) {
        let loadTarget = this.components[0].parentElement;
        if (!this.selectAfterDelay(loadTarget)) {
            let observer = new MutationObserver((mutations, observer) => {
                for (let mutation of mutations) {
                    if (this.selectAfterDelay(mutation.target)) {
                        observer.disconnect();
                        break;
                    }
                }
            });
            observer.observe(loadTarget, { attributes: true, attributeFilter: ['style']});
        }
    }

    style(component, selected) {
        component.classList.toggle('focus', selected);
    }

    select(position) {
        if (this.ready) {
            super.select(position);
        }
    }
}