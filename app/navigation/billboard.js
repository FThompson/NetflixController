class Billboard extends StaticNavigatable {
    constructor(row) {
        super();
        this.row = row;
    }

    getComponents() {
        let selector = this.row !== undefined ? `#row-${this.row}` : '.billboard-row';
        let billboardParent = document.querySelector(selector);
        console.log(selector);
        console.log(billboardParent);
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