class SliderBrowse extends NavigatablePage {
    isPageReady() {
        return document.querySelector('.mainView .lolomo') !== undefined
    }

    static validatePath(path) {
        return path === '/browse/new-release' || path === '/browse/my-list'
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            let slider = Slider.getSlider(position - 1)
            this.addNavigatable(position, slider)
        }
        super.setNavigatable(position)
    }
}