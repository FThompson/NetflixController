class FeaturelessBrowse extends SliderBrowse {
    constructor() {
        super(0)
    }

    async load() {
        await super.load()
        this.addNavigatable(1, Slider.getSlider(0))
        this.setNavigatable(1)
    }

    static validatePath(path) {
        return path === '/browse/new-release' || path === '/browse/my-list'
    }
}