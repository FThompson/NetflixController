class FeaturedBrowse extends SliderBrowse {
    async load() {
        await super.load()
        this.addNavigatable(1, new Billboard())
        this.addNavigatable(2, Slider.getSlider(1))
        this.setNavigatable(2)
    }

    static validatePath(path) {
        return path === '/browse' || path.startsWith('/browse/genre')
    }

    needsPseudoStyler() {
        return true
    }
}