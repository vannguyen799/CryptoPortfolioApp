class PNLHistorySheet extends SM.Sheet.SheetManager {
    constructor() {
        super(SHEET_NAME.PNLHistorySheet);
        this.dasboard = PortfolioSheet.instance;
    }
    /**
     *
     *
     * @readonly
     * @static
     * @memberof PNLHistorySheet
     * @returns {PNLHistorySheet}
     */
    static get instance() {
        return SM.Utility.classInstance(PNLHistorySheet);
    }

    getPNLHistory() {
        let pnlRowValues = this.dasboard.Sheet.getRange("C2:I2").getValues();
        let pnlHis = new PNLHistory();
        pnlHis.fromRowValues(pnlRowValues[0]);
        return pnlHis;
    }

    addPNLHistory() {
        let startCol = 3;
        this.loadData();
        let lastRow = this.data.length;
        let pnlHis = this.getPNLHistory().getArray();

        // console.log(pnlHis)
        this.getRange(lastRow + 1, startCol, 1, pnlHis.length).setValues([pnlHis]);
        // SpreadsheetApp.getActiveSheet().
        console.log(`add pnl his: ${pnlHis}`);
        StatusSheet.instance.setStatus(STATUS_NAME.LAST_CAPTURE_HISTORY, getDateNow());
        this.refreshChart();
    }
    /**
     *
     * @param {string} chartTitle
     * @param {number} numDataRows
     * @returns {void}
     */
    setChartDataRage(chartTitle, numDataRows) {
        let chart = this.getChartByTitle(chartTitle);
        if (chart == null) return;

        let chartBuilder = chart.modify();

        chartBuilder.getRanges().forEach((range) => chartBuilder.removeRange(range));
        let dateColumn = this.getColumn("date", null, false);
        let chartDataColumn = this.getColumn(chartTitle.toLowerCase(), null, false);

        debugLog("set " + chartTitle + " " + dateColumn.getNotation() + " " + chartDataColumn.getNotation());
        log(
            "set " +
                chartTitle +
                " " +
                dateColumn.sliceDataRange(-1, numDataRows).getA1Notation() +
                " " +
                chartDataColumn.sliceDataRange(-1, numDataRows).getA1Notation()
        );

        //set new range data
        this.updateChart(
            chartBuilder.addRange(dateColumn.sliceDataRange(-1, numDataRows)).addRange(chartDataColumn.sliceDataRange(-1, numDataRows)).build()
        );
    }

    refreshChart() {
        this.flush();
        console.log("refreshing Chart");

        let charstName = ["PNL", "PNL_VND", "USDT_NAV", "USDT_IN", "VND_IN", "PNL_PERCENT", "VND_NAV"];
        let configNumData = ConfigSheet.instance.getKey("chart_data_num_rows");
        let numData;
        if (configNumData == null) numData = 24 * 30;
        else numData = configNumData.value;

        console.log(configNumData);
        charstName.forEach((x) => this.setChartDataRage(x, numData));

        StatusSheet.instance.setStatus(STATUS_NAME.LAST_REFRESH_CHART, getDateNow());
    }
}

class PNLHistory {
    constructor() {
        this.date;
        this.usdt_in;
        this.usdt_nav;
        this.pnl;
        this.vnd_in;
        this.pnl_percent;
        this.pnl_vnd;
        this.vnd_nav;
    }

    fromRowValues(rowvalue) {
        this.date = getDateNow().split(" ").reverse().join(" ");
        this.usdt_in = rowvalue[0];
        this.usdt_nav = rowvalue[1];
        this.pnl = rowvalue[2];
        this.vnd_in = rowvalue[6];
        this.pnl_percent = (this.pnl / this.usdt_in).toFixed(2).replace(".", ",");
        this.pnl_vnd = rowvalue[5];
        this.vnd_nav = this.pnl_vnd + this.vnd_in;

        return this;
    }

    getArray() {
        return [this.date, this.usdt_in, this.usdt_nav, this.vnd_in, this.pnl, this.pnl_percent, this.pnl_vnd, this.vnd_nav];
    }
}
