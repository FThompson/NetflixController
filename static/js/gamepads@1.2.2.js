const Gamepads = (() => {
    class GamepadHandler {
        constructor() {
            if (GamepadHandler._instance) {
                return GamepadHandler._instance
            }
            this.gamepads = {}
            this._paused = false
            this._callbacks = {
                'connect': [],
                'disconnect': []
            }
            this._supported = navigator.getGamepads !== undefined
            GamepadHandler._instance = this
        }
    
        get paused() {
            return this._paused
        }
    
        get supported() {
            return this._supported
        }
    
        start() {
            this._paused = false
            this._run()
        }
    
        stop() {
            this._paused = true
        }
    
        poll() {
            // must call getGamepads() to force each gamepad object to update for some browsers (Chrome)
            let gamepads = navigator.getGamepads ? [...navigator.getGamepads()] : []
            let connectedIndices = []
            for (let index in gamepads) {
                let gamepad = gamepads[index]
                if (index && gamepad !== null) {
                    if (gamepad.index !== undefined) {
                        if (gamepad.index in this.gamepads) {
                            this.gamepads[gamepad.index].update(gamepad)
                        } else {
                            this.gamepads[gamepad.index] = new Gamepad(gamepad)
                            let event = new GamepadConnectionEvent(this.gamepads[gamepad.index], 'connect')
                            event._dispatch(this._callbacks['connect'])
                        }
                    }
                    connectedIndices.push(index)
                }
            }
            // check if any tracked gamepads are now absent/disconnected from the browser's gamepads
            for (let index in this.gamepads) {
                if (!connectedIndices.includes(index)) {
                    this.gamepads[index]._last.connected = false
                    let event = new GamepadConnectionEvent(this.gamepads[index], 'disconnect')
                    event._dispatch(this._callbacks['disconnect'])
                    delete this.gamepads[index]
                }
            }
        }
    
        // connect: callback(gamepad)
        // disconnect: callback(gamepad)
        addEventListener(type, listener) {
            this._callbacks[type].push(listener)
        }
    
        removeEventListener(type, listener) {
            this._callbacks[type] = this._callbacks[type].filter(callback => callback !== listener)
        }
    
        _run() {
            if (this._supported && !this._paused) {
                this.poll()
                requestAnimationFrame(() => this._run(this))
            }
        }
    }
    
    class Gamepad {
        constructor(gamepad) {
            this.gamepad = gamepad
            this._callbacks = {  // map required for array keys on joystickmove, used for convenience elsewhere
                'buttonpress': new Map(),
                'buttonrelease': new Map(),
                'buttonvaluechange': new Map(),
                'axischange': new Map(),
                'joystickmove': new Map()
            }
            this._deadzones = {}
            this._setLastValues()
        }
    
        _setLastValues() {
            this._last = {
                connected: this.gamepad.connected,
                axes: this.gamepad.axes.slice(),
                buttons: Object.keys(this.gamepad.buttons).map(i => ({
                    'pressed': this.gamepad.buttons[i].pressed,
                    'value': this.gamepad.buttons[i].value
                }))
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
            return this._deadzones[index]
        }
    
        setAxisDeadzone(index, deadzone) {
            this._checkDeadzone(deadzone)
            this._deadzones[index] = deadzone
        }
    
        getButton(index) {
            return this.gamepad.buttons[index]
        }
    
        getAxis(index) {
            return this.gamepad.axes[index]
        }
    
        isConnected() {
            // uses _last so the value can be set from gamepads 'disconnect' event
            // necessary for browsers that do not automatically update gamepad values
            // return this._last.connected
            return this.gamepad.connected && this._last.connected;
        }
    
        getMapping() {
            return this.gamepad.mapping
        }
    
        _checkDeadzone(deadzone) {
            if (deadzone >= 1.0 || deadzone < 0) {
                throw new Error('deadzone must be in range [0, 1)')
            }
        }
    
        update(gamepad) {
            let updatesReferences = gamepad.timestamp === this.gamepad.timestamp
            let oldGamepad, newGamepad;
            if (!updatesReferences) {
                // chrome gamepad instances are snapshots
                oldGamepad = this.gamepad;
                newGamepad = gamepad;
                this.gamepad = gamepad;
            } else {
                // firefox gamepad instances are live objects
                oldGamepad = this._last;
                newGamepad = this.gamepad;
            }
            if (newGamepad.connected && oldGamepad.connected) {
                this._compareButtons(newGamepad.buttons, oldGamepad.buttons);
                this._compareAxes(newGamepad.axes, oldGamepad.axes);
                this._compareJoysticks(newGamepad.axes, oldGamepad.axes);
            }
            this._setLastValues();
        }
    
        _compareJoysticks(newAxes, oldAxes) {
            this._callbacks['joystickmove'].forEach((callbacks, indices) => {
                let newHorizontal = this._applyJoystickDeadzone(newAxes[indices[0]])
                let newVertical = this._applyJoystickDeadzone(newAxes[indices[1]])
                let oldHorizontal = this._applyJoystickDeadzone(oldAxes[indices[0]])
                let oldVertical = this._applyJoystickDeadzone(oldAxes[indices[1]])
                if (newHorizontal !== oldHorizontal || newVertical !== oldVertical) {
                    let event = new GamepadJoystickEvent(this, 'joystickmove', indices[0], indices[1], newHorizontal,
                                                         newVertical)
                    event._dispatch(callbacks)
                }
            })
        }
    
        _applyJoystickDeadzone(value) {
            return this._applyDeadzone(value, this.joystickDeadzone)
        }
    
        _applyAxisDeadzone(value, index) {
            return index in this._deadzones ? this._applyDeadzone(value, this._deadzones[index]) : value
        }
    
        _applyDeadzone(value, deadzone) {
            return Math.abs(value) > deadzone ? value - Math.sign(value) * deadzone : 0
        }
    
        _compareAxes(newAxes, oldAxes) {
            let callbackMap = this._callbacks['axischange']
            for (let i = 0; i < newAxes.length; i++) {
                let newValue = this._applyAxisDeadzone(newAxes[i], i)
                let oldValue = this._applyAxisDeadzone(oldAxes[i], i)
                if (newValue !== oldValue) {
                    let event = new GamepadValueEvent(this, 'axischange', i, newAxes[i])
                    this._dispatchEvent(event, callbackMap, i)
                }
            }
        }
    
        _compareButtons(newValues, oldValues) {
            this._checkButtons('buttonpress', newValues, oldValues, (nv, ov) => nv.pressed && !ov.pressed)
            this._checkButtons('buttonrelease', newValues, oldValues, (nv, ov) => !nv.pressed && ov.pressed)
            this._checkButtons('buttonvaluechange', newValues, oldValues, (nv, ov) => nv.value !== ov.value, true)
        }
    
        _checkButtons(eventType, newValues, oldValues, predicate) {
            let callbackMap = this._callbacks[eventType]
            for (let i = 0; i < newValues.length; i++) {
                if (predicate(newValues[i], oldValues[i])) {
                    let event = new GamepadValueEvent(this, eventType, i, newValues[i].value)
                    this._dispatchEvent(event, callbackMap, i)
                }
            }
        }
    
        _dispatchEvent(event, callbackMap, index) {
            if (callbackMap.has(index)) { // specific listeners
                event._dispatch(callbackMap.get(index))
            }
            if (callbackMap.has(-1)) { // non-specific listeners
                event._dispatch(callbackMap.get(-1))
            }
        }
    
        // event types: buttonpress, buttonrelease, buttonvaluechange, axischange, joystickmove
        // specify index to track only a specific button
        // joystickmove event requires a two-length array for index
        addEventListener(type, listener, index=-1) {
            this._checkJoystickEvent(type, index)
            if (!this._callbacks[type].has(index)) {
                this._callbacks[type].set(index, [])
            }
            this._callbacks[type].get(index).push(listener)
        }
        
        removeEventListener(type, listener, index=-1) {
            this._checkJoystickEvent(type, index)
            let filtered = this._callbacks[type].get(index).filter(callback => callback !== listener)
            this._callbacks[type].set(index, filtered)
        }
    
        _checkJoystickEvent(type, index) {
            if (type === 'joystickmove' && !Array.isArray(index)) {
                throw new Error('joystickmove events require a two-length index array')
            }
        }
    
        addJoystickEventListener(type, listener, horizontalIndex, verticalIndex) {
            this.addEventListener(type, listener, [horizontalIndex, verticalIndex])
        }
    
        removeJoystickEventListener(type, listener, horizontalIndex, verticalIndex) {
            this.removeEventListener(type, listener, [horizontalIndex, verticalIndex])
        }
    }
    
    // avoid naming collision with DOM GamepadEvent
    class _GamepadEvent {
        constructor(gamepad, type) {
            this.gamepad = gamepad
            this.type = type.toLowerCase()
            this._consumed = false
        }
    
        consume() {
            this._consumed = true
        }
    
        isConsumed() {
            return this._consumed
        }
    
        _dispatch(listeners) {
            for (let i = 0; i < listeners.length && !this.isConsumed(); i++) {
                listeners[i](this)
            }
        }
    }
    
    class GamepadConnectionEvent extends _GamepadEvent {
        constructor(gamepad, type) {
            super(gamepad, type)
        }
    }
    
    class GamepadValueEvent extends _GamepadEvent {
        constructor(gamepad, type, index, value) {
            super(gamepad, type)
            this.index = index
            this.value = value
        }
    }
    
    class GamepadJoystickEvent extends _GamepadEvent {
        constructor(gamepad, type, hIndex, vIndex, hValue, vValue) {
            super(gamepad, type)
            this.indices = [hIndex, vIndex]
            this.values = [hValue, vValue]
            this.horizontalIndex = hIndex
            this.verticalIndex = vIndex
            this.horizontalValue = hValue
            this.verticalValue = vValue
        }
    }
    
    return new GamepadHandler();
})();

// TODO: additional mappings with button names and images in gamepad-mappings.js
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
};

/**
 * Export the module (Node) or place it into the global scope (Browser).
 * 
 * This approach may not cover all use cases; see Underscore.js
 * or Q.js for more comprehensive approaches that could be used if needed.
 */
(function() {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports = Gamepads;
        module.exports.StandardMapping = exports.StandardMapping = StandardMapping;
    } else {
        let root = this || window;
        root.Gamepads = root.gamepads = Gamepads;
        root.StandardMapping = StandardMapping;
    }
})();
