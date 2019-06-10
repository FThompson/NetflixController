class BottomBarContainer {
    constructor() {
        this.children = [];
        this.container = document.createElement('div');
        this.container.id = 'gamepad-interface-bottom-bar-container';
        document.body.append(this.container);
    }

    build() {
        while (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
        this.children.sort((a, b) => b.getPriority() - a.getPriority());
        for (let child of this.children) {
            this.container.append(child.element);
        }
    }

    add(element) {
        this.children.push(element);
        this.build();
    }

    remove(element) {
        this.children = this.children.filter(e => e !== element);
        this.build();
    }

    hide() {
        this.container.classList.add('gamepad-interface-hidden-faded');
    }

    show() {
        this.container.classList.remove('gamepad-interface-hidden-faded');
    }
}

class BottomBar {
    constructor() {
        if (new.target === BottomBar) {
            throw new TypeError('cannot instantiate abstract BottomBar');
        }
        if (!BottomBar.container) {
            BottomBar.container = new BottomBarContainer();
        }
    }

    createBar() {
        throw new TypeError('must implement abstract BottomBar#createBar');
    }

    getPriority() {
        return 0;
    }

    add() {
        if (!this.element) {
            this.element = this.createBar();
            BottomBar.container.add(this);
        }
    }

    remove() {
        if (this.element) {
            BottomBar.container.remove(this);
            this.element = null;
        }
    }
}