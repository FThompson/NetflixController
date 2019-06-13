class StaticNavigatable extends Navigatable {
    constructor() {
        super();
        this.position = -1;
    }

    get components() {
        if (!this._components) {
            this._components = this.getComponents();
        }
        return this._components;
    }

    getComponents() {
        throw new TypeError('must implement abstract StaticNavigatable#getComponents');
    }

    getSelectedComponent() {
        return this.components[this.position];
    }

    // can be overriden for custom style component
    getStyleComponent() {
        return this.getSelectedComponent();
    }

    // can be overriden for custom interaction component
    getInteractionComponent() {
        return this.getSelectedComponent();
    }

    // can be overriden for custom interaction
    interact(component) {
        component.click();
    }

    // can be overriden for custom styling, such as with pseudo-styler
    style(component, selected) {

    }

    left() {
        if (this.position > 0) {
            this.select(this.position - 1);
        }
    }

    right() {
        if (this.position < this.components.length - 1) {
            this.select(this.position + 1);
        }
    }

    enter(params) {
        this.select(0);
    }

    exit() {
        this.unselect();
        this.position = -1;
    }

    getActions() {
        return [
            {
                label: 'Select',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => this.interact(this.getInteractionComponent())
            }
        ];
    }

    unselect() {
        if (this.position >= 0) {
            this.style(this.getStyleComponent(), false);
        }
    }

    select(position) {
        this.unselect();
        this.position = position;
        this.style(this.getStyleComponent(), true);
        Navigatable.scrollIntoView(this.getStyleComponent());
    }
}