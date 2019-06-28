const SHIFT = '\u21e7';
const BACKSPACE = '\u232b';
const LAYOUT = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', "'"],
    [SHIFT, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
];
const LAYOUT_BOTTOM = { 'space': 6, [BACKSPACE]: 2, 'close': 2 };

class VirtualKeyboard {
    constructor(input, parent, keyboard, keys, closeCallback) {
        this.input = input;
        this.parent = parent;
        this.keyboard = keyboard;
        this.keys = keys;
        this.closeCallback = closeCallback;
        this.toggleShift(true); // first letter upper case
        this.select('A');
        this.alignWithParent();
        this.resizeCallback = () => this.alignWithParent();
        window.addEventListener('resize', this.resizeCallback);
    }

    static create(input, parent, closeCallback) {
        let keyboard = document.createElement('div');
        keyboard.id = 'gamepad-interface-keyboard';

        let keys = {};
        let appendKey = (text, widthPercent) => {
            let key = document.createElement('span');
            key.classList.add('gamepad-interface-keyboard-key');
            key.style.flexBasis = widthPercent + '%';
            key.textContent = text;
            keyboard.append(key);
            keys[text] = key;
        };

        for (let x = 0; x < LAYOUT.length; x++) {
            for (let y = 0; y < LAYOUT[x].length; y++) {
                appendKey(LAYOUT[x][y], 10);
            }
        }

        for (let label in LAYOUT_BOTTOM) {
            appendKey(label, LAYOUT_BOTTOM[label] * 10);
        }

        parent.append(keyboard);

        return new VirtualKeyboard(input, parent, keyboard, keys, closeCallback);
    }

    alignWithParent() {
        // attach keyboard to bottom of search bar
        let targetBounds = this.parent.getBoundingClientRect();
        this.keyboard.style.top = (targetBounds.top + targetBounds.height) + 'px';

        // set keyboard minimum size to that of the search bar's width
        let searchWidth = targetBounds.width - 2;
        this.keyboard.style.minWidth = searchWidth + 'px';
        this.keyboard.style.minHeight = (searchWidth * 0.6) + 'px';

        // right-justify the keyboard's attachment to the search bar
        let keyboardWidth = parseFloat(window.getComputedStyle(this.keyboard).width);
        this.keyboard.style.marginLeft = (searchWidth - keyboardWidth) + 'px';
    }

    select(key) {
        if (this.selected) {
            this.keys[this.selected].classList.remove('gamepad-interface-selected-key');
        }
        this.keys[key].classList.add('gamepad-interface-selected-key');
        this.selected = key;
    }

    insert() {
        if (this.selected === SHIFT) {
            this.toggleShift();
        } else if (this.selected === BACKSPACE) {
            this.backspace();
        } else if (this.selected === 'close') {
            this.close();
        } else {
            if (this.selected === 'space') {
                this.insertSpace();
            } else {
                let insertion = this.selected.toLowerCase();
                if (this.shift) {
                    insertion = insertion.toUpperCase();
                    this.toggleShift(false);
                }
                this.input.value += insertion;
            }
            this.dispatchInputChangeEvent();
        }
    }

    insertSpace() {
        this.input.value += ' ';
        this.dispatchInputChangeEvent();
        this.toggleShift(true);
    }

    backspace() {
        if (this.input.value.length > 0) {
            let c = this.input.value[this.input.value.length - 1];
            this.input.value = this.input.value.substring(0, this.input.value.length - 1);
            this.dispatchInputChangeEvent();
            let isRemovedUpper = (c === c.toUpperCase()) && (c !== c.toLowerCase());
            this.toggleShift(isRemovedUpper);
        }
    }

    toggleShift(force) {
        this.shift = force !== undefined ? force : !this.shift;
        for (let key in this.keys) {
            if (key.length === 1) {
                let letter = this.keys[key].innerHTML;
                this.keys[key].innerHTML = this.shift ? letter.toUpperCase() : letter.toLowerCase();
            }
        }
    }

    dispatchInputChangeEvent() {
        this.input.dispatchEvent(new Event('change', { 'bubbles': true }));
    }

    clear() {
        this.parent.querySelector('.icon-close').click();
        this.toggleShift(true);
    }

