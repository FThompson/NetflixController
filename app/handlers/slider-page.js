class SliderPageHandler extends PageHandler {
    constructor(row) {
        super()
        this.row = row
        this.slider = new Slider(this.row, 0)
    }

    onSelectAction() {

    }

    onDirectionAction(direction) {
        if (direction === DIRECTION.UP) {

        } else if (direction === DIRECTION.DOWN) {

        } else if (direction === DIRECTION.LEFT) {
            this.slider.previous()
        } else if (direction === DIRECTION.RIGHT) {
            this.slider.next()
        }
    }
}