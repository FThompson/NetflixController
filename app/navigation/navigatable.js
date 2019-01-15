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

    // via https://stackoverflow.com/a/49842367/1247781
    static scrollIntoView(element) {
        let bounds = element.getBoundingClientRect()
        console.log(element)
        console.log(bounds)
        let y = bounds.top + bounds.height / 2 + window.scrollY - window.innerHeight / 2;
        window.scroll({
            top: y,
            behavior: 'smooth'
        });
    }
}