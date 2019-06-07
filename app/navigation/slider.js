class Slider extends Navigatable {
    /**
     * Creates the Slider at the given row and selects the given position in it.
     */
    constructor(rowNode, position) {
        super()
        this.rowNode = rowNode
        if (position !== undefined) {
            this.selectPosition(position)
        }
        this.canShiftLeft = false
        this.locked = false
    }

    /**
     * Returns the slider at the given row if it exists.
     * Sets that slider to the given position or the right-most position if not possible.
     */
    static getSlider(row, position) {
        let rowNode = document.querySelector(`#row-${row}`)
        if (rowNode) {
            return new Slider(rowNode, position)
        }
        return null
    }

    /**
     * Selects the previous slider item.
     */
    left() {
        this.select(false)
    }

    /**
     * Selects the next slider item.
     */
    right() {
        this.select(true)
    }

    /**
     * Selects either this slider's first item or the item in the given position.
     */
    enter(params) {
        if ('position' in params) {
            let position = params.position
            if (this.canShiftLeft) {
                position++  // partially-visible left slider item takes up a position if present
            }
            let found = false
            while (!found) {
                if (this.hasPosition(position)) {
                    found = true
                } else {
                    position--
                }
            }
            this.selectPosition(position)
        } else {
            this.selectPosition(0)
        }
        this.scrollIntoView()
    }

    /**
     * Unselects this slider and returns its position.
     */
    exit() {
        this.unselect()
        let position = this.position
        if (this.canShiftLeft) {
            position--  // partially-visible left slider item takes up a position if present
        }
        return {position: position}
    }

    getActions() {
        return [
            {
                label: 'Play',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => this.clickHitzone('.bob-play-hitzone')
            },
            {
                label: 'Expand',
                index: StandardMapping.Button.BUTTON_LEFT,
                onPress: () => this.clickHitzone('.bob-jaw-hitzone')
            }
        ];
    }

    clickHitzone(selector) {
        let hitzone = document.querySelector(selector);
        if (hitzone) {
            hitzone.click();
        }
    }

    getBoxArtContainer() {
        let boxarts = this.sliderItem.querySelectorAll('div.boxart-container')
        // large title cards still have the small element; the last element is the larger one
        return boxarts[boxarts.length - 1]
    }
    
    /**
     * Scrolls the viewport to be centered vertically on this slider.
     */
    scrollIntoView() {
        Navigatable.scrollIntoView(this.getBoxArtContainer())
    }

    /**
     * Checks if this slider has the given position.
     */
    hasPosition(position) {
        return this.rowNode.querySelector(`.slider-item-${position}`) !== null
    }

    /**
     * Sends a mouseout event to the current item and a mouseover event to the item at the given position.
     * These events initiate the selection animation from one slider item to the next.
     */
    selectPosition(position) {
        this.locked = true
        this.unselect()
        let sliderItem = this.rowNode.querySelector(`.slider-item-${position}`)
        // delay before sending mouseover necessary to avoid impacting animation
        setTimeout(() => {
            Navigatable.mouseOver(this.getEventTarget(sliderItem))
            this.locked = false
        }, 100)
        this.sliderItem = sliderItem
        this.position = position
        let boxart = this.getBoxArtContainer()
        boxart.style.outline = '3px solid ' + getTransparentNetflixRed(0.7)
    }

    /**
     * Unselects the currently selected item.
     */
    unselect() {
        if (this.sliderItem) {
            Navigatable.mouseOut(this.getEventTarget(this.sliderItem))
            this.getBoxArtContainer().style.outline = '0'
        }
    }

    /**
     * Gets the given slider item's mouse event target.
     */
    getEventTarget(sliderItem) {
        return sliderItem.querySelector('img.boxart-image')
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
                        this.selectPosition(this.getShiftedPosition(target))
                        this.locked = false
                    }, 800)
                    selected = true
                }
            }
            if (!selected) {
                this.selectPosition(this.position + (next ? 1 : -1))
                selected = true
            }
        }
        return selected // if false, vibrate? cannot move slider
    }

    /**
     * Gets the target's shifted position.
     * If the target is at the beginning of the visible list, then its new position will be visibleCount - 2.
     * If the target is at the end of the visible list, then its new position will be 1.
     */
    getShiftedPosition(target) {
        let newPosition;
        let position = target.className[target.className.length - 1]
        if (position === '0') {
            let slider = this.rowNode.querySelector('.sliderContent')
            // count slider items ending in a number
            let visibleCount = Array.from(slider.childNodes).reduce((n, node) => {
                let lastChar = node.className[node.className.length - 1]
                return n + (lastChar >= '0' && lastChar <= '9')
            }, 0)
            newPosition = visibleCount - 2
        } else {
            newPosition = 1
        }
        return newPosition
    }

    /**
     * Shifts the slider forwards or backwards by clicking the proper control.
     */
    shiftSlider(next) {
        let handle = this.rowNode.querySelector('span.handle' + (next ? 'Next' : 'Prev'))
        handle.click()
        this.canShiftLeft = true
    }
}