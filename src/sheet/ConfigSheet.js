class ConfigSheet extends SM.Sheet.ConfigSheet {
    constructor() {
        super(SHEET_NAME.ConfigSheet, SpreadsheetApp.getActiveSpreadsheet().getId());
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof ConfigSheet
     * @returns {ConfigSheet}
     */
    static get instance() {
        return SM.Utility.classInstance(ConfigSheet);
    }

    getKey(key) {
        return super.getKey(key);
    }
}
