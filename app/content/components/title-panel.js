class TitlePanel extends StaticNavigatable {
    constructor(row) {
        super();
        this.row = row;
        let panel = this.getPanelComponent();
        let baseSelector = this.getButtonSelector();
        this.primaryButton = panel.querySelector(baseSelector + ' button.color-primary');
        this.secondaryButton = panel.querySelector(baseSelector + ' button.color-secondary');
    }

    getPanelComponent() {
        throw new TypeError('must implement abstract TitlePanel#getPanelComponent');
    }

    getButtonSelector() {
        throw new TypeError('must implement abstract TitlePanel#getButtonSelector');
    }

    getComponents() {
        return [this.primaryButton, this.secondaryButton];
    }

    interact(component) {
        if (component === this.secondaryButton) {
            component.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        } else {
            super.interact(component);
        }
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
    }
}