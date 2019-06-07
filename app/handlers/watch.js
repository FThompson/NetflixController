class WatchVideo extends NavigatablePage {
    static validatePath(path) {
        return path.startsWith('/watch')
    }

    onLoad() {
        super.onLoad()
        this.player = document.querySelector('.NFPlayer')
    }

    isPageReady() {
        return document.querySelector('.NFPlayer') !== null
    }

    getActions() {
        return [
            {
                label: 'Play',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => this.dispatchKey(32)
            },
            {
                label: 'Mute',
                index: StandardMapping.Button.BUTTON_LEFT,
                onPress: () => this.dispatchKey(77)
            },
            {
                label: 'Fullscreen',
                index: StandardMapping.Button.BUTTON_TOP,
                onPress: () => chrome.runtime.sendMessage({ message: 'requestFullscreen' })
            },
            {
                label: 'Jump Back 10s',
                index: StandardMapping.Button.D_PAD_LEFT,
                onPress: () => this.dispatchKey(37)
            },
            {
                label: 'Jump 10s',
                index: StandardMapping.Button.D_PAD_RIGHT,
                onPress: () => this.dispatchKey(39)
            },
            {
                label: 'Volume Up',
                index: StandardMapping.Button.D_PAD_UP,
                onPress: () => this.dispatchKey(38)
            },
            {
                label: 'Volume Down',
                index: StandardMapping.Button.D_PAD_BOTTOM,
                onPress: () => this.dispatchKey(40)
            },
            {
                label: 'Next Episode',
                index: StandardMapping.Button.BUMPER_RIGHT,
                onPress: () => this.openNextEpisode()
            },
            {
                label: 'Skip Intro',
                index: StandardMapping.Button.BUTTON_CONTROL_RIGHT,
                onPress: () => this.skipIntro()
            }
        ];
    }

    onDirectionAction(direction) {
        // override default direction navigation to do nothing
    }

    openNextEpisode() {
        let button = this.player.querySelector('.button-nfplayerNextEpisode')
        button.click()
    }

    skipIntro() {
        let button = this.player.querySelector('.skip-credits > a')
        if (button) {
            button.click()
        }
    }

    dispatchKey(keyCode) {
        let event = new KeyboardEvent('keydown', {keyCode: keyCode, bubbles: true, cancelable: true, view: window})
        this.player.dispatchEvent(event)
    }
}