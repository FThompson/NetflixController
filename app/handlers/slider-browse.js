class SliderBrowse extends NavigatablePage {
    constructor(startingNavPos, startingNav) {
        let pos = startingNavPos !== undefined ? startingNavPos : 1
        let nav = startingNav !== undefined ? startingNav : Slider.getSlider(0, 0)
        super(pos, nav)
    }

    static validatePath(path) {
        return path === '/browse/new-release'
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            let slider = Slider.getSlider(position - 1)
            this.addNavigatable(position, slider)
        }
        super.setNavigatable(position)
    }
}