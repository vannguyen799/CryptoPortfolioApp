function getDateNow(currentDate = new Date().toLocaleString("vi-VN")) {
    // let dateString;
    // let dateString = currentDate.split('T')[1].replace('Z', '').split('.')[0]  + ' ' +  currentDate.split('T')[0]
    return (dateString = currentDate);
}

function getPrice(symbol_) {
    if (symbol_ != "") return CryptoTracker.getPrice(symbol_).price;
}

function getFnName(fn, __fnScope) {
    return SM.Utility.getFnName(fn, __fnScope);
}

function log(o) {
    logStack.push(o);
    console.log(o);
}

function debugLog(o) {
    if (isDebug) {
        o = "debug: " + o;

        logStack.push(o);
        log(o);
    }
}
