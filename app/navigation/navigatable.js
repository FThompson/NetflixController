class Navigatable {
    constructor() {
        if (new.target === Navigatable) {
            throw new TypeError('cannot instantiate abstract Navigatable')
        }
    }

    setStyler(styler) {
        this.styler = styler
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

    doAction(index) {
        
    }

    static mouseOver(element) {
        let mouseover = new MouseEvent('mouseover', {bubbles: true})
        element.dispatchEvent(mouseover)
    }

    static mouseOut(element) {
        let mouseout = new MouseEvent('mouseout', {bubbles: true})
        element.dispatchEvent(mouseout)
    }

    static hover(element) {
        let center = Navigatable.getCenter(element);
        chrome.runtime.sendMessage({ message: 'mouseOver', x: center.x, y: center.y });
    }

    static unhover() {
        chrome.runtime.sendMessage({ message: 'mouseOut' });
    }

    static getCenter(element) {
        let rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY + rect.height / 2
        };
    }

    // via https://stackoverflow.com/a/49842367/1247781
    static scrollIntoView(element) {
        let bounds = element.getBoundingClientRect()
        let y = bounds.top + bounds.height / 2 + window.scrollY - window.innerHeight / 2;
        window.scroll({
            top: y,
            behavior: 'smooth'
        });
    }
}