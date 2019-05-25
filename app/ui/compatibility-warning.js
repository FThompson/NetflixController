class CompatibilityWarningBar extends NoticeBar {
    constructor() {
        let notice = (`
            <span>
                No gamepad with a <a href='https://www.w3.org/TR/gamepad/#remapping' alt='Standard mapping'>
                standard mapping</a> found. Gamepad interface may not work as expected.
            </span>
        `);
        super(notice, 'gamepad-interface-compatibility-bar', 'showCompatibilityWarning');
    }

    getPriority() {
        return 10;
    }
}