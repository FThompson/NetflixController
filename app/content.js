class NetflixController {
    constructor() {
        this.slider = new Slider(1)
    }

    handleButtonPress(i) {
        if (i == 14) {
            controller.slider.previous()
        } else if (i == 15) {
            controller.slider.next()
        }
    }
}

class Slider {
    /**
     * Creates the Slider at the given row and selects the first item in it.
     */
    constructor(row) {
        this.row = document.querySelector(`#row-${row}`)
        let sliderItem = this.getItem(0)
        this.selectItem(sliderItem)
        this.locked = false
    }

    /**
     * Gets the slider item with the given number.
     */
    getItem(number) {
        return this.row.querySelector(`.slider-item-${number}`)
    }

    /**
     * Sends a mouseout event to the current item and a mouseover event to the given item.
     * These events initiate the selection animation from one slider item to the next.
     */
    selectItem(sliderItem) {
        this.locked = true
        if (this.sliderItem) {
            let mouseout = new MouseEvent('mouseout', {bubbles: true})
            this.dispatchEvent(this.sliderItem, mouseout)
        }
        let mouseover = new MouseEvent('mouseover', {bubbles: true})
        // delay before sending mouseover necessary to avoid impacting animation
        setTimeout(() => {
            this.dispatchEvent(sliderItem, mouseover)
            this.locked = false
        }, 100)
        this.sliderItem = sliderItem
    }

    /**
     * Dispatches the given event to the given slider's image.
     */
    dispatchEvent(slider, event) {
        slider.querySelector('img.boxart-image').dispatchEvent(event)
    }

    /**
     * Selects either the next or previous slider element, shifting the slider if necessary.
     */
    select(next) {
        if (this.locked) {
            return false // another interaction is in progress; do not initiate a new one
        }
        let selected = false
        let target = next ? this.sliderItem.nextElementSibling : this.sliderItem.previousElementSibling
        if (target) {
            let targetSibling = next ? target.nextElementSibling : target.previousElementSibling
            if (targetSibling) {
                if (targetSibling.classList.contains('slider-item-')) { // reached end of visible items
                    this.locked = true
                    this.shiftSlider(next)
                    setTimeout(() => {
                        this.selectItem(this.getShiftedItem(target))
                        this.locked = false
                    }, 800)
                    selected = true
                }
            }
            if (!selected) {
                this.selectItem(target)
                selected = true
            }
        }
        return selected // if false, vibrate? cannot move slider
    }

    /**
     * Gets the shifted target item.
     * If the target is at the beginning of the visible list, then its new position will be visibleCount - 2.
     * If the target is at the end of the visible list, then its new position will be 1.
     */
    getShiftedItem(target) {
        let newPosition;
        let position = target.className[target.className.length - 1]
        if (position === '0') {
            let slider = this.row.querySelector('.sliderContent')
            // count slider items ending in a number
            let visibleCount = Array.from(slider.childNodes).reduce((n, node) => {
                let lastChar = node.className[node.className.length - 1]
                return n + (lastChar >= '0' && lastChar <= '9')
            }, 0)
            newPosition = visibleCount - 2
        } else {
            newPosition = 1
        }
        return this.getItem(newPosition)
    }

    /**
     * Selects the next slider item.
     */
    next() {
        this.select(true)
    }

    /**
     * Selects the previous slider item.
     */
    previous() {
        this.select(false)
    }

    /**
     * Shifts the slider forwards or backwards by clicking the proper control.
     */
    shiftSlider(next) {
        let handle = this.row.querySelector('span.handle' + (next ? 'Next' : 'Prev'))
        handle.click()
    }
}

controller = new NetflixController()
gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    gamepad.addEventListener('buttonpress', controller.handleButtonPress)
})
gamepads.start()

