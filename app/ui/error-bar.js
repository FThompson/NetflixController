const ISSUES_URL = 'https://github.com/FThompson/NetflixController/issues';

class ErrorBar extends NoticeBar {
    constructor() {
        super('', 'gamepad-interface-warning-bar');
    }

    setError(error, timeout=-1) {
        if (this.removalTimer) {
            clearTimeout(this.removalTimer);
        }
        this.notice = `An error occurred: ${error}. You may need to refresh the page.`;
        if (timeout >= 0) {
            this.removalTimer = setTimeout(() => this.remove(), timeout);
        }
    }

    getLinks() {
        let reportIssue = this.createLink('Report issue');
        reportIssue.href = ISSUES_URL;
        return [ reportIssue ];
    }

    getPriority() {
        return 15;
    }
}