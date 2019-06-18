class ConnectionHintBar extends NoticeBar {
    constructor() {
        let notice = (`
            No gamepad detected. If you are using a gamepad,
            try pressing any button or reconnecting your controller.
        `);
        super(notice, 'gamepad-interface-connection-bar', 'showConnectionHint');
    }
}