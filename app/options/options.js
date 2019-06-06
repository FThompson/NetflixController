const storage = LiveStorage;
const manifest = chrome.runtime.getManifest();
document.querySelectorAll('.extension-name').forEach(elem => {
    elem.textContent = manifest.name;
});
document.getElementById('extension-version').textContent = manifest.version;

let dependencies = {};

for (let option of OPTIONS) {
    insertOptionControl(option);
    storage.addListener(option.name, change => {
        updateDisplayedSetting(option.name, change.value);
    });
}
storage.load();

function updateDisplayedSetting(key, value) {
    document.getElementById(key).setValue(value);
    checkDependencies(key);
}

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
        storage[option.storageArea][option.name] = checkbox.checked;
        // chrome.storage[option.storageArea].set({ [option.name]: checkbox.checked });
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
        storage[option.storageArea][option.name] = combobox.value;
        // chrome.storage[option.storageArea].set({ [option.name]: combobox.value });
    });
    combobox.getValue = () => combobox.value;
    combobox.setValue = value => combobox.value = value;
    return combobox;
}