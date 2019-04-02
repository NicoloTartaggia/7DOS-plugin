"use strict";
exports.__esModule = true;
var CalcResultItem = /** @class */ (function () {
    function CalcResultItem(valueName, probValue) {
        this.valueName = valueName;
        this.probValue = probValue;
    }
    CalcResultItem.prototype.getValueName = function () {
        return this.valueName;
    };
    CalcResultItem.prototype.getProbValue = function () {
        return this.probValue;
    };
    return CalcResultItem;
}());
exports.CalcResultItem = CalcResultItem;
