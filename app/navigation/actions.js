class Action {
    constructor(label, index, onPress, onRelease) {
        this.label = label
        this.index = index
        this.onPress = onPress
        this.onRelease = onRelease
    }
}

class ActionHint {
    constructor(label, buttonImageSrc) {
        this.label = label
        this.buttonImageSrc = buttonImageSrc
    }

    createElement() {
        let span = document.createElement('span')
        let img = document.createElement('img')
        img.src = this.buttonImageSrc
        img.title = this.label
        span.append(img)
        let label = document.createTextNode(this.label)
        span.append(label)
        return span
    }
}

class ActionHandler {
    constructor(actions) {
        this.actions = new Map(actions.map(action => [action.index, action]))
        this.mappingNames = Object.keys(gamepadMappings.mappings)
        this.selectedMapping = null
    }

    addAction(action) {
        this.actions[action.index] = action
    }

    removeAction(action) {
        delete this.actions[action.index]
    }

    onButtonPress(index) {
        if (index in this.actions && this.actions[index].onPress) {
            this.actions[index].onPress()
        }
    }

    onButtonRelease(index) {
        if (index in this.actions && this.actions[index].onRelease) {
            this.actions[index].onRelease()
        }
    }

    selectMapping(mapping) {
        if (mapping in this.mappingNames) {
            this.selectedMapping = mapping
        }
    }
}