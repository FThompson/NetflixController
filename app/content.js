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
        let slider = document.querySelector(`#row-${row} .slider-item-0`)
        this.selectSlider(slider)
    }

    selectSlider(slider) {
        if (this.slider) {
            let mouseout = new MouseEvent('mouseout', {bubbles: true})
            this.getEventElement(this.slider).dispatchEvent(mouseout)
            // setTimeout(100, () => this.slider.style.zIndex = '1')
        }
        let mouseover = new MouseEvent('mouseover', {bubbles: true})
        this.getEventElement(slider).dispatchEvent(mouseover)
        // setTimeout(100, () => slider.style.zIndex = '4')
        this.slider = slider
    }

    getEventElement(slider) {
        return slider.querySelector('img.boxart-image')
    }

    next() {
        if (this.slider.nextElementSibling) {
            this.selectSlider(this.slider.nextElementSibling)
        }
    }

    previous() {
        if (this.slider.previousElementSibling) {
            this.selectSlider(this.slider.previousElementSibling)
        } // else vibrate? cannot move slider
    }
}

controller = new NetflixController()
gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    gamepad.addEventListener('buttonpress', controller.handleButtonPress)
})
gamepads.start()

