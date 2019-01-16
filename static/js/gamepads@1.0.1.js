class GamepadHandler {
    constructor() {
        if (GamepadHandler._instance) {
            return GamepadHandler._instance
        }
        this.gamepads = {}
        this.paused = false
        this.callbacks = {
            'connect': [],
            'disconnect': []
        }
        GamepadHandler._instance = this
    }

    start() {
        this.paused = false
        this._run()
    }

    stop() {
        this.paused = true
    }

    poll() {
        // must call getGamepads() to force each gamepad object to update for some browsers (Chrome)
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : []
        let connectedIndices = []
        for (let index in gamepads) {
            let gamepad = gamepads[index]
            if (index && gamepad !== null) {
                if (gamepad.index !== undefined) {
                    if (gamepad.index in this.gamepads) {
                        this.gamepads[gamepad.index].update()
                    } else {
                        this.gamepads[gamepad.index] = new Gamepad(gamepad)
                        this.callbacks['connect'].forEach(callback => callback(this.gamepads[gamepad.index]))
                    }
                }
                connectedIndices.push(index)
            }
        }
        // check if any tracked gamepads are now absent/disconnected from the browser's gamepads
        for (let index in this.gamepads) {
            if (!connectedIndices.includes(index)) {
                this.gamepads[index]._last.connected = false
                this.callbacks['disconnect'].forEach(callback => callback(this.gamepads[index]))
                delete this.gamepads[index]
            }
        }
    }

    // connect: callback(gamepad)
    // disconnect: callback(gamepad)
    addEventListener(type, listener) {
        this.callbacks[type].push(listener)
    }

    removeEventListener(type, listener) {
        this.callbacks[type] = this.callbacks[type].filter(callback => callback !== listener)
    }

    _run() {
        if (!this.paused) {
            this.poll()
            requestAnimationFrame(() => this._run(this))
        }
    }
}

class Gamepad {
    constructor(gamepad) {
        this.gamepad = gamepad
        this.callbacks = {  // map required for array keys on joystick, used for convenience elsewhere
            'buttonpress': new Map(),
            'buttonrelease': new Map(),
            'buttonvaluechange': new Map(),
            'axischange': new Map(),
            'joystickmove': new Map()
        }
        this.deadzones = {}
        this._setLastValues()
    }

    _setLastValues() {
        this._last = {
            connected: this.gamepad.connected,
            axes: this.gamepad.axes.slice(),
            buttons: Object.keys(this.gamepad.buttons).map(i => {
                return {
                    'pressed': this.gamepad.buttons[i].pressed,
                    'value': this.gamepad.buttons[i].value
                }
            })
        }
    }

    get joystickDeadzone() {
        return this._deadzone || 0.10
    }

    set joystickDeadzone(deadzone) {
        this._checkDeadzone(deadzone)
        this._deadzone = deadzone
    }

    getAxisDeadzone(index) {
        return this.deadzones[index]
    }

    setAxisDeadzone(index, deadzone) {
        this._checkDeadzone(deadzone)
        this.deadzones[index] = deadzone
    }

    getButton(index) {
        return this.gamepad.buttons[i]
    }

    getAxis(index) {
        return this.gamepad.axes[i]
    }

    isConnected() {
        // uses _last so the value can be set from gamepads 'disconnect' event
        // necessary for browsers that do not automatically update gamepad values
        return this._last.connected
    }

    getMapping() {
        return this.gamepad.mapping
    }

    _checkDeadzone(deadzone) {
        if (deadzone >= 1.0 || deadzone < 0) {
            throw new Error('deadzone must be in range [0, 1)')
        }
    }

    update() {
        if (this.gamepad.connected && this._last.connected) {  // compare only against recent connected frame
            this._compareButtons(this.gamepad.buttons, this._last.buttons)
            this._compareAxes(this.gamepad.axes, this._last.axes)
            this._compareJoysticks(this.gamepad.axes, this._last.axes)
        }
        this._setLastValues()
    }

    _compareAxes(newAxes, oldAxes) {
        let callbackMap = this.callbacks['axischange']
        for (let i = 0; i < newAxes.length; i++) {
            let newValue = this._applyAxisDeadzone(newAxes[i], i)
            let oldValue = this._applyAxisDeadzone(oldAxes[i], i)
            if (newValue !== oldValue) {
                let callListener = callback => callback(i, newAxes[i])
                if (callbackMap.has(i)) {
                    callbackMap.get(i).forEach(callListener)  // specific listeners
                }
                if (callbackMap.has(-1)) {
                    callbackMap.get(-1).forEach(callListener)  // non-specific listeners
                }
            }
        }
    }

