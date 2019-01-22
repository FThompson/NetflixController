const LAYOUT = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', "'"],
    ['\u21e7', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
]
const LAYOUT_BOTTOM = { 'space': 6, '\u232b': 2, 'go': 2 }

class VirtualKeyboard {
    constructor(input, parent, keyboard) {
        this.input = input
        this.parent = parent
        this.keyboard = keyboard
    }

    static create(input, parent) {
        // non-class styling to avoid risking class conflict with page
        let keyboard = document.createElement('div')
        keyboard.style.position = 'absolute'
        keyboard.style.height = '10em'
        keyboard.style.zIndex = '10000'
        keyboard.style.display = 'flex'
        keyboard.style.flexDirection = 'column'
        keyboard.style.justifyContent = 'space-between'
        keyboard.style.textAlign = 'center'
        keyboard.style.paddingTop = '8px'
        keyboard.style.paddingBottom = '8px'
        keyboard.style.backgroundColor = 'rgba(30, 30, 30, 0.8)'
        keyboard.style.border = '1px solid white'
        keyboard.style.borderTop = 'none'

        for (let x = 0; x < LAYOUT.length; x++) {
            let row = document.createElement('div')
            row.style.display = 'flex'
            row.style.justifyContent = 'space-between'
            for (let y = 0; y < LAYOUT[x].length; y++) {
                let key = document.createElement('span')
                key.style.flexBasis = '10%'
                key.innerHTML = LAYOUT[x][y]
                row.append(key)
            }
            keyboard.append(row)
        }

        let bottomRow = document.createElement('div')
        bottomRow.style.display = 'flex'
        bottomRow.style.justifyContent = 'space-between'
        for (let label in LAYOUT_BOTTOM) {
            let key = document.createElement('span')
            key.style.flexBasis = (LAYOUT_BOTTOM[label] * 10) + '%'
            key.innerHTML = label
            bottomRow.append(key)
        }
        keyboard.append(bottomRow)

        let targetBounds = parent.getBoundingClientRect()
        keyboard.style.top = (targetBounds.top + targetBounds.height) + 'px'
        keyboard.style.width = (targetBounds.width - 2) + 'px'
        parent.append(keyboard)

        return new VirtualKeyboard(input, parent, keyboard)
    }

    close() {
        this.parent.removeChild(this.keyboard)
    }
}