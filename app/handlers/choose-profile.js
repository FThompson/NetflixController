class ChooseProfile extends NavigatablePage {
    static validatePath(path) {
        // can occur at any path; check for element
        return document.querySelector('.list-profiles') !== null;
    }

    hasPath() {
        return false;
    }

    onLoad() {
        this.addNavigatable(0, new Profiles());
        this.setNavigatable(0);
    }

    isPageReady() {
        return document.querySelector('.list-profiles') !== null;
    }

    needsPseudoStyler() {
        return true;
    }

    setNavigatable(position) {
        if (position === 0) {
            super.setNavigatable(position);
        }
    }
}