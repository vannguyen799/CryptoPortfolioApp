function test() {
  
debugMode()

  // MenuFnScope.instance.refreshPortfolio()
// PortfolioInfoSheet.instance.loadCurrentPortfolio();
//     PortfolioInfoSheet.instance.generateCategoryInvestmentTable();
//     new PortfolioInfoChartSheet().generatePlatformInvestmentTable();
  try {
    // CryptoTracker;
    TriggerFnScope.instance.fulltimeUpdatePrice();
    // console.log(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(8, 8).getValue());
            // console.log(ConfigSheet.instance.get_auto_update_price_delay())
    
  } catch (e) {
    log("Error: " + e);
  }
  return logStack.join("\n");
}


function __s() {
  //change date col format pnl_history
  // for (let i=6; i<=200; i++) {
  //     let r = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pnl_history').getRange(i, 3)
  //     let rv = r.getValue().toString()
  //     console.log(rv.indexOf(':'))
  //     if (rv == '') continue
  //     if (rv.indexOf(':') == 2) {
  //       r.setValue(rv.split(' ').reverse().join(' '))
  //     }
  // }
  // SM.TriggersManager.getInstance().clearTriggers()
  // TriggerFnScope.tg_check2()
}

function onEditTest() {
  let range = SpreadsheetApp.getActiveSheet().getRange("E11");
  onEdit({
    range,
  });
}
