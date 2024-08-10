class StatusSheet extends SM.Sheet.StatusSheet {
    constructor() {
        super(SHEET_NAME.StatusSheet);
    }
    /**
     *
     *
     * @readonly
     * @static
     * @memberof StatusSheet
     * @returns {StatusSheet}
     */
    static get instance() {
        return SM.Utility.classInstance(StatusSheet);
    }

    setStatus(key, value, c, b) {
        super.setStatus(key, value, c, b);
    }
}
