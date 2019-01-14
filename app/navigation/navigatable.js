class Navigatable {
    constructor() {
        if (new.target === Navigatable) {
            throw new TypeError('cannot instantiate abstract Navigatable')
        }
    }

    left() {
        throw new TypeError('must implement abstract Navigatable#navigate')
    }

    right() {
        throw new TypeError('must implement abstract Navigatable#navigate')
    }

    enter(params) {
        throw new TypeError('must implement abstract Navigatable#enter')
    }

    exit() {
        // return params for enter(params)
        throw new TypeError('must implement abstract Navigatable#exit')
    }

    select() {
        throw new TypeError('must implement abstract Navigatable#select')
    }
}