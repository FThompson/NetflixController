class Billboard extends Navigatable {
    constructor() {
        super()
        let linksDiv = document.querySelector('.billboard-links')
        let playLink = linksDiv.querySelector('a.playLink')
        let myList = linksDiv.querySelector('a.mylist-button')
        this.buttons = {
            play: {
                action: playLink,
                style: playLink.firstElementChild
            },
            myList: {
                action: myList,
                style: myList
            }
        }
    }
    
    left() {
        this.select(this.buttons.play)
    }

    right() {
        this.select(this.buttons.myList)
    }

    enter(params) {
        this.left()
    }

    exit() {
        this.unselect()
        this.selected = null
    }

    doPrimaryAction() {
        this.selected.action.click()
    }

    unselect() {
        if (this.selected) {
            this.styler.toggleStyle(this.selected.style, ':hover')
        }
    }

    select(button) {
        if (button !== this.selected) {
            this.unselect()
            this.styler.toggleStyle(button.style, ':hover')
            this.selected = button
            Navigatable.scrollIntoView(this.selected.style)
        }
    }
}