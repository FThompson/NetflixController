class ConnectionHintBar extends NoticeBar {
    constructor() {
        let notice = (`
            <span>
                No gamepad detected. If you are using a gamepad,
                try pressing any button or reconnecting your controller.
            </span>
        `);
        super(notice, 'gamepad-interface-connection-bar', 'showConnectionHint');
    }
}