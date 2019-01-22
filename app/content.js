let currentHandler = null
const pageHandlers = [
    FeaturedBrowse,
    FeaturelessBrowse,
    WatchVideo
]

// TODO: refresh page if ?so=su is in url? this seems to cause the page to not load
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    // TODO temp fix; need to properly handle virtual keyboard
    // maybe add Page#supportsKeyboard and maintain instance in content.js
    // and upon loading a module that doesnt support it (i.e. Watch), close it
    if (request.path.startsWith('/search')) return
    unload()
    refreshPageIfBad()
    for (let i = 0, found = false; !false && i < pageHandlers.length; i++) {
        if (pageHandlers[i].validatePath(request.path)) {
            console.log(`NETFLIX-CONTROLLER: Loading module for ${request.path}`)
            let asyncLoad = async () => await loadPage(pageHandlers[i])
            asyncLoad()
            found = true
        }
    }
})

async function loadPage(handlerClass) {
    currentHandler = new handlerClass()
    await currentHandler.load()
}

function unload() {
    if (currentHandler) {
        currentHandler.unload()
        currentHandler = null
    }
}

// pages containing ?so=su seem to often not load; remove it and refresh
function refreshPageIfBad() {
    if (window.location.href.includes('so=su')) {
        window.location.assign(window.location.href.replace('so=su', ''))
    }
}

console.log('NETFLIX-CONTROLLER: Listening for gamepad connections.')
gamepads.addEventListener('connect', gamepad => {
    console.log(`NETFLIX-CONTROLLER: Gamepad connected: ${gamepad.gamepad.id}`)
    gamepad.addEventListener('buttonpress', (index) => {
        if (index === StandardMapping.Button.BUTTON_CONTROL_LEFT) {
            unload()
            window.history.back()
        } else {
            let directionMap = {
                12: DIRECTION.UP,
                13: DIRECTION.DOWN,
                14: DIRECTION.LEFT,
                15: DIRECTION.RIGHT
            }
            if (index in directionMap) {
                currentHandler.onDirectionAction(directionMap[index])
            }
            currentHandler.onAction(index)
        }
    })
    gamepad.addEventListener('joystickmove', (indices, values) => {
        checkJoystickDirection(gamepad, indices[0], values[0], DIRECTION.RIGHT, DIRECTION.LEFT)
        checkJoystickDirection(gamepad, indices[1], values[1], DIRECTION.DOWN, DIRECTION.UP)
    }, StandardMapping.Axis.JOYSTICK_LEFT)
})
gamepads.addEventListener('disconnect', gamepad => {
    console.log(`NETFLIX-CONTROLLER: Gamepad disconnected: ${gamepad.gamepad.id}`)
})
gamepads.start()

// TODO: rethink this messy code; integrate rate limited polling into gamepads.js?
let timeouts = {}
let directions = {}

function checkJoystickDirection(gamepad, axis, value, pos, neg) {
    if (Math.abs(value) >= 1 - gamepad.joystickDeadzone) {
        let direction = value > 0 ? pos : neg
        if (!(axis in directions) || directions[axis] !== direction) {
            directions[axis] = direction
            rateLimitJoystickDirection(axis, 500)
        }
    } else {
        directions[axis] = -1
        if (axis in timeouts) {
            clearTimeout(timeouts[axis])
            delete timeouts[axis]
        }
    }
}

function rateLimitJoystickDirection(axis, rateMillis) {
    if (directions[axis] !== -1) {
        currentHandler.onDirectionAction(directions[axis])
        timeouts[axis] = setTimeout(() => rateLimitJoystickDirection(axis, rateMillis), rateMillis)
    }
}