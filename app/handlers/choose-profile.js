class ChooseProfile extends NavigatablePage {
    static validatePath(path) {
        // can occur at any path
        return document.querySelector('.list-profiles') !== null
    }

    onLoad() {
        this.addNavigatable(0, new Profiles())
        this.setNavigatable(0)
    }

    isPageReady() {
        return document.querySelector('.list-profiles') !== null
    }

    needsPseudoStyler() {
        return true
    }

    setNavigatable(position) {
        if (position === 0) {
            super.setNavigatable(position)
        }
    }
}