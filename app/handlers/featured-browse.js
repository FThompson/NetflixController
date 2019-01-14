class FeaturedBrowse extends SliderPageHandler {
    constructor() {
        super(1)
    }

    static validatePath(path) {
        return path === '/browse' || path.startsWith('/browse/genre')
    }
}