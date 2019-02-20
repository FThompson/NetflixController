const NETFLIX_RED = 'rgba(229, 9, 20)'

function getTransparentNetflixRed(opacity) {
    return NETFLIX_RED.replace(')', ', ' + opacity + ')')
}

let keyboard = null
let currentHandler = null
const pageHandlers = [
    ChooseProfile,
    FeaturedBrowse,
    FeaturelessBrowse,
    SearchBrowse,
    WatchVideo
]

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => runHandler(request.path))

function runHandler(path) {
    if (currentHandler) {
        currentHandler.unload()
        currentHandler = null
    }
    refreshPageIfBad()
    for (let i = 0, found = false; !found && i < pageHandlers.length; i++) {
        if (pageHandlers[i].validatePath(path)) {
            console.log(`NETFLIX-CONTROLLER: Loading ${pageHandlers[i].name} module for ${path}`)
            loadPage(pageHandlers[i])
            found = true
        }
    }
}

async function loadPage(handlerClass) {
    currentHandler = new handlerClass()
    if (!currentHandler.hasSearchBar()) {
        keyboard = null // does not call keyboard close callbacks but that is okay
    }
    await currentHandler.load()
}

// pages containing ?so=su seem to often not load; remove it and refresh
function refreshPageIfBad() {
    if (window.location.href.includes('so=su')) {
        window.location.assign(window.location.href.replace('so=su', ''))
    }
}

console.log('NETFLIX-CONTROLLER: Listening for gamepad connections.')
gamepads.addEventListener('connect', e => {
    console.log(`NETFLIX-CONTROLLER: Gamepad connected: ${e.gamepad.gamepad.id}`)
    e.gamepad.addEventListener('buttonpress', e => {
        if (keyboard) {
            sendButtonPress(e.index, keyboard)
            if (keyboard.closed) {
                keyboard = null
            }
        } else {
            if (e.index === StandardMapping.Button.BUTTON_RIGHT) {
                unload()
                window.history.back()
            } else if (e.index === StandardMapping.Button.BUTTON_TOP) {
                openSearch()
            } else {
                sendButtonPress(e.index, currentHandler)
            }
        }
    })
    e.gamepad.addEventListener('buttonrelease', e => {
        if (keyboard) {
            keyboard.onButtonRelease(e.index)
        }
    })
    e.gamepad.addEventListener('joystickmove', e => {
        checkJoystickDirection(gamepad, e.horizontalIndex, e.horizontalValue, DIRECTION.RIGHT, DIRECTION.LEFT)
        checkJoystickDirection(gamepad, e.verticalIndex, e.verticalValue, DIRECTION.DOWN, DIRECTION.UP)
    }, StandardMapping.Axis.JOYSTICK_LEFT)
})
gamepads.addEventListener('disconnect', e => {
    console.log(`NETFLIX-CONTROLLER: Gamepad disconnected: ${e.gamepad.gamepad.id}`)
})
gamepads.start()

function sendButtonPress(index, handler) {
    let directionMap = {
        12: DIRECTION.UP,
        13: DIRECTION.DOWN,
        14: DIRECTION.LEFT,
        15: DIRECTION.RIGHT
    }
    if (index in directionMap) {
        handler.onDirectionAction(directionMap[index])
    }
    handler.onAction(index)
}

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
        if (keyboard) {
            keyboard.onDirectionAction(directions[axis])
        } else {
            currentHandler.onDirectionAction(directions[axis])
        }
        timeouts[axis] = setTimeout(() => rateLimitJoystickDirection(axis, rateMillis), rateMillis)
    }
}

function openSearch() {
    let searchButton = document.querySelector('.searchTab')
    if (searchButton) {
        searchButton.click()
    }
    let searchInput = document.querySelector('.searchInput > input[type=text]')
    let searchParent = searchInput.parentElement.parentElement
    let startingLocation = window.location.href
    let handlerState = currentHandler.exit()
    keyboard = VirtualKeyboard.create(searchInput, searchParent, () => {
        if (window.location.href === startingLocation) {
            currentHandler.enter(handlerState)
        }
    })
}