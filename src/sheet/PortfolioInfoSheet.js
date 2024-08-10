class PortfolioInfoSheet extends SheetManager {
    constructor() {
        super(SHEET_NAME.PortfolioInfoSheet);
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof PortfolioInfoSheet
     * @returns {PortfolioInfoSheet}
     */
    static get instance() {
        return SM.Utility.classInstance(PortfolioInfoSheet);
    }

    loadCurrentPortfolio() {
        let port = new CryptoSpendTable().calculateBalance();
        let ticker = [];
        for (const t of Object.keys(port._balanceList)) {
            if (port._balanceList[t].value > 0 && t != "VND" && !t.includes('-')) {
                ticker.push(t);
            }
        }
        if (ticker.length == 0) return;
        log(ticker);
        const infoRes = CryptoTracker.getProjectInfo(ticker);
        // log(infoRes);
        const startTableRow = 5; //fix
        let countRow = 1;
        // SpreadsheetApp.getActiveRange().clearContent()
        if (infoRes.isSuccess()) {
            this.getRange("C6:L").clearContent();

            for (const t of ticker) {
                if (!infoRes.data[t]) continue;
                let piRow = PortfolioInfoRow.parseCTResponeData(infoRes.data[t]);
                piRow.setSymbol(t);
                piRow.setValue(this.getTickerValue(t));
                // log(this.getTickerValue(t));
                let rowData = piRow.getRowArray();
                this.getRange(startTableRow + countRow, 3, 1, rowData.length).setValues([rowData]);
                countRow++;
            }
        }
    }

    getTickerValue(ticker) {
        const col = PortfolioSheet.instance.getColumn("value").headerCell.col;
        const row = PortfolioSheet.instance.getCellByValue(ticker).row;
        // log(col + " " + row);
        return PortfolioSheet.instance.getRange(row, col).getValue();
    }
}

class PortfolioInfoChartSheet extends SheetManager {
    constructor() {
        super(SHEET_NAME.PortfolioInfoChartSheet);
        this.infoSheet = PortfolioInfoSheet.instance;
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof PortfolioInfoChartSheet
     * @returns {PortfolioInfoChartSheet}
     */
    static get instance() {
        return SM.Utility.classInstance(PortfolioInfoChartSheet);
    }

    generateCategoryInvestmentTable() {
        const tagNamesCol = this.infoSheet.getColumn("tagNames");
        let data = tagNamesCol.getDataRange().getValues();

        let data_ = [];
        for (const val of data) {
            if (val[0] == "") continue;
            log(val);
            for (const v of val[0].split(",")) {
                data_.push(v);
            }
        }
        let table = this.genTable(data_);

        let startCol = 3;
        let startRow = 1;
        this.getRange(startRow, startCol, 200, 2).clearContent();
        this.getRange(startRow, startCol, table.length, 2).setValues(table);
    }

    generatePlatformInvestmentTable() {
        const platformCol = this.infoSheet.getColumn("platform");
        let data = platformCol.getDataRange().getValues();

        let table = this.genTable(data);
        let startCol = 1;
        let startRow = 1;
        this.getRange(startRow, startCol, 200, 2).clearContent();
        this.getRange(startRow, startCol, table.length, 2).setValues(table);
    }

    genTable(array) {
        let nameStack = {};
        for (const val of array) {
            if (val == "") continue;
            if (!nameStack[val]) nameStack[val] = 1;
            else nameStack[val]++;
        }
        let table = [];
        for (const key of Object.keys(nameStack)) {
            table.push([key, nameStack[key]]);
        }
        return table;
    }
}

class PortfolioInfoRow {
    constructor() { }
    setSymbol(symbol) {
        this.symbol = symbol;
    }

    setName(name) {
        this.name = name;
    }
    setValue(value) {
        this.value = value;
    }
    setWebsite(website) {
        this.website = website;
    }
    setDateLaunched(dateLaunched) {
        this.dateLaunched = dateLaunched;
    }

    setTagNames(tagNames) {
        this.tagNames = tagNames;
    }
    setDescription(description) {
        this.description = description;
    }

    setCategory(category) {
        this.category = category;
    }
    setPlatform(platform) {
        this.platform = platform;
    }

    setTwitterUrl(url) {
        this.twitter = url;
    }
    getRowArray() {
        return [
            this.symbol,
            this.name,
            this.value,
            this.website,
            this.category,
            this.description,
            this.tagNames,
            this.platform,
            this.dateLaunched,
            this.twitter,
            this.slug,
        ];
    }

    setSlug(slug) {
        this.slug = slug;
    }

    static parseCTResponeData(dt) {
        let ins = new PortfolioInfoRow();
        // ins.setSymbol(dt.symbol)
        ins.setName(dt.name);
        ins.setWebsite(dt.urls?.website[0]);
        ins.setCategory(dt.category);
        ins.setDescription(dt.description);

        // ins.setDescription(LanguageApp.translate(dt.description, "en", "vi"));
        ins.setTagNames(dt.tagNames?.join(","));
        try {
            ins.setPlatform(dt.platform.name);
        } catch (e) {
            ins.setPlatform(dt.name);
        }
        ins.setDateLaunched(dt.dateLaunched);
        ins.setTwitterUrl(dt.urls?.twitter[0]);
        ins.setSlug("https://coinmarketcap.com/currencies/" + dt.slug);
        return ins;
    }
}
