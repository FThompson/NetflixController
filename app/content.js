let currentHandler = null
const pageHandlers = [
    FeaturedBrowse,
    SliderBrowse
]

// TODO: refresh page if ?so=su is in url? this seems to cause the page to not load
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    pageHandlers.forEach(handler => {
        if (handler.validatePath(request.path)) {
            console.log(`NETFLIX-CONTROLLER: Loading module for ${request.path}`)
            setTimeout(() => currentHandler = new handler(), 500) // delay to allow page to finish loading
        }
    })
})

let cssLink = document.createElement('link')
cssLink.href = chrome.runtime.getURL('app/content.css')
cssLink.rel = 'stylesheet'
cssLink.type = 'text/css'
document.head.prepend(cssLink)

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