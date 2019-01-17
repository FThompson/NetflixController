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
        this.menu = new Menu()
        this.addNavigatable(0, this.menu)
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            // TODO: detect big title item
            let slider = Slider.getSlider(position - 1)
            if (!slider) {
                console.log('slider nonexistent; doing nothing')
                return  // may have moved too fast; page needs to load
            }
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