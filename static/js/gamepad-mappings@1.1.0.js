// untested
const PS3Mapping = {
    name: 'PS3',
    filePrefix: 'PS3_',
    buttons: [
        'Cross', 'Circle', 'Square', 'Triangle',
        'L1', 'R1', 'L2', 'R2',
        'Select', 'Start', 'Left_Stick', 'Right_Stick',
        'Dpad_Up', 'Dpad_Down', 'Dpad_Left', 'Dpad_Right'
    ]
}

// untested
const PS4Mapping = {
    name: 'PS4',
    filePrefix: 'PS4_',
    buttons: [
        'Cross', 'Circle', 'Square', 'Triangle',
        'L1', 'R1', 'L2', 'R2',
        'Share', 'Options', 'Left_Stick', 'Right_Stick',
        'Dpad_Up', 'Dpad_Down', 'Dpad_Left', 'Dpad_Right'
    ]
}

// untested
const Xbox360Mapping = {
    name: 'Xbox 360',
    filePrefix: '360_',
    buttons: [
        'A', 'B', 'X', 'Y',
        'LB', 'RB', 'LT', 'RT',
        'Back', 'Start', 'Left_Stick', 'Right_Stick',
        'Dpad_Up', 'Dpad_Down', 'Dpad_Left', 'Dpad_Right'
    ]
}

const XboxOneMapping = {
    name: 'Xbox One',
    filePrefix: 'XboxOne_',
    buttons: [
        'A', 'B', 'X', 'Y',
        'LB', 'RB', 'LT', 'RT',
        'Windows', 'Menu', 'Left_Stick', 'Right_Stick',
        'Dpad_Up', 'Dpad_Down', 'Dpad_Left', 'Dpad_Right'
    ]
}

const ALL_MAPPINGS = [ PS3Mapping, PS4Mapping, Xbox360Mapping, XboxOneMapping ]

// avoid naming collision with DOM's GamepadButton
class _GamepadButton {
    constructor(mappingName, buttonName, buttonImageSrc) {
        this.mappingName = mappingName
        this.buttonName = buttonName
        this.buttonImageSrc = buttonImageSrc
    }
}

class GamepadMappingHandler {
    constructor() {
        if (GamepadMappingHandler._instance) {
            return GamepadMappingHandler._instance
        }
        this.buttonsPath = '/buttons'
        this.mappings = {}
        for (let mapping of ALL_MAPPINGS) {
            this.mappings[mapping.name] = mapping
        }
        GamepadMappingHandler._instance = this
    }

    getButton(mappingName, index) {
        if (mappingName in this.mappings && index in this.mappings[mappingName].buttons) {
            let buttonName = this.mappings[mappingName].buttons[index]
            let buttonImageFile = this.mappings[mappingName].filePrefix + buttonName + '.png'
            let buttonImageSrc = this.buttonsPath + '/' + mappingName + '/' + buttonImageFile
            return new _GamepadButton(mappingName, buttonName, buttonImageSrc)
        }
        return null
    }
}

const gamepadMappings = new GamepadMappingHandler()