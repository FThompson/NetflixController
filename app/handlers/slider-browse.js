class SliderBrowse extends NavigatablePage {
    constructor(loadingRow) {
        if (new.target === SliderBrowse) {
            throw new TypeError('cannot instantiate abstract SliderPage')
        }
        super()
        this.loadingRow = loadingRow
    }

    async load() {
        await super.load()
        this.addNavigatable(0, new Menu())
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            // TODO: detect big title item
            let slider = Slider.getSlider(position - 1)
            this.addNavigatable(position, slider)
        }
        super.setNavigatable(position)
    }

    isPageReady() {
        let row = document.querySelector(`#row-${this.loadingRow}`)
        if (row) {
            return row.getBoundingClientRect().width > 0
        }
        return false
    }

    needsPseudoStyler() {
        return true
    }
}