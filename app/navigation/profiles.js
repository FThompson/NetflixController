class Profiles extends Navigatable {
    constructor() {
        super();
        this.profiles = document.querySelectorAll('.choose-profile a.profile-link');
        this.position = -1;
    }

    left() {
        if (this.position > 0) {
            this.select(this.position - 1);
        }
    }

    right() {
        if (this.position < this.profiles.length - 1) {
            this.select(this.position + 1);
        }
    }

    enter(params) {
        this.select(0);
    }

    exit() {
        this.unselect();
        this.position = -1;
    }

    getActions() {
        return [
            {
                label: 'Select',
                index: StandardMapping.Button.BUTTON_BOTTOM,
                onPress: () => {
                    this.profiles[this.position].click();
                    this.unselect();
                }
            }
        ];
    }

    unselect() {
        if (this.position >= 0) {
            this.styler.toggleStyle(this.profiles[this.position], ':hover');
        }
    }

    select(position) {
        this.unselect();
        this.position = position;
        this.styler.toggleStyle(this.profiles[this.position], ':hover');
    }
}