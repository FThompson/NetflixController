const OPTIONS = [
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
    },
    {
        label: 'Show non-standard gamepad compatibility warning',
        name: 'showCompatibilityWarning',
        storageArea: 'local',
        type: 'checkbox',
        default: true
    }
];