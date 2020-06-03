class FeaturelessBrowse extends PureSliderBrowse {
    constructor() {
        super(0);
    }

    static validatePath(path) {
        return path === '/browse/new-release' || path === '/browse/my-list';
    }
}