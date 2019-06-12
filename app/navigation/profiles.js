class Profiles extends StaticNavigatable {
    getComponents() {
        return document.querySelectorAll('.choose-profile a.profile-link');
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
    }
}