class SliderPageHandler extends PageHandler {
    constructor(row) {
        super()
        this.row = row
        this.locked = false
        this.slider = new Slider(this.getRow(this.row), 0)
        this.sliders = {}
        this.sliders[this.row] = this.slider
    }

    onSelectAction() {

    }

    onDirectionAction(direction) {
        if (direction === DIRECTION.UP) {
            this.selectSlider(false)
        } else if (direction === DIRECTION.DOWN) {
            this.selectSlider(true)
        } else if (direction === DIRECTION.LEFT) {
            this.slider.previous()
        } else if (direction === DIRECTION.RIGHT) {
            this.slider.next()
        }
    }

    getRow(row) {
        return document.querySelector(`#row-${row}`)
    }

    getSlider(row) {
        let slider;
        if (row in this.sliders) {
            slider = this.sliders[row]
        } else {
            let rowNode = this.getRow(row)
            if (rowNode) {
                slider = new Slider(rowNode)
                this.sliders[row] = slider
            }
        }
        return slider
    }

    selectSlider(next) {
        if (this.locked) {
            return
        }
        let slider = this.getSlider(this.row + (next ? 1 : -1))
        if (slider) {
            this.slider.unselect()
            // select the same position if possible, otherwise the right-most one
            let position = this.slider.position
            let found = false
            while (!found) {
                if (slider.hasPosition(position)) {
                    found = true
                } else {
                    position--
                }
            }
            slider.selectPosition(position)
            this.row = newRow
            this.slider = slider
        }
        this.locked = false
    }
}