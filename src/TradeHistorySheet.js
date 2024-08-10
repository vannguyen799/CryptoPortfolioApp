class TradeHistorySheet extends SM.Sheet.SheetManager {
    constructor() {
        super(SHEET_NAME.TradeHistorySheet);
    }
    /**
     *
     *
     * @readonly
     * @static
     * @memberof TradeHistorySheet
     * @returns {TradeHistorySheet}
     */
    static get instance() {
        return SM.Utility.classInstance(TradeHistorySheet);
    }

    activeLastRow() {
        console.log("activeLastRow TradeHistory");

        let dateCol = this.getColumnValues(this.sheetProperty.column.date);
        // TODO: fix +5, 5
        this.getRange(dateCol.length + 5, 5).activate();
    }
  
    get sheetProperty() {
        return {
            column: {
                index: "index",
                value: "value",
                type: "spend_type",
                spend_for: "spend_for",
                note: "note",
                date: "date",
                asset: "asset",
            },
            single_column: {},
        };
    }

    setNewDate(rowUpdate) {
        let dateColumn = this.getColumn(this.sheetProperty.column.date);
        let valueColumn = this.getColumn(this.sheetProperty.column.value);

        // let curValVal = valueCol.data[rowUpdate - valueCol.rangeStart.row];

        let curentValue = valueColumn.getData(rowUpdate - valueColumn.headerCell.row - 1);
        console.log(curentValue);

        let colUpdate = dateColumn.headerCell.col;
        let updateRange = this.getRange(rowUpdate, colUpdate);
        let currentDateNote = updateRange.getNote();
        let currentDate = updateRange.getValue();
        let newDate = this.getDateNow();

        if (currentDateNote == "" && currentDate == "") {
            updateRange.setValue(newDate);
            updateRange.setNote("history\n" + newDate + "|" + curentValue + "|first");
        } else {
            if (curentValue == "" && currentDate != "") {
                updateRange.clearContent();
                updateRange.setNote(currentDateNote + "\n" + newDate + "|clear");
                return;
            }
            if (currentDateNote != "") {
                updateRange.setNote(currentDateNote + "\n" + newDate + "|" + curentValue);
            }
            if (curentValue != "" && currentDate == "" && currentDateNote != "") {
                updateRange.setValue(newDate);
                updateRange.setNote(currentDateNote + "\n" + newDate + "|add");
            }
        }
    }

    getDateNow() {
        return getDateNow();
    }
}

class SpendData {
    constructor() {
        this.date;
        this.asset;
        this.value;
        this.spend_asset;
        this.spend_value;
        this.type;
        this.spend_for;
        /**
         * @type {string}
         */
        this.note;
    }

    static fromRowValues(value) {
        let ins = new SpendData();
        ins.setDate(value[1])
            .setAsset(value[2])
            .setValue(value[3])
            .setSpendAsset(value[4])
            .setSpendValue(value[5])
            .setType(value[6])
            .setSpendFor(value[7])
            .setNote(value[8]);
        return ins;
    }

    setDate(date) {
        this.date = date;
        return this;
    }

    setAsset(asset) {
        this.asset = asset.replace(" ", "");
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setSpendAsset(spend_asset) {
        this.spend_asset = spend_asset.replace(" ", "");
        return this;
    }

    setSpendValue(spend_value) {
        this.spend_value = spend_value;
        return this;
    }

    setSpendFor(spend_for) {
        this.spend_for = spend_for;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setNote(note) {
        this.note = note;
        return this;
    }
}

class CryptoSpendTable {
    constructor() {
        this.table;
    }

    /**
     * @returns {SpendData[]}
     */
    fetch() {
        let thSheet = TradeHistorySheet.instance;
        let data = thSheet.getRange("B5:J" + thSheet.getLastRow()).getValues();
        let table = new Array();
        for (const value of data) {
            if (value[1] != "") {
                table.push(SpendData.fromRowValues(value));
            }
        }
        this.table = table;
        return table;
    }

    calculateBalance() {
        let balance = new BalanceTable();
        for (const spendData of this.fetch()) {
            balance.push(spendData);
        }
        return balance;
    }
}
