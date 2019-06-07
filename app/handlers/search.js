class SearchBrowse extends FeaturelessBrowse {
    constructor() {
        super()
        this.loaded = false
        this.observeSearchResults()
    }

    static validatePath(path) {
        return path.startsWith('/search')
    }

    onLoad() {
        super.onLoad()
        this.observer.disconnect()
    }

    isPageReady() {
        return super.isPageReady() && this.loaded && keyboard === null;
    }

    // wait until search results are updated to load the page
    observeSearchResults() {
        let search = document.querySelector('.search')
        let _this = this
        let callback = mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    _this.loaded = true
                }
            }
        }
        this.observer = new MutationObserver(callback)
        this.observer.observe(search, { childList: true, subtree: true })
    }
}