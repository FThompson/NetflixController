class NavigatablePage {
    constructor(startingNavPos, startingNav) {
        if (new.target === NavigatablePage) {
            throw new TypeError('cannot instantiate abstract PageHandler')
        }
        this.navigatables = {}
        this.addNavigatable(startingNavPos, startingNav)
        this.setNavigatable(startingNavPos)
    }

    // static validatePath(path) must be implemented by subclasses

    isNavigatable(position) {
        return position in this.navigatables
    }

    setNavigatable(position) {
        if (!this.isNavigatable(position)) {
            throw new Error('no navigatable at position ' + position)
        }
        let params = {}
        if (this.navigatables[this.position]) {
            let exitParams = this.navigatables[this.position].exit()
            if (exitParams) {
                params = exitParams
            }
        }
        this.navigatables[position].enter(params)
        this.position = position
    }

    addNavigatable(position, navigatable) {
        this.navigatables[position] = navigatable
    }

    onSelectAction() {
        this.navigatable.select()
    }

    onDirectionAction(direction) {
        if (direction === DIRECTION.UP) {
            if (this.position > 0) {
                this.setNavigatable(this.position - 1)
            }
        } else if (direction === DIRECTION.DOWN) {
            this.setNavigatable(this.position + 1)
        } else if (direction === DIRECTION.LEFT) {
            this.navigatables[this.position].left()
        } else if (direction === DIRECTION.RIGHT) {
            this.navigatables[this.position].right()
        }
    }
}