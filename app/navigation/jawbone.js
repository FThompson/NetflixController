class Jawbone extends StaticNavigatable {
    constructor(inlineRow = -1) {
        super();
        this.inlineRow = inlineRow;
    }

    getComponents() {
        let selector = this.inlineRow != -1 ? `#row-${this.inlineRow}` : '.mainView';
        let jawboneParent = document.querySelector(selector);
        return jawboneParent.querySelectorAll('.jawbone-actions .nf-icon-button');
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