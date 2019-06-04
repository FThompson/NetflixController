const storage = LiveStorage;
const manifest = chrome.runtime.getManifest();
const NETFLIX_RED = 'rgba(229, 9, 20)';

function getTransparentNetflixRed(opacity) {
    return NETFLIX_RED.replace(')', ', ' + opacity + ')')
}

let buttonImageMapping = 'Xbox One';
gamepadMappings.buttonsPath = 'static/buttons';

let numGamepads = 0;
let hasConnectedGamepad = false;
let keyboard = null;
let currentHandler = null;
let actionHandler = new ActionHandler();
let connectionHintBar = new ConnectionHintBar();
let compatibilityWarning = new CompatibilityWarningBar();
const pageHandlers = [
    ChooseProfile,
    FeaturedBrowse,
    FeaturelessBrowse,
    SearchBrowse,
    WatchVideo
];

storage.addListener('showActionHints', showActionHints);
storage.addListener('buttonImageMapping', actionHandler.updateHints);
storage.addListener('showConnectionHint', showConnectionHint);
storage.addListener('showCompatibilityWarning', updateCompatibility);
storage.load();

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    if (request.message === 'locationChanged') {
        if (hasConnectedGamepad) {
            // load plugin core only if user is using gamepad in this session
            runHandler(request.path);
        }
    } else if (request.message === 'disableGamepadInput') {
        gamepads.stop();
    } else if (request.message === 'enableGamepadInput') {
        gamepads.start();
    }
});

async function runHandler(path) {
    unload()
    refreshPageIfBad()
    for (let i = 0, found = false; !found && i < pageHandlers.length; i++) {
        if (pageHandlers[i].validatePath(path)) {
            console.log(`NETFLIX-CONTROLLER: Loading ${pageHandlers[i].name} module for ${path}`)
            await loadPage(pageHandlers[i])
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

function showActionHints() {
    if (numGamepads > 0 && storage.sync.showActionHints) {
        actionHandler.showHints();
    } else {
        actionHandler.hideHints();
    }
}

function showConnectionHint() {
    if (numGamepads === 0 && storage.local.showConnectionHint) {
        connectionHintBar.add();
    } else {
        connectionHintBar.remove();
    }
}

function updateCompatibility() {
    if (storage.local.showCompatibilityWarning && !isStandardGamepadConnected()) {
        compatibilityWarning.add();
    } else {
        compatibilityWarning.remove();
    }
}

function isStandardGamepadConnected() {
    return Object.values(gamepads.gamepads).some(g => g.gamepad.mapping === 'standard');
}

console.log('NETFLIX-CONTROLLER: Listening for gamepad connections.')
gamepads.addEventListener('connect', e => {
    if (!hasConnectedGamepad) {
        // first connection, run current page handler manually
        runHandler(window.location.pathname);
        hasConnectedGamepad = true;
    }
    connectionHintBar.remove();
    numGamepads++;
    showActionHints();
    updateCompatibility();
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
            } else if (e.index === StandardMapping.Button.BUTTON_TOP && currentHandler.hasSearchBar()) {
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
        checkJoystickDirection(e.gamepad, e.horizontalIndex, e.horizontalValue, DIRECTION.RIGHT, DIRECTION.LEFT)
        checkJoystickDirection(e.gamepad, e.verticalIndex, e.verticalValue, DIRECTION.DOWN, DIRECTION.UP)
    }, StandardMapping.Axis.JOYSTICK_LEFT)
})
gamepads.addEventListener('disconnect', e => {
    numGamepads--;
    if (numGamepads === 0) {
        actionHandler.hideHints();
    }
    showConnectionHint();
    updateCompatibility();
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