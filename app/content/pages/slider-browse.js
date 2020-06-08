class SliderBrowse extends NavigatablePage {
    constructor(loadingRow) {
        if (new.target === SliderBrowse) {
            throw new TypeError('cannot instantiate abstract SliderPage');
        }
        super();
        this.loadingRow = loadingRow;
        this.currentRow = 0;
    }

    onLoad() {
        this.menu = new Menu();
        this.addNavigatable(0, this.menu);
    }

    setNavigatable(position) {
        if (position === this.position + 1) {
            // look for a jawbone if moving to the next navigatable below the current one
            // if a jawbone exists above the current nav, it will already exist in nav list
            let currentNav = this.navigatables[this.position];
            if (currentNav && currentNav.constructor.name === 'Slider') {
                if (!currentNav.jawboneOpen) {
                    // inline jawbone does not have its own row so we must check for it
                    let jawbone = Jawbone.getJawbone(currentNav.row, currentNav);
                    if (jawbone) {
                        if (jawbone.replacedEarlierJawbone) {
                            position--;
                        }
                        this.addNavigatable(position, jawbone);
                    }
                }
            }
        }
        if (!this.isNavigatable(position)) {
            // no jawbone found, check for other navigatables like slider/billboard
            let nextNav = this.getNextNavigatable();
            if (nextNav) {
                this.addNavigatable(position, nextNav);
            }
        }
        if (this.isNavigatable(position)) {
            super.setNavigatable(position);
        }
    }

    getNextNavigatable() {
        let currentNav = this.navigatables[this.position];
        if ('row' in currentNav) {
            let nextRow = currentNav.row + 1;
            let rowNode = document.getElementById(`row-${nextRow}`);
            if (rowNode) {
                if (rowNode.querySelector('.slider')) {
                    return new Slider(nextRow, rowNode);
                } else if (rowNode.querySelector('.billboard-title')) {
                    return new Billboard(nextRow);
                } else {
                    warn('unknown contents in row ' + nextRow);
                }
            }
        }
        return null;
    }

    // .mainView has additional children while loading, so wait until it has only 1.
    // additionally waits until the row content has loaded in by checking width.
    isPageReady() {
        if (keyboard) {
            return false;
        }
        let mainView = document.querySelector('.mainView');
        if (mainView && mainView.childElementCount === 1) {
            let row = document.querySelector(`#row-${this.loadingRow}`);
            return row ? row.getBoundingClientRect().width > 0 : false;
        }
        return false;
    }

    needsPseudoStyler() {
        return true;
    }

    hasSearchBar() {
        return true;
    }
}