class Billboard extends Navigatable {
    constructor() {
        super()
        let linksDiv = document.querySelector('.billboard-links')
        this.playButton = linksDiv.querySelector('a.playLink > span')
        this.myListButton = linksDiv.querySelector('a.mylist-button')
    }
    
    left() {
        this.select(this.playButton)
    }

    right() {
        this.select(this.myListButton)
    }

    enter(params) {
        this.left()
    }

    exit() {
        this.unselect()
        this.selected = null
    }

    click() {

    }

    unselect() {
        if (this.selected) {
            this.selected.classList.toggle('billboardButtonHover')
        }
    }

    select(element) {
        if (element !== this.selected) {
            this.unselect()
            element.classList.toggle('billboardButtonHover')
            this.selected = element
            Navigatable.scrollIntoView(this.selected)
        }
    }
}