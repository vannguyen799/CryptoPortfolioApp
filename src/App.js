var App = SM.App;
App.printable();
App.setSpreadsheet(SpreadsheetApp.getActiveSpreadsheet());
App.setPropertyScope(PropertiesService.getScriptProperties());

var isDebug = false;
var logStack = [];

var SheetManager = SM.Sheet.SheetManager;

var SHEET_NAME = {
    PNLHistorySheet: "PNLHistory",
    TradeHistorySheet: "TradeHistory",
    ConfigSheet: "config",
    PortfolioSheet: "Portfolio",
    StatusSheet: "status",
    PortfolioInfoSheet: "PortfolioInfo",
    PortfolioInfoChartSheet: "PortfolioInfoChart",
};

var PROPERTIES_NAME = {
    LAST_UPDATE_PRICE: "FN_LAST_UPDATE_PRICE",
};

var STATUS_NAME = {
    LAST_TRIGGER_CHECK: "LAST_TRIGGER_CHECK",
    AUTO_UPDATE_PRICE: "AUTO_UPDATE_PRICE",
    LAST_UPDATE_PRICE: "LAST_UPDATE_PRICE",
    LAST_REFRESH_DASHBOARD: "LAST_REFRESH_DASHBOARD",
    LAST_CAPTURE_HISTORY: "LAST_CAPTURE_HISTORY",
    LAST_REFRESH_CHART: "LAST_REFRESH_CHART",
};

function debugMode() {
    isDebug = true;
}
