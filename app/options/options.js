const manifest = chrome.runtime.getManifest();
document.getElementById('extension-name').textContent = manifest.name;

let dependencies = {};
let liveSettings = {
    'sync': {},
    'local': {}
};

for (let setting of SETTINGS) {
    for (let option of setting.options) {
        insertOptionControl(option);
    }
}

Object.keys(ALL_SETTING_KEYS).forEach(storageArea => {
    chrome.storage[storageArea].get(ALL_SETTING_KEYS[storageArea], items => {
        Object.assign(liveSettings[storageArea], items);
        updateDisplayedSettings(items);
    });
});

chrome.storage.onChanged.addListener((changes, storageArea) => {
    let items = {};
    Object.keys(changes).forEach(key => items[key] = changes[key].newValue);
    Object.assign(liveSettings[storageArea], items);
    updateDisplayedSettings(items);
});

function updateDisplayedSettings(items) {
    for (let key in items) {
        document.getElementById(key).setValue(items[key]);
    }
    // resolve values before resolving dependencies
    for (let key in items) {
        checkDependencies(key);
    }
}

function checkDependencies(controlKey) {
    let shouldEnable = true;
    if (controlKey in dependencies) {
        let controlDependencies = dependencies[controlKey];
        for (let key in controlDependencies) {
            if (document.getElementById(key).getValue() !== controlDependencies[key]) {
                shouldEnable = false;
                break;
            }
        }
        enableControl(controlKey, shouldEnable);
    }
}

function enableControl(controlKey, enabled) {
    document.getElementById(controlKey).disabled = !enabled;
    let label = document.querySelector('.label[for=' + controlKey + ']');
    if (enabled) {
        label.classList.remove('disabled');
    } else {
        label.classList.add('disabled');
    }
}

function insertOptionControl(option) {
    let container = document.getElementById('settings');
    let label = document.createElement('label');
    label.classList.add('label');
    label.textContent = option.label;
    label.htmlFor = option.name;
    container.append(label);
    let controlDiv = document.createElement('div');
    controlDiv.classList.add('control');
    let control = null;
    if (option.type === 'checkbox') {
        control = createCheckbox(option);
    } else if (option.type === 'combobox') {
        control = createCombobox(option);
    }
    controlDiv.append(control);
    container.append(controlDiv);
    if (option.condition) {
        dependencies[option.name] = {};
        for (let key in option.condition) {
            dependencies[option.name][key] = option.condition[key];
            document.getElementById(key).addEventListener('change', () => {
                // let shouldEnable = option.condition[key] === this.getValue();
                checkDependencies(option.name);
            });
        }
    }
}

function createCheckbox(option) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.name;
    checkbox.checked = option.default;
    checkbox.addEventListener('change', () => {
        chrome.storage[option.storageArea].set({ [option.name]: checkbox.checked });
    })
    checkbox.getValue = () => checkbox.checked;
    checkbox.setValue = value => checkbox.checked = value;
    return checkbox;
}

function createCombobox(option) {
    let combobox = document.createElement('select');
    combobox.id = option.name;
    for (let value of option.values) {
        let boxOption = document.createElement('option');
        boxOption.value = value;
        boxOption.textContent = value;
        if (value === option.default) {
            boxOption.selected = true;
        }
        combobox.append(boxOption);
    }
    combobox.addEventListener('change', () => {
        chrome.storage[option.storageArea].set({ [option.name]: combobox.value });
    });
    combobox.getValue = () => combobox.value;
    combobox.setValue = value => combobox.value = value;
    return combobox;
}