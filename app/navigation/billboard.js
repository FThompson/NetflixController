class Billboard extends Navigatable {
    constructor(inlineRow=-1) {
        super();
        let billboardParent = document.querySelector(inlineRow != -1 ? `#row-${inlineRow}` : '.billboard-row');
        let linksDiv = billboardParent.querySelector('.billboard-links');
        let playLink = linksDiv.querySelector('a.playLink');
        let myList = linksDiv.querySelector('a.mylist-button');
        let moreInfo = linksDiv.querySelector('a.nf-icon-button[href^="/title/"]');
        console.log()
        this.position = -1;
        this.buttons = [
            {
                action: playLink,
                style: playLink.firstElementChild
            },
            {
                action: myList,
                style: myList
            },
            {
                action: moreInfo,
                style: moreInfo
            }
        ]
    }
    
    left() {
        if (this.position > 0) {
            this.select(this.position - 1);
        }
    }

    right() {
        if (this.position < this.buttons.length - 1) {
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
                onPress: () => this.buttons[this.position].action.click()
            }
        ];
    }

    unselect() {
        if (this.position >= 0) {
            this.styler.toggleStyle(this.buttons[this.position].style, ':hover');
        }
    }

    select(position) {
        this.unselect();
        this.position = position;
        this.styler.toggleStyle(this.buttons[this.position].style, ':hover');
        Navigatable.scrollIntoView(this.buttons[this.position].style);
    }
}