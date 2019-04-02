"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var InfluxWriteClient = /** @class */ (function () {
    /**
     * @param address The complete address of the server to which the client makes requests,
     * including the port.
     * @param defaultDB The default database the client writes to.
     * @param influx The InfluxDB instance assigned to the client.
     */
    function InfluxWriteClient(dsn, defaultDB, influx) {
        this.dsn = dsn;
        this.defaultDB = defaultDB;
        this.influx = influx;
    }
    /**
     * @returns The address of the server the client is connected to.
     */
    InfluxWriteClient.prototype.getAddress = function () {
        return this.dsn;
    };
    /**
     * @returns The default database the client writes to.
     */
    InfluxWriteClient.prototype.getDefaultDB = function () {
        return this.defaultDB;
    };
    /**
     * @param batch The batch of data to be parsed and written to the server.
     * @param database OPTIONAL: the database to write the data to;
     * unless specified, it's the default database for the client.
     */
    InfluxWriteClient.prototype.writeBatchData = function (batch, _a) {
        var _b = _a.database, database = _b === void 0 ? this.defaultDB : _b;
        return __awaiter(this, void 0, void 0, function () {
            var batchData;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        batchData = this.parseBatchData(batch);
                        return [4 /*yield*/, this.influx.writePoints(batchData, {
                                database: database
                            })["catch"](function (err) {
                                return console.log("Writing a batch of data to" + _this.getAddress()
                                    + " has encountered the following error: " + err);
                            })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param point The point of data to be parsed and written to the server.
     * @param database OPTIONAL: the database to write the data to;
     * unless specified, it's the default database for the client.
     */
    InfluxWriteClient.prototype.writePointData = function (point, _a) {
        var _b = _a.database, database = _b === void 0 ? this.defaultDB : _b;
        return __awaiter(this, void 0, void 0, function () {
            var pointData;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pointData = this.parsePointData(point);
                        return [4 /*yield*/, this.influx.writePoints([
                                pointData,
                            ], {
                                database: database
                            })["catch"](function (err) {
                                return console.log("Writing a batch of data to" + _this.getAddress()
                                    + " has encountered the following error: " + err);
                            })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param batch Contains the batch of data to be parsed for writing on Influx.
     * @returns An array of points of data.
     */
    InfluxWriteClient.prototype.parseBatchData = function (batch) {
        var _this = this;
        var batchRes = new Array();
        batch.forEach(function (item) {
            var pointTemp = _this.parsePointData(item);
            batchRes.push(pointTemp);
        });
        return batchRes;
    };
    /**
     * @param point Contains the batch of data to be parsed for writing on Influx.
     * @returns A point of data.
     */
    InfluxWriteClient.prototype.parsePointData = function (point) {
        var pointRes = {
            fields: {}
        };
        point.getValueProbs().forEach(function (item) {
            Object.defineProperty(pointRes, item.getValueName(), { value: item.getProbValue() });
        });
        return pointRes;
    };
    return InfluxWriteClient;
}());
exports["default"] = InfluxWriteClient;
