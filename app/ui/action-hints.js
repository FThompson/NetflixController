class Action {
    constructor(label, index, onPress, onRelease) {
        this.label = label
        this.index = index
        this.onPress = onPress
        this.onRelease = onRelease
    }
}

class ActionHandler {
    constructor() {
        this.actions = {
            3: {label: 'Test hint', index: 3},
            11: {label: 'Test hint', index: 11}
        };
    }

    addAction(action) {
        this.actions[action.index] = action;
        this.updateHints();
    }

    removeAction(action) {
        delete this.actions[action.index];
        this.updateHints();
    }

    updateHints() {
        if (this.hintsBar) {
            this.hintsBar.update(this.actions);
        }
    }

    showHints() {
        if (!this.hintsBar) {
            this.hintsBar = new ActionHintsBar();
            this.updateHints();
        }
    }

    hideHints() {
        if (this.hintsBar) {
            this.hintsBar.remove();
            this.hintsBar = null;
        }
    }

    onButtonPress(index) {
        if (index in this.actions && this.actions[index].onPress) {
            this.actions[index].onPress()
        }
    }

    onButtonRelease(index) {
        if (index in this.actions && this.actions[index].onRelease) {
            this.actions[index].onRelease()
        }
    }
}

class ActionHintsBar {
    constructor() {
        this.element = this.createBar();
        document.body.append(this.element);
    }

    createBar() {
        let hintsBar = document.createElement('div');
        hintsBar.id = 'gamepad-interface-hints-bar';
        hintsBar.classList.add('gamepad-interface-bar');
        return hintsBar;
    }

    createHint(action) {
        let button = gamepadMappings.getButton(buttonImageMapping, action.index);
        if (button) {
            let imageSrc = chrome.runtime.getURL(button.buttonImageSrc);
            return (
                `<div class='gamepad-interface-hint'>
                    <img src='${imageSrc}' alt='${button.buttonName}'>
                    ${action.label}
                </div>`   
            );
        }
        return null;
    }

    update(actions) {
        this.element.innerHTML = '';
        for (let action of Object.values(actions)) {
            let hint = this.createHint(action);
            if (hint) {
                this.element.insertAdjacentHTML('beforeend', hint);
            }
        }
    }

    remove() {
        this.element.remove();
    }
}