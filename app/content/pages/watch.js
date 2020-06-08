class WatchVideo extends NavigatablePage {
    constructor() {
        super();
        this.inactivityTimer = null;
        this.postplay = false;
        this.hasInteractiveChoices = false;
        this.hasNextEpisode = true;
        this.hasSkipIntro = false;
        this.backAction = {
            label: 'Back',
            index: StandardMapping.Button.BUTTON_RIGHT,
            onPress: () => this.goBack()
        };
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
        this.showNextEpisode(this.player.classList.contains('nextEpisodeSeamless'));
        this.observePlayerState();
        this.observeSkipIntro();
        this.observeInteractiveChoices();
        this.setActivityTimer();
    }

    onUnload() {
        this.controlObserver.disconnect();
        this.skipObserver.disconnect();
        this.interactiveObserver.disconnect();
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        BottomBar.container.show();
        super.onUnload();
    }

    isPageReady() {
        return document.querySelector('.NFPlayer') !== null;
    }

    observePlayerState() {
        this.controlObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                this.hideControls(mutation.target.classList.contains('inactive'));
                this.showNextEpisode(mutation.target.classList.contains('nextEpisodeSeamless'));
            }
        });
        this.controlObserver.observe(this.player, { attributes: true, attributeFilter: [ 'class' ]});
    }

    observeSkipIntro() {
        let controls = this.player.querySelector('.PlayerControlsNeo__layout');
        this.checkForElementWithClass(controls.childNodes, true, 'skip-credits',
                () => this.showSkipIntro(true));
        this.skipObserver = this.watchForElementsWithClass(controls, false,
                'skip-credits', (found) => this.showSkipIntro(found));
    }

    observeInteractiveChoices() {
        let controls = this.player.querySelector('.PlayerControlsNeo__all-controls');
        this.interactiveObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                this.checkForElementMatchingSelector(mutation.addedNodes, true, '.BranchingInteractiveScene--wrapper', () => this.setInteractiveMode(true));
                this.checkForElementMatchingSelector(mutation.removedNodes, false, '.BranchingInteractiveScene--wrapper', () => this.setInteractiveMode(false));
                this.checkForElementMatchingSelector(mutation.addedNodes, true, '.SeamlessControls--container', () => this.setPostPlay(true));
                this.checkForElementMatchingSelector(mutation.removedNodes, false, '.SeamlessControls--container', () => this.setPostPlay(false));
            }
        });
        this.interactiveObserver.observe(controls, { childList: true });
    }

    watchForElementsWithClass(node, subtree, className, callback) {
        let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                this.checkForElementWithClass(mutation.addedNodes, true, className, callback);
                this.checkForElementWithClass(mutation.removedNodes, false, className, callback);
            }
        });
        observer.observe(node, { childList: true, subtree: subtree });
        return observer;
    }

    checkForElementWithClass(nodeList, isAddedList, className, callback) {
        for (let node of nodeList) {
            if (node.nodeType === 1 && node.classList.contains(className)) {
                callback(isAddedList);
                return;
            }
        }
    }

    checkForElementMatchingSelector(nodeList, isAddedList, selector, callback) {
        for (let node of nodeList) {
            if (node.nodeType == 1 && node.querySelector(selector)) {
                callback(isAddedList);
                return;
            }
        }
    }

    showSkipIntro(canSkip) {
        this.hasSkipIntro = canSkip;
        if (canSkip) {
            actionHandler.addAction(this.skipIntroAction);
        } else {
            actionHandler.removeAction(this.skipIntroAction);
        }
    }

    setPostPlay(postplay) {
        if (postplay) {
            actionHandler.removeAll(this.getActions());
            actionHandler.addAction(this.nextEpisodeAction);
            actionHandler.addAction(this.backAction);
            this.setActivityTimer();
            this.postplay = true;
        } else {
            this.postplay = false;
            actionHandler.removeAction(this.nextEpisodeAction);
            actionHandler.removeAction(this.backAction);
            actionHandler.addAll(this.getActions());
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
            this.backAction,
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
        this.clickControl('.button-nfplayerNextEpisode', 'button[data-uia="next-episode-seamless-button"]');
        //below only works once player is "ended" class
        //control.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    }

    skipIntro() {
        this.clickControl('.skip-credits > a');
    }

    goBack() {
        this.clickControl('.button-nfplayerBack', '.BackToBrowse');
    }

    clickControl(playerSelector, postplaySelector) {
        let control = null;
        if (this.postplay && postplaySelector) {
            control = document.querySelector(postplaySelector);
        } else {
            control = this.player.querySelector(playerSelector);
        }
        if (control) {
            control.click();
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