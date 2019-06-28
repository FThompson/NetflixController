class Jawbone extends TitlePanel {
    constructor(row, jawbone, slider) {
        super(row);
        this.jawbone = jawbone;
        this.inline = jawbone !== undefined;
        this.slider = slider;
        if (this.slider) {
            this.slider.jawboneOpen = true;
        }
        this.closed = false;
        if (this.inline) {
            this.replaceInlineJawbone();
        }
        // TODO implement support for Jawbone menu navigation
        // this.initTabs();
        // this.nextTabAction = {
        //     label: 'Next Tab',
        //     index: StandardMapping.Button.BUMPER_RIGHT,
        //     onPress: () => this.selectTab(false)
        // };
        // this.prevTabAction = {
        //     label: 'Previous Tab',
        //     index: StandardMapping.Button.BUMPER_LEFT,
        //     onPress: () => this.selectTab(true)
        // }
    }

    static getJawbone(row, slider) {
        let rowNode = document.getElementById(`row-${row}`);
        if (rowNode) {
            let jawbone = rowNode.querySelector('.jawBoneContainer');
            if (jawbone) {
                return new Jawbone(row, jawbone, slider);
            }
        }
        return null;
    }

    initTabs() {
        this.tabPosition = -1;
        this.tabs = this.getPanelComponent().querySelectorAll('.menu > li');
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].classList.contains('current')) {
                this.tabPosition = i;
                return;
            }
        }
    }

    replaceInlineJawbone() {
        if (currentHandler.inlineJawbone) {
            currentHandler.removeNavigatable(currentHandler.inlineJawbone);
            if (this.row !== currentHandler.inlineJawbone.row) {
                currentHandler.inlineJawbone.slider.jawboneOpen = false;
                // used to update position properly when setting position in SliderBrowse
                this.replacedEarlierJawbone = this.row > currentHandler.inlineJawbone.row;
            }
        }
        currentHandler.inlineJawbone = this;
    }

    getActions() {
        let actions = super.getActions();
        if (this.inline) {
            actions.push({
                label: 'Close',
                index: StandardMapping.Button.BUTTON_LEFT,
                onPress: () => this.close()
            });
        }
        // if (this.tabPosition > 0) {
        //     actions.push(this.prevTabAction);
        // }
        // if (this.tabPosition < this.tabs.length - 1) {
        //     actions.push(this.nextTabAction);
        // }
        return actions;
    }

    enter(params) {
        if ('position' in params && !('sliderPosition' in this)) {
            // track parent slider position for when jawbone closes
            this.sliderPosition = params.position;
        }
        super.enter(params);
    }

    exit() {
        super.exit();
        let params = { jawboneRow: this.row };
        if ('sliderPosition' in this) {
            params.position = this.sliderPosition;
        }
        if (this.closed) {
            params.jawboneClosed = true;
        }
        return params;
    }

    close() {
        let button = this.jawbone.querySelector('.close-button');
        if (button) {
            button.click();
            this.closed = true;
            this.slider.jawboneOpen = false;
            currentHandler.removeCurrentNavigatable();
        }
    }

    // selectTab(left) {
    //     let newPosition = this.tabPosition + (left ? 1 : -1);
    //     this.tabs[newPosition].click();
    // }

    getPanelComponent() {
        if (!this.jawbone) {
            // the title jawbone should be the first and only jawbone in the page
            this.jawbone = document.querySelector('.jawBoneContainer');
        }
        return this.jawbone;
    }

    getButtonSelector() {
        return '.jawbone-actions';
    }
}