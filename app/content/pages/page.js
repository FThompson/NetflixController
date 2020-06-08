class NavigatablePage {
    constructor() {
        if (new.target === NavigatablePage) {
            throw new TypeError('cannot instantiate abstract NavigatablePage');
        }
        this.navigatables = [];
        this.loaded = false;
        this.unloaded = false;
    }

    async load() {
        await Promise.all([this.loadPseudoStyler(), this.waitUntilReady()]);
        if (!this.unloaded) {
            this.onLoad();
            actionHandler.addAll(this.getActions());
            actionHandler.onInput = () => this.onInput();
            this.loaded = true;
        }
    }

    // to be implemented by subclass
    onLoad() {

    }

    async loadPseudoStyler() {
        if (this.needsPseudoStyler()) {
            this.styler = new PseudoStyler();
            return this.styler.loadDocumentStyles();
        }
        return Promise.resolve();
    }

    // via https://stackoverflow.com/a/30506051/1247781
    waitUntilReady() {
        let _this = this;
        return new Promise((resolve, reject) => {
            (function checkReadiness() {
                if (_this.unloaded || _this.isPageReady()) {
                    return resolve();
                }
                setTimeout(checkReadiness, 50);
            })();
        });
    }

    unload() {
        this.unloaded = true;
        if (this.loaded) {
            this.onUnload();
        }
    }

    // to be overriden by subclasses
    onUnload() {
        this.navigatables.forEach(navigatable => navigatable.exit());
        actionHandler.removeAll(this.getActions());
        actionHandler.onInput = null;
    }

    // to be overriden by subclasses
    isPageReady() {
        return true;
    }

    // to be overriden by subclasses
    needsPseudoStyler() {
        return false;
    }

    // to be overriden by subclasses
    hasSearchBar() {
        return false;
    }

    hasPath() {
        return true;
    }

    // to be overriden by subclasses
    onInput() {

    }

    // to be overriden by subclasses
    getActions() {
        return [];
    }

    // static validatePath(path) must be implemented by subclasses

    isNavigatable(position) {
        return position < this.navigatables.length;
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            throw new Error('no navigatable at position ' + position)
        }
        let params = this.exit();
        this.position = position;
        this.enter(params);
    }

    addNavigatable(position, navigatable) {
        if (this.styler && navigatable !== null) {
            navigatable.styler = this.styler;
        }
        this.navigatables.splice(position, 0, navigatable);
    }

    removeNavigatable(arg) {
        let position = arg;
        if (typeof arg === 'object') {
            // find and remove object argument
            position = this.navigatables.indexOf(arg);
        }
        if (position >= 0) {
            this.navigatables.splice(position, 1);
        }
    }

    removeCurrentNavigatable() {
        let params = this.exit();
        this.removeNavigatable(this.position);
        this.position--;
        this.enter(params);
    }

    exit() {
        if (this.navigatables[this.position]) {
            let exitParams = this.navigatables[this.position].exit();
            actionHandler.removeAll(this.navigatables[this.position].getActions());
            if (exitParams) {
                return exitParams;
            }
        }
        return {};
    }

    enter(params) {
        if (this.navigatables[this.position]) {
            this.navigatables[this.position].enter(params);
            actionHandler.addAll(this.navigatables[this.position].getActions());
        }
    }

    onDirectionAction(direction) {
        if (direction === DIRECTION.UP) {
            if (this.position > 0) {
                this.setNavigatable(this.position - 1);
            }
        } else if (direction === DIRECTION.DOWN) {
            this.setNavigatable(this.position + 1);
        } else if (direction === DIRECTION.LEFT) {
            this.navigatables[this.position].left();
        } else if (direction === DIRECTION.RIGHT) {
            this.navigatables[this.position].right();
        }
    }
}