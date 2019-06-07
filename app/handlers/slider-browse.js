class SliderBrowse extends NavigatablePage {
    constructor(loadingRow) {
        if (new.target === SliderBrowse) {
            throw new TypeError('cannot instantiate abstract SliderPage')
        }
        super()
        this.loadingRow = loadingRow
    }

    onLoad() {
        this.menu = new Menu()
        this.addNavigatable(0, this.menu)
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            let nextRow = this.getNextNavigatable(position)
            if (nextRow) {
                this.addNavigatable(position, nextRow)
            }
        }
        super.setNavigatable(position)
    }

    getNextNavigatable(position) {
        let nextPosition = position - 1
        let rowNode = document.querySelector(`#row-${nextPosition}`)
        if (rowNode) {
            if (rowNode.querySelector('.slider')) {
                return new Slider(rowNode)
            } else if (rowNode.querySelector('.billboard-title')) {
                return new Billboard(nextPosition)
            } else {
                console.log('unknown contents in row ' + nextPosition)
            }
        }
        return null
    }

    isPageReady() {
        if (keyboard) {
            return false;
        }
        let row = document.querySelector(`#row-${this.loadingRow}`)
        return row ? row.getBoundingClientRect().width > 0 : false
    }

    needsPseudoStyler() {
        return true
    }

    hasSearchBar() {
        return true
    }
}