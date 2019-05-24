const SETTINGS = [
    { // section
        // heading: 
        // description: 
        options: [
            {
                label: 'Show gamepad interaction hints',
                name: 'showActionHints',
                storageArea: 'sync',
                type: 'checkbox',
                default: true
            },
            {
                label: 'Gamepad button icon images',
                name: 'buttonImageMapping',
                storageArea: 'sync',
                type: 'combobox',
                values: [
                    'Xbox 360',
                    'Xbox One',
                    'PS3',
                    'PS4'
                ],
                default: 'Xbox One',
                condition: {
                    showActionHints: true
                }
            },
            {
                label: 'Show gamepad connection hint when no gamepad is connected',
                name: 'showConnectionHint',
                storageArea: 'local',
                type: 'checkbox',
                default: true
            }
        ]
    }
];

const ALL_SETTING_KEYS = getAllKeys();

function getAllKeys() {
    let keys = {
        'local': [],
        'sync': []
    };
    for (let section of SETTINGS) {
        for (let option of section.options) {
            keys[option.storageArea].push(option.name);
        }
    }
    return keys;
}