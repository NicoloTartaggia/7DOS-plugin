"use strict";
/**
 * @file WriteClientFactory.ts
 * @version 1.0.0
 * @filetype Typescript module
 * @author Andrea Trevisin
 * @date 02/04/2019
 */
exports.__esModule = true;
var influx_1 = require("influx");
var InfluxWriteClient_1 = require("./InfluxWriteClient");
/**
 * @class ConcreteWriteClientFactory
 * @description Factory class used to instantiate all the different implementations of WriteClient.
 */
var ConcreteWriteClientFactory = /** @class */ (function () {
    function ConcreteWriteClientFactory() {
    }
    /**
     * @param host The network name of the server to which the client wants to connect.
     * @param port The port the server is listening on.
     * @param defaultDB  The name of the default database for the client to write to.
     * @param credentials OPTIONAL: The credentials needed to connect to the server.
     * @returns A fully configured InfluxWriteClient.
     */
    ConcreteWriteClientFactory.prototype.makeInfluxWriteClient = function (host, port, defaultDB, credentials) {
        var address = host + ":" + port;
        var login = credentials ?
            credentials[0] + ":" + credentials[1] + "@" :
            "";
        var dsn = "http://" + login + address + "/";
        var influx = new influx_1.InfluxDB(dsn + "/" + defaultDB);
        influx.getDatabaseNames()
            .then(function (names) {
            if (!names.includes(defaultDB)) {
                return influx.createDatabase(defaultDB)["catch"](function (err) {
                    throw new Error("Creating default database at: " + dsn + " has encountered the following error: " + err);
                });
            }
        })["catch"](function (err) {
            throw new Error("Getting database names at: " + dsn + " has encountered the following error: " + err);
        });
        return new InfluxWriteClient_1["default"](dsn, defaultDB, influx);
    };
    return ConcreteWriteClientFactory;
}());
exports.ConcreteWriteClientFactory = ConcreteWriteClientFactory;