    close() {
        this.input.blur();
        this.parent.removeChild(this.keyboard);
        window.removeEventListener('resize', this.resizeCallback);
        if (this.closeCallback) {
            this.closeCallback();
        }
    }

    getActions() {
        return [
            {
                label: 'Space',
                index: StandardMapping.Button.BUTTON_TOP,
                onPress: () => {
                    this.insertSpace();
                    this.pressKey('space');
                },
                onRelease: () => {
                    this.releaseKey('space');
                }
            },
            {
                label: 'Insert',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => {
                    this.insert();
                    this.pressKey(this.selected);
                },
                onRelease: () => {
                    this.releaseKey(this.pressed);
                }
            },
            {
                label: 'Backspace',
                index: StandardMapping.Button.BUTTON_RIGHT,
                onPress: () => {
                    this.backspace();
                    this.pressKey(BACKSPACE);
                },
                onRelease: () => {
                    this.releaseKey(BACKSPACE);
                }
            },
            {
                label: 'Shift',
                index: StandardMapping.Button.BUTTON_LEFT,
                onPress: () => {
                    this.toggleShift();
                    this.pressKey(SHIFT);
                },
                onRelease: () => {
                    this.releaseKey(SHIFT);
                }
            },
            {
                label: 'Close',
                index: StandardMapping.Button.BUTTON_CONTROL_RIGHT,
                onPress: () => {
                    this.close();
                    this.pressKey('close');
                },
                onRelease: () => {
                    this.releaseKey('close');
                }
            },
            {
                label: 'Clear',
                index: StandardMapping.Button.BUTTON_CONTROL_LEFT,
                onPress: () => {
                    this.clear();
                }
            }
        ];
    }

    pressKey(key) {
        this.pressed = key;
        this.keys[key].classList.add('gamepad-interface-pressed-key');
    }

    releaseKey(key) {
        this.keys[key].classList.remove('gamepad-interface-pressed-key');
    }

    onDirectionAction(direction) {
        let key = this.getAdjacentKey(direction);
        if (key) {
            this.select(key);
        }
    }

    getAdjacentKey(direction) {
        // standard keys
        for (let y = 0; y < LAYOUT.length; y++) {
            for (let x = 0; x < LAYOUT[y].length; x++) {
                if (LAYOUT[y][x] === this.selected) {
                    switch (direction) {
                        case DIRECTION.UP:
                            return y > 0 ? LAYOUT[y - 1][x] : null;
                        case DIRECTION.DOWN:
                            if (y < LAYOUT.length - 1) {
                                return LAYOUT[y + 1][x];
                            } else if (y === LAYOUT.length - 1) {
                                let cumulativeX = 0;
                                for (let key in LAYOUT_BOTTOM) {
                                    cumulativeX += LAYOUT_BOTTOM[key];
                                    if (x < cumulativeX) {
                                        return key;
                                    }
                                }
                            }
                            return null;
                        case DIRECTION.LEFT:
                            return x > 0 ? LAYOUT[y][x - 1] : null;
                        case DIRECTION.RIGHT:
                            return x < LAYOUT[y].length - 1 ? LAYOUT[y][x + 1] : null;
                    }
                }
            }
        }
        // bottom row keys
        let cumulativeX = 0;
        let bottomKeys = Object.keys(LAYOUT_BOTTOM);
        for (let x = 0; x < bottomKeys.length; x++) {
            if (bottomKeys[x] === this.selected) {
                switch (direction) {
                    case DIRECTION.UP:
                        let upX = cumulativeX + Math.floor(LAYOUT_BOTTOM[bottomKeys[x]] / 2) - 1;
                        return LAYOUT[LAYOUT.length - 1][upX];
                    case DIRECTION.DOWN:
                        return null;
                    case DIRECTION.LEFT:
                        return x > 0 ? bottomKeys[x - 1] : null;
                    case DIRECTION.RIGHT:
                        return x < bottomKeys.length - 1 ? bottomKeys[x + 1] : null;
                }
            }
            cumulativeX += LAYOUT_BOTTOM[bottomKeys[x]];
        }
        return null;
    }
}