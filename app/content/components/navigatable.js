class Navigatable {
    constructor() {
        if (new.target === Navigatable) {
            throw new TypeError('cannot instantiate abstract Navigatable');
        }
    }

    setStyler(styler) {
        this.styler = styler;
    }

    left() {
        throw new TypeError('must implement abstract Navigatable#navigate');
    }

    right() {   
        throw new TypeError('must implement abstract Navigatable#navigate');
    }

    enter(params) {
        throw new TypeError('must implement abstract Navigatable#enter');
    }

    exit() {
        // return params for enter(params)
        throw new TypeError('must implement abstract Navigatable#exit');
    }

    getActions() {
        return [];
    }

    static mouseOver(element) {
        let mouseover = new MouseEvent('mouseover', {bubbles: true});
        element.dispatchEvent(mouseover);
    }

    static mouseOut(element) {
        let mouseout = new MouseEvent('mouseout', {bubbles: true});
        element.dispatchEvent(mouseout);
    }

    static scrollIntoView(element) {
        let bounds = element.getBoundingClientRect();
        let y = bounds.top + bounds.height / 2 + window.scrollY - window.innerHeight / 2;
        window.scroll({ top: y, behavior: 'smooth' });
    }
}