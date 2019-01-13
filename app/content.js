class NetflixController {
    constructor() {
        // this.row = 1
        // this.col = 0
        // this.slider = document.querySelector('#row-1 .slider-item-0')
        this.selectPosition(1, 0)
        // this.selectedElement = document.querySelector('#title-card-1-0 img.boxart-image')
        // selectElement(this.selectedElement)
    }

    selectPosition(row, col) {
        let element = document.querySelector(`#title-card-${row}-${col} img.boxart-image`)
        this.selectElement(element)
        this.row = row
        this.col = col
    }

    selectElement(element) {
        if (this.selectedElement) {
            let mouseout = new MouseEvent('mouseout', {bubbles: true})
            this.selectedElement.dispatchEvent(mouseout)
        }
        let mouseover = new MouseEvent('mouseover', {bubbles: true})
        element.dispatchEvent(mouseover)
        this.selectedElement = element
    }

    selectLeftElement() {
        // this.selectElement(this.s)
        this.selectPosition(this.row, this.col - 1)
    }

    selectRightElement() {
        this.selectPosition(this.row, this.col + 1)
    }
}

// class Slider {
//     constructor(element) {
//         this.slider = element
//     }

//     getCardElement() {
//         return this.slider
//     }
// }

controller = new NetflixController()
gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    gamepad.addEventListener('buttonrelease', (i) => {
        console.log('released button ' + i)
    })
    gamepad.addEventListener('buttonpress', (i) => {
        console.log('pressed ' + i)
        if (i == 14) {
            controller.selectLeftElement()
        } else if (i == 15) {
            controller.selectRightElement()
        }
    })
})
gamepads.start()

