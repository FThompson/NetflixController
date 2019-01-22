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
        return row ? row.getBoundingClientRect().width > 0 : false
    }

    needsPseudoStyler() {
        return true
    }

    onAction(index) {
        if (this.keyboard) {
            this.keyboard.onAction(index)
            if (this.keyboard.closed) {
                this.keyboard = null
            }
        } else {
            if (index === StandardMapping.Button.BUTTON_TOP) {
                this.openSearch()
            } else {
                // TODO: better to rewrite gamepads.js to have consumable GamepadEvents
                super.onAction(index)
            }
        }
    }

    onDirectionAction(direction) {
        if (this.keyboard) {
            this.keyboard.onDirectionAction(direction)
        } else {
            super.onDirectionAction(direction)
        }
    }

    openSearch() {
        let searchButton = document.querySelector('.searchTab')
        if (searchButton) {
            searchButton.click()
            let searchInput = document.querySelector('.searchInput > input[type=text]')
            this.keyboard = VirtualKeyboard.create(searchInput, searchInput.parentElement.parentElement)
        }
    }
}