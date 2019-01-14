class PageHandler {
    constructor() {
        if (new.target === PageHandler) {
            throw new TypeError('cannot instantiate abstract PageHandler')
        }
    }

    // static validatePath(path) must be implemented

    onSelectAction() {
        // to be optionally implemented by subclasses
    }

    onDirectionAction(direction) {
        // to be optionally implemented by subclasses
    }
}