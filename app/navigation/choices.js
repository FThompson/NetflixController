class InteractiveChoices extends Navigatable {
    constructor(dispatchKeyFunction) {
        super();
        this.choices = document.querySelectorAll('.BranchingInteractiveScene--choice-selection');
        this.position = -1;
        this.ready = false;
        this.dispatchKey = dispatchKeyFunction;
    }

    left() {
        if (this.position > 0) {
            this.select(this.position - 1);
        }
    }

    right() {
        if (this.position < this.choices.length - 1) {
            this.select(this.position + 1);
        }
    }

    // select if has delay and return true, otherwise return false
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
        let loadTarget = this.choices[0].parentElement;
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

    exit() {
        this.unselect();
        this.position = -1;
    }

    getActions() {
        return [
            {
                label: 'Select',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => {
                    // dispatch numeric key corresponding to choice number
                    let keycode = '0'.charCodeAt() + this.position + 1;
                    this.dispatchKey(keycode, false);
                }
            }
        ];
    }

    unselect() {
        if (this.position >= 0) {
            this.choices[this.position].classList.remove('focus');
        }
    }

    select(position) {
        if (this.ready) {
            this.unselect();
            this.position = position;
            this.choices[this.position].classList.add('focus');
        }
    }
}