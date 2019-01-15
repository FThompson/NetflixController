class FeaturedBrowse extends SliderBrowse {
    constructor() {
        super(1, new Billboard())
        this.addNavigatable(2, Slider.getSlider(1))
        // add browse navigatable @0 and feature navigatable @1
    }

    static validatePath(path) {
        return path === '/browse' || path.startsWith('/browse/genre')
    }
}