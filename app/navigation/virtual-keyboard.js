const LAYOUT = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', "'"],
    ['\u21e7', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
]
const LAYOUT_BOTTOM = { 'space': 6, '\u232b': 2, 'close': 2 }

class VirtualKeyboard {
    constructor(input, parent, keyboard, keys) {
        this.input = input
        this.parent = parent
        this.keyboard = keyboard
        this.keys = keys
        this.closed = false
        this.toggleShift(true) // first letter upper case
        this.select('A')
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

        let keys = {}
        let appendKey = (text, widthPercent) => {
            let key = document.createElement('span')
            key.style.flexBasis = widthPercent + '%'
            // flex container properties to vertically center text
            key.style.display = 'flex'
            key.style.justifyContent = 'center'
            key.style.alignItems = 'center'
            key.innerHTML = text
            keyboard.append(key)
            keys[text] = key
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

        return new VirtualKeyboard(input, parent, keyboard, keys)
    }

    select(key) {
        if (this.selected) {
            this.keys[this.selected].style.backgroundColor = ''
        }
        this.keys[key].style.backgroundColor = 'rgba(229, 9, 20)'
        this.selected = key
    }

    insert() {
        if (this.selected === '\u21e7') {
            this.toggleShift()
        } else if (this.selected === '\u232b') {
            this.backspace()
        } else if (this.selected === 'close') {
            this.close()
        } else {
            if (this.selected === 'space') {
                this.insertSpace()
            } else {
                let insertion = this.selected.toLowerCase()
                if (this.shift) {
                    insertion = insertion.toUpperCase()
                    this.toggleShift(false)
                }
                this.input.value += insertion
            }
            this.dispatchInputChangeEvent()
        }
    }

    insertSpace() {
        this.input.value += ' '
        this.dispatchInputChangeEvent()
        this.toggleShift(true)
    }

    backspace() {
        if (this.input.value.length > 0) {
            this.input.value = this.input.value.substring(0, this.input.value.length - 1)
            this.dispatchInputChangeEvent()
        }
    }

    toggleShift(force) {
        this.shift = force !== undefined ? force : !this.shift
        for (let key in this.keys) {
            if (key.length === 1) {
                let letter = this.keys[key].innerHTML
                this.keys[key].innerHTML = this.shift ? letter.toUpperCase() : letter.toLowerCase()
            }
        }
    }

    dispatchInputChangeEvent() {
        this.input.dispatchEvent(new Event('change', { 'bubbles': true }))
    }

    clear() {
        this.parent.querySelector('.icon-close').click()
    }

    close() {
        this.input.blur()
        this.parent.removeChild(this.keyboard)
        this.closed = true
    }

    onAction(index) {
        if (index === StandardMapping.Button.BUTTON_TOP) {
            this.insertSpace()
        } else if (index === StandardMapping.Button.BUTTON_BOTTOM) {
            this.insert()
        } else if (index === StandardMapping.Button.BUTTON_RIGHT) {
            this.backspace()
        } else if (index === StandardMapping.Button.BUTTON_LEFT) {
            this.toggleShift()
        } else if (index === StandardMapping.Button.BUTTON_CONTROL_RIGHT) {
            this.close()
        } else if (index === StandardMapping.Button.BUTTON_CONTROL_LEFT) {
            this.clear()
        }
    }

    onDirectionAction(direction) {
        let options = this.getAdjacentKeys()
        if (direction in options) {
            this.select(options[direction])
        }
    }

    // TODO: rewrite to only retrieve the requested direction
    getAdjacentKeys() {
        for (let y = 0; y < LAYOUT.length; y++) {
            for (let x = 0; x < LAYOUT[y].length; x++) {
                if (LAYOUT[y][x] === this.selected) {
                    let options = {}
                    if (y > 0) {
                        options[DIRECTION.UP] = LAYOUT[y - 1][x]
                    }
                    if (y < LAYOUT.length - 1) {
                        options[DIRECTION.DOWN] = LAYOUT[y + 1][x]
                    } else if (y === LAYOUT.length - 1) {
                        let cumulativeX = 0
                        for (let key in LAYOUT_BOTTOM) {
                            cumulativeX += LAYOUT_BOTTOM[key]
                            if (x < cumulativeX) {
                                options[DIRECTION.DOWN] = key
                                break
                            }
                        }
                    }
                    if (x > 0) {
                        options[DIRECTION.LEFT] = LAYOUT[y][x - 1]
                    }
                    if (x < LAYOUT[y].length - 1) {
                        options[DIRECTION.RIGHT] = LAYOUT[y][x + 1]
                    }
                    return options
                }
            }
        }
        let cumulativeX = 0
        let bottomKeys = Object.keys(LAYOUT_BOTTOM)
        for (let x = 0; x < bottomKeys.length; x++) {
            if (bottomKeys[x] === this.selected) {
                let options = {}
                if (x > 0) {
                    options[DIRECTION.LEFT] = bottomKeys[x - 1]
                }
                if (x < bottomKeys.length - 1) {
                    options[DIRECTION.RIGHT] = bottomKeys[x + 1]
                }
                let upX = cumulativeX + Math.floor(LAYOUT_BOTTOM[bottomKeys[x]] / 2) - 1
                options[DIRECTION.UP] = LAYOUT[LAYOUT.length - 1][upX]
                return options
            }
            cumulativeX += LAYOUT_BOTTOM[bottomKeys[x]]
        }
        return null // should never reach this line
    }
}