class PageHandler {
    constructor() {
        if (new.target === PageHandler) {
            throw new TypeError('cannot instantiate abstract PageHandler')
        }
    }

    getPath() {
        throw new TypeError('must define abstract method PageHandler#getPath')
    }

    onPageLoad() {
        throw new TypeError('must define abstract method PageHandler#onPageLoad')
    }

    onSelectAction() {
        
    }

    onDirectionAction(direction) {
        
    }
}