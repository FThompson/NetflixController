class Menu extends StaticNavigatable {
    getComponents() {
        return document.querySelectorAll('li.navigation-tab a');
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
        if (selected) {
            component.style.cssText = 'outline: 3px solid ' + getTransparentNetflixRed(0.7) + ' !important';
        } else {
            component.style.outline = '0';
        }
    }
}