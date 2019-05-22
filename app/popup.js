let style = window.getComputedStyle(document.body);
const CONTAINER_SIZE = parseFloat(style.getPropertyValue('--joystick-container-size'));
const DOT_SIZE = parseFloat(style.getPropertyValue('--joystick-size'));
const DOT_POSITION = (CONTAINER_SIZE - DOT_SIZE) / 2;

let count = 0;
let mapping = 'Xbox One';
let pressedButtons = {};

// disable gamepad input on page while popup is open
chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    let tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { message: 'disableGamepadInput' })
    window.addEventListener('blur', () => {
        chrome.tabs.sendMessage(tabId, { message: 'enableGamepadInput' });
    });
});

// load image mapping from synced storage
chrome.storage.sync.get('buttonImageMapping', result => {
    // TODO link this to controller id
    if (result.buttonImageMapping) {
        mapping = result.buttonImageMapping;
        document.getElementById('gamepad-mapping').value = result.buttonImageMapping;
    }
});

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    document.getElementById('count').textContent = ++count;
    checkCompatibility();
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
            StandardMapping.Axis.JOYSTICK_LEFT);
    e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
            StandardMapping.Axis.JOYSTICK_RIGHT);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
    document.getElementById('count').textContent = --count;
    checkCompatibility();
});

let mappingDropdown = document.getElementById('gamepad-mapping');
mappingDropdown.addEventListener('change', () => {
    mapping = mappingDropdown.value;
    chrome.storage.sync.set({ buttonImageMapping: mapping });
});

moveJoystick([0, 0], true);
moveJoystick([0, 0], false);
gamepadMappings.buttonsPath = '../static/buttons';
gamepads.start();

function showPressedButton(index) {
    if (!pressedButtons[index]) {
        let button = gamepadMappings.getButton(mapping, index);
        if (button) {
            let img = document.createElement('img');
            img.src = button.buttonImageSrc;
            img.alt = button.buttonName;
            document.getElementById('pressed-buttons').append(img);
            pressedButtons[index] = img;
        }
    }
}

function removePressedButton(index) {
    let img = pressedButtons[index];
    if (img) {
        img.parentNode.removeChild(img);
        delete pressedButtons[index];
    }
}

function moveJoystick(values, isLeft) {
    let id = (isLeft ? 'left' : 'right');
    let joystick = document.getElementById(id + '-joystick');
    let x = DOT_POSITION + CONTAINER_SIZE / 2 * values[0];
    let y = DOT_POSITION + CONTAINER_SIZE / 2 * values[1];
    joystick.style.top = y + 'px';
    joystick.style.left = x + 'px';
}

function checkCompatibility() {
    let warning = document.getElementById('no-standard-gamepad');
    if (!Object.values(gamepads.gamepads).some(g => g.gamepad.mapping === 'standard')) {
        warning.style.display = 'default';
    } else {
        warning.style.display = 'none';
    }
}