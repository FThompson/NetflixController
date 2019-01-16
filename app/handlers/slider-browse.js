class SliderBrowse extends NavigatablePage {
    constructor() {
        if (new.target === SliderBrowse) {
            throw new TypeError('cannot instantiate abstract SliderPage')
        }
        super()
    }

    isPageReady() {
        return document.querySelector('.mainView .rowContainer') !== null
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            let slider = Slider.getSlider(position - 1)
            this.addNavigatable(position, slider)
        }
        super.setNavigatable(position)
    }
}