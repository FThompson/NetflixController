class SliderBrowse extends NavigatablePage {
    constructor(startingRow) {
        if (new.target === SliderBrowse) {
            throw new TypeError('cannot instantiate abstract SliderPage')
        }
        super()
        this.startingRow = startingRow
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            let slider = Slider.getSlider(position - 1)
            this.addNavigatable(position, slider)
        }
        super.setNavigatable(position)
    }

    isPageReady() {
        let row = document.querySelector(`#row-${this.startingRow}`)
        if (row) {
            return row.getBoundingClientRect().width > 0
        }
        return false
    }
}