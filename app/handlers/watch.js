class WatchVideo extends NavigatablePage {
    constructor() {
        super();
        this.inactivityTimer = null;
        this.postplay = false;
        this.nextEpisodeAction = {
            label: 'Next Episode',
            index: StandardMapping.Button.BUMPER_RIGHT,
            onPress: () => this.openNextEpisode()
        };
    }

    static validatePath(path) {
        return path.startsWith('/watch');
    }

    onLoad() {
        super.onLoad();
        this.player = document.querySelector('.NFPlayer');
        this.observePlayerState();
        this.setActivityTimer();
    }

    unload() {
        this.controlObserver.disconnect();
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        BottomBar.container.show();
        super.unload();
    }

    isPageReady() {
        return document.querySelector('.NFPlayer') !== null;
    }

    observePlayerState() {
        this.controlObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                this.postplay = mutation.target.classList.contains('postplay');
                this.hideControls(mutation.target.classList.contains('inactive'));
                this.showNextEpisode(mutation.target.classList.contains('nextEpisode'));
            }
        });
        this.controlObserver.observe(this.player, { attributes: true, attributeFilter: [ 'class' ]});
    }

    hideControls(inactive) {
        if (inactive) {
            BottomBar.container.hide();
        } else {
            BottomBar.container.show();
        }
    }

    showNextEpisode(visible) {
        if (visible) {
            actionHandler.addAction(this.nextEpisodeAction);
        } else {
            actionHandler.removeAction(this.nextEpisodeAction);
        }
    }

    setActivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        BottomBar.container.show();
        this.inactivityTimer = setTimeout(() => {
            BottomBar.container.hide();
            this.inactivityTimer = null;
        }, 5000);
    }

    onInput() {
        this.setActivityTimer();
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
            this.nextEpisodeAction,
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
        let nextEpisode = null;
        if (this.postplay) {
            nextEpisode = document.querySelector('.WatchNext-still-container');
        } else {
            nextEpisode = this.player.querySelector('.button-nfplayerNextEpisode');
        }
        if (nextEpisode) {
            nextEpisode.click();
        }
    }

    skipIntro() {
        let button = this.player.querySelector('.skip-credits > a');
        if (button) {
            button.click();
        }
    }

    dispatchKey(keyCode) {
        let event = new KeyboardEvent('keydown', {keyCode: keyCode, bubbles: true, cancelable: true, view: window});
        this.player.dispatchEvent(event);
    }
}