class Jawbone extends StaticNavigatable {
    constructor(row, jawbone, slider) {
        super();
        this.row = row;
        this.jawbone = jawbone;
        this.inline = jawbone !== undefined;
        this.slider = slider;
        if (this.slider) {
            this.slider.jawboneOpen = true;
        }
        this.closed = false;
        if (this.inline) {
            if (currentHandler.inlineJawbone) {
                currentHandler.removeNavigatable(currentHandler.inlineJawbone);
                if (this.row !== currentHandler.inlineJawbone.row) {
                    currentHandler.inlineJawbone.slider.jawboneOpen = false;
                    this.replacedEarlierJawbone = this.row > currentHandler.inlineJawbone.row;
                }
            }
            currentHandler.inlineJawbone = this;
        }
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

    getActions() {
        let actions = super.getActions();
        if (this.inline) {
            actions.push({
                label: 'Close',
                index: StandardMapping.Button.BUTTON_LEFT,
                onPress: () => this.close()
            });
        }
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

    getComponents() {
        if (!this.jawbone) {
            // the title jawbone should be the first and only jawbone in the page
            this.jawbone = document.querySelector('.jawBoneContainer');
        }
        return this.jawbone.querySelectorAll('.jawbone-actions .nf-icon-button');
    }

    getInteractionComponent() {
        let component = this.getSelectedComponent();
        if (component.tagName === 'SPAN') {
            return component.parentElement;
        }
        return component;
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
    }
}