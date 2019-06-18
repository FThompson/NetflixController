class NoticeBar extends BottomBar {
    constructor(notice, barClass, settingName) {
        super();
        this.notice = notice;
        this.barClass = barClass;
        this.settingName = settingName;
        this.noticeElement = null;
    }

    // can be overriden by subclass to add additional right-justified links.
    // return an array of elements created through document.createElement
    getLinks() {
        return [];
    }

    createBar() {
        let bar = document.createElement('div');
        bar.classList.add(this.barClass);
        bar.classList.add('gamepad-interface-notice-bar');
        this.noticeElement = document.createElement('span');
        this.noticeElement.innerHTML = this.notice;
        bar.append(this.noticeElement);
        let links = document.createElement('div');
        links.classList.add('gamepad-interface-notice-bar-links');
        bar.append(links);
        for (let link of this.getLinks()) {
            links.append(link);
        }
        links.append(this.createLink('Dismiss', () => this.remove()));
        if (this.settingName) {
            // add remove forever option if linked to a configuration setting
            links.append(this.createLink('Never show again', () => this.removeForever()));
        }
        return bar;
    }

    createLink(text, onClickHandler) {
        let link = document.createElement('a');
        link.classList.add('gamepad-interface-notice-bar-link');
        link.textContent = text;
        link.alt = text;
        if (onClickHandler) {
            link.addEventListener('click', onClickHandler);
        }
        return link;
    }

    removeForever() {
        this.remove();
        storage.local[this.settingName] = false;
    }
}