    _compareJoysticks(newAxes, oldAxes) {
        this.callbacks['joystickmove'].forEach((callbacks, indices) => {
            let newHorizontal = this._applyJoystickDeadzone(newAxes[indices[0]])
            let newVertical = this._applyJoystickDeadzone(newAxes[indices[1]])
            let oldHorizontal = this._applyJoystickDeadzone(oldAxes[indices[0]])
            let oldVertical = this._applyJoystickDeadzone(oldAxes[indices[1]])
            if (newHorizontal !== oldHorizontal || newVertical !== oldVertical) {
                callbacks.forEach(callback => {
                    return callback(indices, [newHorizontal, newVertical])
                })
            }
        })
    }

    _applyJoystickDeadzone(value) {
        return this._applyDeadzone(value, this.joystickDeadzone)
    }

    _applyAxisDeadzone(value, index) {
        return index in this.deadzones ? this._applyDeadzone(value, this.deadzones[index]) : value
    }

    _applyDeadzone(value, deadzone) {
        return Math.abs(value) > deadzone ? value - Math.sign(value) * deadzone : 0
    }

    _compareButtons(newValues, oldValues) {
        this._checkButtons(this.callbacks['buttonpress'], newValues, oldValues, (nv, ov) => nv.pressed && !ov.pressed)
        this._checkButtons(this.callbacks['buttonrelease'], newValues, oldValues, (nv, ov) => !nv.pressed && ov.pressed)
        this._checkButtons(this.callbacks['buttonvaluechange'], newValues, oldValues, (nv, ov) => nv.value !== ov.value, true)
    }

    _checkButtons(callbackMap, newValues, oldValues, predicate, passValue) {
        for (let i = 0; i < newValues.length; i++) {
            if (predicate(newValues[i], oldValues[i])) {
                let callListener = callback => passValue ? callback(i, newValues[i].value) : callback(i)
                if (callbackMap.has(i)) {
                    callbackMap.get(i).forEach(callListener)  // specific listeners
                }
                if (callbackMap.has(-1)) {
                    callbackMap.get(-1).forEach(callListener)  // non-specific listeners
                }
            }
        }
    }

    // event types: buttonpress, buttonrelease, buttonvaluechange, axischange, joystickmove
    // for buttonpress/buttonrelease, callback(i)
    // for buttonvaluechange event, callback(i, value)
    // for axischange event, callback(i, value)
    // for joystickmove event, index [indexH, indexV] and callback([indexH, indexV], [valueH, valueV])
    // specify index to track only a specific button
    addEventListener(type, listener, index=-1) {
        this._checkJoystickEvent(type, index)
        if (!this.callbacks[type].has(index)) {
            this.callbacks[type].set(index, [])
        }
        this.callbacks[type].get(index).push(listener)
    }
    
    removeEventListener(type, listener, index=-1) {
        this._checkJoystickEvent(type, index)
        let filtered = this.callbacks[type].get(index).filter(callback => callback !== listener)
        this.callbacks[type].set(index, filtered)
    }

    _checkJoystickEvent(type, index) {
        if (type === 'joystickmove' && !Array.isArray(index)) {
            throw new Error('joystickmove events require a two-length index array')
        }
    }
}

const StandardMapping = {
    Button: {
        BUTTON_BOTTOM: 0,
        BUTTON_RIGHT: 1,
        BUTTON_LEFT: 2,
        BUTTON_TOP: 3,
        BUMPER_LEFT: 4,
        BUMPER_RIGHT: 5,
        TRIGGER_LEFT: 6,
        TRIGGER_RIGHT: 7,
        BUTTON_CONTROL_LEFT: 8,
        BUTTON_CONTROL_RIGHT: 9,
        BUTTON_JOYSTICK_LEFT: 10,
        BUTTON_JOYSTICK_RIGHT: 11,
        D_PAD_UP: 12,
        D_PAD_BOTTOM: 13,
        D_PAD_LEFT: 14,
        D_PAD_RIGHT: 15,
        BUTTON_CONTROL_MIDDLE: 16,
    },

    // negative left and up, positive right and down
    Axis: {
        JOYSTICK_LEFT_HORIZONTAL: 0,
        JOYSTICK_LEFT_VERTICAL: 1,
        JOYSTICK_RIGHT_HORIZONTAL: 2,
        JOYSTICK_RIGHT_VERTICAL: 3,
        JOYSTICK_LEFT: [0, 1],
        JOYSTICK_RIGHT: [2, 3]
    }
}

const gamepads = new GamepadHandler()
