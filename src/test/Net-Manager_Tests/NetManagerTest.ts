import { NetManager } from "../../core/net-manager/NetManager";
import { NetReader } from "../../core/net-manager/reader/reader";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";
import { SingleNetWriter, NetWriter } from "../../core/net-manager/writer/NetWriter";
import { ConcreteNetworkFactory } from "../../core/network/factory/factory";
import { ConcreteWriteClientFactory } from "../../core/write-client/write-client";
import { ConcreteNetworkAdapter } from "../../core/network/adapter/adapter";

const schemaPath: string = "../../core/network/factory/network_structure.schema.json";

import {expect} from "chai";

const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/CorrectNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);
const network: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);

describe("NetManager - constructor", () => {
    const reader: NetReader = new NetReader(network);
    const updater: NetUpdater = new NetUpdater(network);
    let writer: NetWriter;
    new ConcreteWriteClientFactory().makeInfluxWriteClient("http://localhost/", "8086", "prova").then(async function(result){
        writer = await new SingleNetWriter(result);
        it("Correct inputs - NetManager", () => {
            expect(() => new NetManager(reader, updater, writer)).to.not.throw(Error);
        });
    }).catch(function(e){
        console.log("NetManager constructor ERROR: " + e);
    });
    it("Undefined reader - Error", () => {
        let unReader: NetReader;
        expect(() =>new NetManager(unReader, updater, writer)).to.throw(Error, "invalid reader parameter");
    });
    it("Undefined updater - Error", () => {
        let unUpdater: NetUpdater;
        expect(() =>new NetManager(reader, unUpdater, writer)).to.throw(Error, "invalid updater parameter");
    });
    it("Undefined writer - Error", () => {
        let unWriter: NetWriter;
        expect(() => new NetManager(reader, updater, unWriter)).to.throw(Error, "invalid writer parameter");
    });
});

describe("NetManager - updateNet", () => {
    it("Reader Updater Writer - Updated network // Tested in NetReader NetWriter NetUpdater integration test", () => {
        expect(true).to.equal(true);
    }); 
});