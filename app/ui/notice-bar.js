class NoticeBar extends BottomBar {
    constructor(notice, barId, settingName) {
        super();
        this.notice = notice;
        this.barId = barId;
        this.settingName = settingName;
    }

    createBar() {
        let bar = document.createElement('div');
        bar.id = this.barId;
        bar.classList.add('gamepad-interface-notice-bar');
        bar.insertAdjacentHTML('afterbegin', this.notice);
        let dismissLinks = document.createElement('div');
        dismissLinks.classList.add('gamepad-interface-notice-bar-links');
        bar.append(dismissLinks);
        let dismissLink = document.createElement('a');
        dismissLink.classList.add('gamepad-interface-notice-bar-link');
        dismissLink.textContent = 'Dismiss';
        dismissLink.addEventListener('click', () => this.remove());
        dismissLinks.append(dismissLink);
        let dismissForeverLink = document.createElement('a');
        dismissForeverLink.classList.add('gamepad-interface-notice-bar-link');
        dismissForeverLink.textContent = 'Never show again';
        dismissForeverLink.addEventListener('click', () => this.removeForever());
        dismissLinks.append(dismissForeverLink);
        return bar;
    }

    removeForever() {
        this.remove();
        chrome.storage.local.set({ [this.settingName]: false });
    }
}