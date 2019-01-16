class FeaturelessBrowse extends SliderBrowse {
    async load() {
        console.log('um')
        await super.load()
        console.log(Slider.getSlider(0))
        this.addNavigatable(1, Slider.getSlider(0))
        this.setNavigatable(1)
    }

    static validatePath(path) {
        return path === '/browse/new-release' || path === '/browse/my-list'
    }
}