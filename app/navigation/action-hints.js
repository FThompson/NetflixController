class ActionHint {
    constructor(label, buttonImageSrc) {
        this.label = label
        this.buttonImageSrc = buttonImageSrc
    }

    createElement() {
        let span = document.createElement('span')
        let img = document.createElement('img')
        img.src = this.buttonImageSrc
        img.title = this.label
        span.append(img)
        let label = document.createTextNode(this.label)
        span.append(label)
        return span
    }
}

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
        this.actions = {};
        this.hintsBar = new ActionHintsBar();
    }

    addAction(action) {
        this.actions[action.index] = action;
        this.hintsBar.update(this.actions);
    }

    removeAction(action) {
        delete this.actions[action.index];
        this.hintsBar.update(this.actions);
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
        this.update([
            {label: 'Test hint', index: 3},
            {label: 'Test hint', index: 11}
        ]);
    }

    createBar() {
        let hintsBar = document.createElement('div');
        hintsBar.style.position = 'fixed';
        hintsBar.style.bottom = '0';
        hintsBar.style.width = '100%';
        hintsBar.style.height = '40px';
        hintsBar.style.backgroundColor = '#141414';
        hintsBar.style.zIndex = '10000';
        document.body.append(hintsBar);
        console.log(hintsBar);
        return hintsBar;
    }

    createHint(action) {
        let button = gamepadMappings.getButton(buttonImageMapping, action.index);
        if (button) {
            let span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.height = '40px';
            span.style.fontSize = '24px';
            let img = document.createElement('img');
            img.src = chrome.extension.getURL(button.buttonImageSrc);
            img.alt = button.buttonName;
            img.style.height = '40px';
            img.style.width = '40px';
            span.append(img);
            let label = document.createTextNode(action.label);
            span.append(label);
            return span;
        }
        return null;
    }

    update(actions) {
        this.element.innerHTML = '';
        for (let action of Object.values(actions)) {
            let hint = this.createHint(action);
            if (hint) {
                this.element.append(hint);
            }
        }
    }

    show() {
        this.element.style.display = 'default';
    }

    hide() {
        this.element.style.display = 'none';
    }
}