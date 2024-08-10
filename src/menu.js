// Public
function menu(__fnScope) {
  MenuFnScope.instance.init(__fnScope);
}

class MenuFnScope extends SM.FunctionScope {
  constructor() {
    super();
  }
  /**
   *
   *
   * @readonly
   * @static
   * @memberof MenuFnScope
   * @returns {MenuFnScope}
   */
  static get instance() {
    return SM.Utility.classInstance(MenuFnScope);
  }

  init(__fnScope) {
    const ui = SpreadsheetApp.getUi();
    const fnScope = this.scope(__fnScope);

    ui.createMenu("Portfolio")
      .addItem("refresh", getFnName(this.refreshPortfolio, fnScope))
      .addItem("fetch price", getFnName(this.updatePrice, fnScope))
      .addItem("auto fetch price", getFnName(this.loopUpdatePrice, fnScope))
      .addToUi();

    ui.createMenu("TradeHistory").addItem("active last row", getFnName(this.activeLastRowTradeHistorySheet, fnScope)).addToUi();

    ui.createMenu("PNLHistory")
      .addItem("capture history now", getFnName(this.capturePNLHistory, fnScope))
      .addItem("refresh Chart Data", getFnName(this.refreshChartPNLHistory, fnScope))
      .addToUi();
    ui.createMenu("PortfolioInfo")
      .addItem("load", getFnName(this.loadCurrentPortfolio, fnScope))
      .addItem("gen chart", getFnName(this.refreshPortfolio, fnScope))
      .addToUi();
  }

  capturePNLHistory() {
    PNLHistorySheet.instance.addPNLHistory();
  }

  updatePrice() {
    PortfolioSheet.instance.updatePrice();
  }

  loadCurrentPortfolio() {
    PortfolioInfoSheet.instance.loadCurrentPortfolio()
  }

  initTg() {
    initilizeTriggers()
  }

  refreshChartPNLHistory() {
    PNLHistorySheet.instance.refreshChart();
  }

  refreshPortfolio() {
    PortfolioSheet.instance.refresh();
    PortfolioInfoSheet.instance.loadCurrentPortfolio();
    PortfolioInfoChartSheet.instance.generateCategoryInvestmentTable();
    PortfolioInfoChartSheet.instance.generatePlatformInvestmentTable();
  }

  activeLastRowTradeHistorySheet() {
    TradeHistorySheet.instance.activeLastRow();
  }
  loopUpdatePrice() {
    TriggerFnScopes.instance.fulltimeUpdatePrice();
  }
}
