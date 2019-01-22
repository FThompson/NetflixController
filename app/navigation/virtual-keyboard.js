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
        this.closed = false
    }

    static create(input, parent) {
        // non-class styling to avoid risking class conflict with page
        let keyboard = document.createElement('div')
        keyboard.style.position = 'absolute'
        keyboard.style.zIndex = '10000'
        keyboard.style.display = 'flex'
        keyboard.style.flexFlow = 'row wrap'
        keyboard.style.alignItems = 'stretch'
        keyboard.style.textAlign = 'center'
        keyboard.style.paddingTop = '4px'
        keyboard.style.paddingBottom = '4px'
        keyboard.style.backgroundColor = 'rgba(30, 30, 30, 0.8)'
        keyboard.style.border = '1px solid white'
        keyboard.style.borderTop = 'none'

        let appendKey = (text, widthPercent) => {
            let key = document.createElement('span')
            key.style.flexBasis = widthPercent + '%'
            key.style.display = 'flex'
            key.style.justifyContent = 'center'
            key.style.alignItems = 'center'
            key.innerHTML = text
            keyboard.append(key)
        }

        for (let x = 0; x < LAYOUT.length; x++) {
            for (let y = 0; y < LAYOUT[x].length; y++) {
                appendKey(LAYOUT[x][y], 10)
            }
        }

        for (let label in LAYOUT_BOTTOM) {
            appendKey(label, LAYOUT_BOTTOM[label] * 10)
        }

        let targetBounds = parent.getBoundingClientRect()
        keyboard.style.top = (targetBounds.top + targetBounds.height) + 'px'
        keyboard.style.width = (targetBounds.width - 2) + 'px'
        keyboard.style.height = (targetBounds.height * 4) + 'px'
        parent.append(keyboard)

        return new VirtualKeyboard(input, parent, keyboard)
    }

    insert() {
        
    }

    backspace() {

    }

    submit() {

    }

    close() {
        this.parent.removeChild(this.keyboard)
        this.closed = true
    }

    onAction(index) {
        if (index === StandardMapping.Button.BUTTON_TOP) {
            this.close()
        } else if (index === StandardMapping.Button.BUTTON_BOTTOM) {
            this.insert()
        } else if (index === StandardMapping.Button.BUTTON_RIGHT) {
            this.backspace()
        } else if (index === StandardMapping.Button.BUTTON_LEFT) {
            this.submit()
        }
    }

    onDirectionAction(direction) {

    }
}