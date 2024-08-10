class PortfolioSheet extends SM.Sheet.SheetManager {
  constructor() {
    super(SHEET_NAME.PortfolioSheet);
    this.spendTable = new CryptoSpendTable();
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof PortfolioSheet
   * @returns {PortfolioSheet}
   */
  static get instance() {
    return SM.Utility.classInstance(PortfolioSheet);
  }

  refresh() {
    console.log("refreshing Dashboard");

    let balanceTable = this.spendTable.calculateBalance();
    let valueArray = balanceTable.getArray();
    let profitArray = balanceTable.getProfitArray();

    // profit table
    // console.log(profitArray)
    let p_startCell = "M6";
    // TODO: fix tablelengsth
    if (profitArray.length > 0) {
      let p_tableColLength = profitArray[0].length;
      let p_tableNotation =
        p_startCell + ":" + String.fromCharCode(p_startCell.charCodeAt(0) + p_tableColLength - 1) + (6 + profitArray.length - 1);
      this.getRange(p_startCell + ":" + String.fromCharCode(p_startCell.charCodeAt(0) + p_tableColLength - 1)).clearContent();
      if (profitArray.length > 0) {
        this.getRange(p_tableNotation).setValues(profitArray);
      }
    }

    // console.log(valueArray)
    let startCell = "C6";
    let tableNotation = startCell + ":" + String.fromCharCode(startCell.charCodeAt(0) + valueArray[0].length - 1) + (6 + valueArray.length - 1);
    this.getRange(startCell + ":" + String.fromCharCode(startCell.charCodeAt(0) + valueArray[0].length - 1)).clearContent();
    this.getRange(tableNotation).setValues(valueArray);
    this.getRange("C2").setValue(new BalanceTable().totalUSDT_in());

    StatusSheet.instance.setStatus(STATUS_NAME.LAST_REFRESH_DASHBOARD, getDateNow());
    this.updatePrice();
  }

  updatePrice() {
    this.loadData();
    let symbolList = this.getColumnValues("symbol");
    // console.log(symbolList)

    // fix this if not use
    const spendTable = new CryptoSpendTable().calculateBalance()

    let priceRes = CryptoTracker.getPrice(symbolList);
    // console.log(symbolList)
    // console.log(price)
    // TODO: fix g8:g
    this.getRange("G8:G").clearContent();

    for (const symbol_ of symbolList) {
      if (["USDT", "VND"].includes(symbol_)) continue;
      if (priceRes.data[symbol_]) {
        this.getRange("G" + (6 + symbolList.indexOf(symbol_))).setValue(priceRes.data[symbol_].price);
      }
      else {
        let val = spendTable._balanceList[symbol_];
        this.getRange("G" + (6 + symbolList.indexOf(symbol_))).setValue(val.usd_spend / val.value);
      }
      // console.log(symbol_);
    }
    this.getRange("G2").setValue(CryptoTracker.getPairPrice("USDT", "VND", "Aliniex").data["USDT"]["VND"]);
    this.getRange("G3").setValue(`${new Date().toLocaleString()}`);

    StatusSheet.instance.setStatus(STATUS_NAME.LAST_UPDATE_PRICE, getDateNow());
  }
}

class BalanceTable {
  constructor() {
    this._balanceList = { VND: 0, USDT: 0 };
    this.profitList = [];
    this.array;
  }

  push(spendData) {
    if (!this._balanceList[spendData.asset]) {
      this._balanceList[spendData.asset] = {
        value: 0,
        usd_spend: 0,
        avg_buy: 0,
        avg_sell: 0,
        buy_vol: 0,
        buy_vol_usdt: 0,
        sell_vol: 0,
        sell_vol_usdt: 0,
      };
    }
    if (!this._balanceList[spendData.spend_asset]) {
      this._balanceList[spendData.spend_asset] = {
        value: 0,
        usd_spend: 0,
        avg_buy: 0,
        avg_sell: 0,
        buy_vol: 0,
        buy_vol_usdt: 0,
        sell_vol: 0,
        sell_vol_usdt: 0,
      };
    }

    if (spendData.value == "all") spendData.setValue(this._balanceList[spendData.asset].value);
    if (spendData.spend_value == "all") spendData.setSpendValue(this._balanceList[spendData.spend_asset].value);

    this._balanceList[spendData.asset].value += spendData.value;
    this._balanceList[spendData.spend_asset].value -= spendData.spend_value;

    // buy order
    if (["USDT", "VND"].includes(spendData.spend_asset)) {
      let assetRow = this._balanceList[spendData.asset];
      assetRow.usd_spend += spendData.spend_value;
      assetRow.buy_vol += spendData.value;
      assetRow.buy_vol_usdt += spendData.spend_value;
    }

    // sell order
    if (["USDT", "VND"].includes(spendData.asset)) {
      let spendAssetRow = this._balanceList[spendData.spend_asset];
      spendAssetRow.usd_spend -= spendData.value;
      spendAssetRow.sell_vol += spendData.spend_value;
      spendAssetRow.sell_vol_usdt += spendData.value;
    }


  }

  getProfitArray() {
    let array = new Array();
    Object.entries(this._balanceList).forEach(([key, value]) => {
      if (value.value == 0) array.push([key, -value.usd_spend, value.buy_vol_usdt / value.buy_vol, value.sell_vol_usdt / value.sell_vol]);
    });
    this.profitList = array;
    return array;
  }

  getArray() {
    let array = new Array();
    Object.entries(this._balanceList).forEach(([key, value]) => {
      if (value.value != 0) array.push([key, value.value, value.usd_spend]);
    });
    this.array = array;
    return array;
  }

  totalUSDT_in() {
    let table = new CryptoSpendTable().fetch();
    let all = 0;
    for (const rowvalue of table) {
      if ([rowvalue.asset, rowvalue.spend_asset].includes("USDT") && [rowvalue.asset, rowvalue.spend_asset].includes("VND")) {
        if (rowvalue.asset == "USDT") {
          all += rowvalue.value;
        } else if (rowvalue.asset == "VND") {
          all -= rowvalue.spend_value;
        }
      }
    }
    return all;
  }
}
