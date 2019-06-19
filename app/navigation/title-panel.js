class TitlePanel extends StaticNavigatable {
    constructor(row) {
        super();
        this.row = row;
    }

    getPanelComponent() {
        throw new TypeError('must implement abstract TitlePanel#getPanelComponent');
    }

    getButtonSelector() {
        throw new TypeError('must implement abstract TitlePanel#getButtonSelector');
    }

    getComponents() {
        let panel = this.getPanelComponent();
        let linkSelector = this.getButtonSelector();
        let iconSelector = linkSelector + ' .nf-icon-button';
        let flatSelector = linkSelector + ' .nf-flat-button';
        return panel.querySelectorAll(`${iconSelector}, ${flatSelector}`);
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