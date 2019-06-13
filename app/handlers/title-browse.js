class TitleBrowse extends SliderBrowse {
    constructor() {
        super(0);
    }

    onLoad() {
        super.onLoad();
        this.addNavigatable(1, new Jawbone());
        this.addNavigatable(2, Slider.getSlider(0));
        this.setNavigatable(1);
    }

    static validatePath(path) {
        return path.startsWith('/title/');
    }

    // jawbone content loads after the rest of the page
    isPageReady() {
        return super.isPageReady() && document.querySelector('.jawbone-actions');
    }

    getNextNavigatable(position) {
        return super.getNextNavigatable(position - 1);
    }
}