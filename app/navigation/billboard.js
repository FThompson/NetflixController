class Billboard extends StaticNavigatable {
    constructor(inlineRow = -1) {
        super();
        this.inlineRow = inlineRow;
    }

    getComponents() {
        let selector = this.inlineRow != -1 ? `#row-${this.inlineRow}` : '.billboard-row';
        let billboardParent = document.querySelector(selector);
        let linksDiv = billboardParent.querySelector('.billboard-links');
        let playLink = linksDiv.querySelector('a.playLink');
        let myList = linksDiv.querySelector('a.mylist-button');
        let moreInfo = linksDiv.querySelector('a.nf-icon-button[href^="/title/"]');
        return [
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
        ];
    }

    getInteractionComponent() {
        return this.getSelectedComponent().action;
    }

    getStyleComponent() {
        return this.getSelectedComponent().style;
    }

    style(component, selected) {
        this.styler.toggleStyle(component, ':hover', selected);
    }
}