"use strict";
exports.__esModule = true;
var CalcResult = /** @class */ (function () {
    function CalcResult(nodeName, items) {
        this.nodeName = name;
        this.items = items;
    }
    CalcResult.prototype.getNodeName = function () {
        return this.nodeName;
    };
    CalcResult.prototype.getValueProbs = function () {
        return this.items;
    };
    return CalcResult;
}());
exports.CalcResult = CalcResult;
