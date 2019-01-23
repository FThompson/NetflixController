class FeaturelessBrowse extends SliderBrowse {
    constructor() {
        super(0)
    }

    async load() {
        await super.load()
        let focus = () => {
            this.addNavigatable(1, Slider.getSlider(0))
            this.setNavigatable(1)
        }
        // TODO: rewrite content.js to avoid needed globals like keyboard
        if (keyboard) {
            keyboard.closeCallback = focus
        } else {
            focus()
        }
    }

    static validatePath(path) {
        return path === '/browse/new-release' || path === '/browse/my-list'
    }
}