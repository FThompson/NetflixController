class ConnectionHintBar {
    constructor() {
        this.add();
    }

    createBar() {
        let bar = document.createElement('div');
        bar.id = 'gamepad-interface-connection-bar';
        bar.classList.add('gamepad-interface-bar');
        bar.insertAdjacentHTML('afterbegin', (`
            <span>
                No gamepad detected. If you are using a gamepad,
                try pressing any button or reconnecting your controller.
            </span>
        `));
        let dismissLinks = document.createElement('div');
        dismissLinks.id = 'gamepad-interface-connection-bar-links';
        bar.append(dismissLinks);
        let dismissLink = document.createElement('a');
        dismissLink.classList.add('gamepad-interface-connection-bar-link');
        dismissLink.textContent = 'Dismiss';
        dismissLink.addEventListener('click', () => this.remove());
        dismissLinks.append(dismissLink);
        let dismissForeverLink = document.createElement('a');
        dismissForeverLink.classList.add('gamepad-interface-connection-bar-link');
        dismissForeverLink.textContent = 'Never show again';
        dismissForeverLink.addEventListener('click', () => this.removeForever());
        dismissLinks.append(dismissForeverLink);
        return bar;
    }

    add() {
        if (!this.element) {
            this.element = this.createBar();
            document.body.append(this.element);
        }
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    removeForever() {
        this.remove();
        chrome.storage.local.set({ showConnectionHint: false });
    }
}