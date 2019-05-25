class BottomBar {
    constructor() {
        if (new.target === BottomBar) {
            throw new TypeError('cannot instantiate abstract BottomBar');
        }
    }

    createBar() {
        throw new TypeError('must implement abstract BottomBar#createBar');
    }

    add() {
        if (!this.element) {
            this.element = this.createBar();
            document.body.append(this.element);
        }
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}