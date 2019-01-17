let currentHandler = null
const pageHandlers = [
    FeaturedBrowse,
    FeaturelessBrowse
]

// TODO: refresh page if ?so=su is in url? this seems to cause the page to not load
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
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
        if (index === 0) {
            currentHandler.onSelectAction()
        }
        let directionMap = {
            12: DIRECTION.UP,
            13: DIRECTION.DOWN,
            14: DIRECTION.LEFT,
            15: DIRECTION.RIGHT
        }
        if (index in directionMap) {
            currentHandler.onDirectionAction(directionMap[index])
        }
    })
    gamepad.addEventListener('joystickmove', (indices, values) => {
        checkJoystickDirection(gamepad, values[0], DIRECTION.RIGHT, DIRECTION.LEFT)
        checkJoystickDirection(gamepad, values[1], DIRECTION.DOWN, DIRECTION.UP)
    }, StandardMapping.Axis.JOYSTICK_LEFT)
})
gamepads.addEventListener('disconnect', gamepad => {
    console.log(`NETFLIX-CONTROLLER: Gamepad disconnected: ${gamepad.gamepad.id}`)
})
gamepads.start()

function checkJoystickDirection(gamepad, value, pos, neg) {
    if (Math.abs(value) >= 1 - gamepad.joystickDeadzone) {
        currentHandler.onDirectionAction(value > 0 ? pos : neg)
    }
}