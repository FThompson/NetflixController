const manifest = chrome.runtime.getManifest();
document.getElementById('extension-name').textContent = manifest.name;

for (let setting of SETTINGS) {
    for (let option of setting.options) {
        insertOptionControl(option);
    }
}

let liveSettings = {
    'sync': {},
    'local': {}
};

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
}

function insertOptionControl(option) {
    let optionDiv = document.createElement('div');
    let label = document.createElement('label');
    label.textContent = option.label;
    label.for = option.name;
    if (option.type === 'checkbox') {
        optionDiv.append(createCheckbox(option));
        optionDiv.append(label);
    } else if (option.type === 'combobox') {
        optionDiv.append(label);
        optionDiv.append(createCombobox(option));
    }
    document.getElementById('settings').append(optionDiv);
}

function createCheckbox(option) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.name;
    checkbox.checked = option.default;
    checkbox.addEventListener('change', () => {
        chrome.storage[option.storageArea].set({ [option.name]: checkbox.checked });
    })
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
    combobox.setValue = value => combobox.value = value;
    return combobox;
}