class Profiles extends StaticNavigatable {
    getComponents() {
        return document.querySelectorAll('.choose-profile a.profile-link');
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
    }

    interact(component) {
        super.interact(component);
        runHandler(window.location.pathname, true);
    }
}