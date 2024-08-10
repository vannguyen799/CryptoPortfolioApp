function initilizeTriggers(__fnScope) {
    // TriggerFnScope.instance.triggerManager.clearTriggers()

    TriggerFnScope.instance.init(__fnScope);
}

// simple trigger
function onOpen() {
    menu();
}

class TriggerFnScope extends SM.Trigger.TriggerFunctionScope {
    constructor() {
        super();
        this.propertyName = PROPERTIES_NAME;
        this.addTrigger(this.onEdit, 2)
            .addTrigger(this.onOpen, 1)
            .addTrigger(this.updatePNLSheet, 4, { timeValue: 1, timeBy: 2 })
            .addTrigger(this.checkTrigger, 4, { timeValue: 30, timeBy: 1 })
            .addTrigger(this.fulltimeUpdatePrice, 6);
    }
    /**
     *
     *
     * @readonly
     * @static
     * @memberof TriggerFnScope
     * @returns {TriggerFnScope}
     */
    static get instance() {
        return SM.Utility.classInstance(TriggerFnScope);
    }

    init() {
        console.log("start initlize triggers...");
        this.initTrigger();
        PortfolioSheet.instance.refresh();
    }

    checkTrigger() {
        super.checkTrigger();
        StatusSheet.instance.setStatus(STATUS_NAME.LAST_TRIGGER_CHECK, getDateNow());
    }

    onEdit(e) {
        let range = e.range;
        let instance = TradeHistorySheet.instance;

        if (range.getColumn() == instance.getColumn("value").headerCell.col && range.getRow() > instance.getColumn("value").headerCell.row) {
            instance.setNewDate(range.getRow());
            MenuFnScope.instance.refreshPortfolio();
        }

        if (range.getSheet().getName() == ConfigSheet.sheetName) {
            if (range.getRow() == 3) PNLHistorySheet.instance.refreshChart();
        }
    }

    onOpen() {
        this.checkTrigger();
        PortfolioInfoSheet.instance.loadCurrentPortfolio();
        PortfolioInfoChartSheet.instance.generateCategoryInvestmentTable();
        PortfolioInfoChartSheet.instance.generatePlatformInvestmentTable();
        MenuFnScope.instance.refreshPortfolio();
    }

    updatePNLSheet() {
        PortfolioSheet.instance.refresh();
        PNLHistorySheet.instance.addPNLHistory();
    }

    fulltimeUpdatePrice() {
        const fnScope = this.scope(this.getFnScope());
        const fnName = getFnName(this.fulltimeUpdatePrice, fnScope)
        this.triggerManager.fullTimeTrigger(
            fnName,
            () => {
                StatusSheet.instance.setStatus(STATUS_NAME.AUTO_UPDATE_PRICE, "running");
                MenuFnScope.instance.updatePrice();
                TriggerFnScope.instance.propertyScope.setProperty(PROPERTIES_NAME.LAST_UPDATE_PRICE, new Date().getTime().toString());
            },
            () => {
                StatusSheet.instance.setStatus(STATUS_NAME.AUTO_UPDATE_PRICE, "stopped");
            },
            ConfigSheet.instance.get_auto_update_price_delay().value
        );
    }
}
