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
    constructor(row) {
        this.row = document.querySelector(`#row-${row}`)
        let sliderItem = this.getItem(0)
        this.selectItem(sliderItem)
    }

    getItem(number) {
        return this.row.querySelector(`.slider-item-${number}`)
    }

    selectItem(sliderItem) {
        if (this.sliderItem) {
            let mouseout = new MouseEvent('mouseout', {bubbles: true})
            this.dispatchEvent(this.sliderItem, mouseout)
        }
        let mouseover = new MouseEvent('mouseover', {bubbles: true})
        // delay before sending mouseover necessary to avoid impacting animation
        setTimeout(() => this.dispatchEvent(sliderItem, mouseover), 100)
        this.sliderItem = sliderItem
    }

    dispatchEvent(slider, event) {
        slider.querySelector('img.boxart-image').dispatchEvent(event)
    }

    select(next) {
        let target = next ? this.sliderItem.nextElementSibling : this.sliderItem.previousElementSibling
        console.log(target)
        if (target) {
            let selected = false
            let targetSibling = next ? target.nextElementSibling : target.previousElementSibling
            if (targetSibling) {
                if (targetSibling.classList.contains('slider-item-')) {
                    this.shiftSlider(next)
                    setTimeout(() => {
                        this.selectItem(this.getShiftedItem(target))
                    }, 2000)
                    selected = true
                }
            }
            if (!selected) {
                this.selectItem(target)
            }
        } // else vibrate? cannot move slider
    }

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

    next() {
        this.select(true)
    }

    previous() {
        this.select(false)
    }

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

