class WatchVideo extends NavigatablePage {
    constructor() {
        super();
        this.inactivityTimer = null;
        this.postplay = false;
        this.hasInteractiveChoices = false;
        this.hasNextEpisode = true;
        this.hasSkipIntro = true;
        this.skipIntroAction = {
            label: 'Skip Intro',
            index: StandardMapping.Button.BUTTON_CONTROL_RIGHT,
            onPress: () => this.skipIntro()
        };
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
        this.observeInteractiveChoices();
        this.setActivityTimer();
        this.checkPageForInteractiveControls();
    }

    unload() {
        this.controlObserver.disconnect();
        this.interactiveObserver.disconnect();
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

    observeInteractiveChoices() {
        this.interactiveObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                this.checkForInteractiveControls(mutation.addedNodes, true);
                this.checkForInteractiveControls(mutation.removedNodes, false);
            }
        });
        let controls = this.player.querySelector('.PlayerControlsNeo__all-controls');
        this.interactiveObserver.observe(controls, { childList: true });
    }

    checkPageForInteractiveControls() {
        let controls = this.player.querySelector('.PlayerControlsNeo__all-controls');
        this.checkForInteractiveControls(controls.childNodes, true);
    }

    checkForInteractiveControls(nodeList, isAddedList) {
        for (let node of nodeList) {
            if (node.nodeType === 1 && node.classList.contains('main-hitzone-element-container')) {
                this.setInteractiveMode(isAddedList);
                return;
            }
        }
    }

    setInteractiveMode(interactive) {
        if (interactive) {
            actionHandler.removeAll(this.getActions());
            this.addNavigatable(0, new InteractiveChoices(this.dispatchKey.bind(this)));
            this.setNavigatable(0);
            this.setActivityTimer();
            this.hasInteractiveChoices = true;
        } else {
            this.hasInteractiveChoices = false;
            actionHandler.addAll(this.getActions());
            this.removeNavigatable(0);
        }
    }

    hideControls(inactive) {
        if (inactive) {
            BottomBar.container.hide();
        } else {
            BottomBar.container.show();
        }
    }

    showNextEpisode(visible) {
        this.hasNextEpisode = visible;
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
        this.hideControls(false);
        this.inactivityTimer = setTimeout(() => {
            if (this.hasInteractiveChoices) {
                // keep the controls visible while choices are present
                this.setActivityTimer();
            } else {
                this.hideControls(true);
                this.inactivityTimer = null;
            }
        }, 5000);
    }

    onInput() {
        this.setActivityTimer();
    }

    getActions() {
        if (this.hasInteractiveChoices) {
            return [];
        }
        let actions = this.getDefaultActions();
        if (this.hasNextEpisode) {
            actions.push(this.nextEpisodeAction);
        }
        if (this.hasSkipIntro) {
            actions.push(this.skipIntroAction);
        }
        return actions;
    }

    getDefaultActions() {
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
            }
        ];
    }

    onDirectionAction(direction) {
        // override default direction navigation to do nothing unless interactive
        if (this.hasInteractiveChoices) {
            super.onDirectionAction(direction);
        }
    }

    setNavigatable(position) {
        if (position === 0) {
            super.setNavigatable(position);
        }
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

    dispatchKey(keyCode, isKeyDown=true) {
        let event = new KeyboardEvent(isKeyDown ? 'keydown' : 'keyup', {
            key: String.fromCharCode(keyCode),
            keyCode: keyCode, bubbles: true, cancelable: true, view: window
        });
        this.player.dispatchEvent(event);
    }
}