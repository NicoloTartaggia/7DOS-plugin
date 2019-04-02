"use strict";
exports.__esModule = true;
var sync_1 = require("sync");
function aSync() {
    return 5;
}
console.log(sync_1["default"].sync(aSync()));
