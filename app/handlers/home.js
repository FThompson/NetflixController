class HomepageHandler extends SliderPageHandler {
    constructor() {
        super(1)
    }

    static validatePath(path) {
        return path === '/browse'
    }
}