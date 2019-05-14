import { NetManager } from "../../core/net-manager/NetManager";
import { NetReader, DataSource } from "../../core/net-manager/reader/reader";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";
import { SingleNetWriter, NetWriter } from "../../core/net-manager/writer/NetWriter";
import { JsonNetParser } from "../../core/network/factory/factory";
import { ConcreteWriteClientFactory } from "../../core/write-client/write-client";
import { ConcreteNetworkAdapter } from "../../core/network/adapter/adapter";

const schemaPath: string = "../../../example_network/network_structure.schema.json";

import {expect} from "chai";

before("Db init", async () => {
    const Influx = require('influx');
    const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'testDB',
    schema: [
    {
        measurement: 'win_cpu',
        fields: {
            Percent_DPC_Time: Influx.FieldType.FLOAT,
        },
        tags: [
            'host'
        ]
    }
    ]
    });
    await influx.getDatabaseNames()
    .then(names => {
      if (!names.includes('testDB')) {
        return influx.createDatabase('testDB');
      }
    })
    await influx.writePoints([
        {
        measurement: 'win_cpu',
        tags: { host: "thishost" },
        fields: { Percent_DPC_Time: 0.060454 },
        }
    ]);
});
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/CorrectNetwork.json";
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);
const network: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);

describe("NetManager - constructor", async () => {
    const reader: NetReader = new NetReader(network);
    const updater: NetUpdater = new NetUpdater(network);
    let writer: NetWriter;
    await new ConcreteWriteClientFactory().makeInfluxWriteClient("http://localhost/", "8086", "testDB").then(async (result) => {
        writer = await new SingleNetWriter(result);
    });
    it("Correct inputs - NetManager", () => {
        expect(() => new NetManager(reader, updater, writer)).to.not.throw(Error);
    });
    it("Undefined reader - Error", () => {
        let unReader: NetReader;
        expect(() =>new NetManager(unReader, updater, writer)).to.throw(Error, "[7DOS G&B][NetManager]constructor - invalid reader parameter");
    });
    it("Undefined updater - Error", () => {
        let unUpdater: NetUpdater;
        expect(() =>new NetManager(reader, unUpdater, writer)).to.throw(Error, "[7DOS G&B][NetManager]constructor - invalid updater parameter");
    });
    it("Undefined writer - Error", () => {
        let unWriter: NetWriter;
        expect(() => new NetManager(reader, updater, unWriter)).to.throw(Error, "[7DOS G&B][NetManager]constructor - invalid writer parameter");
    });
});

describe("NetManager - updateNet", () => {
    it("Reader Updater Writer - Updated network", async () => {
        const reader: NetReader = new NetReader(network);
        reader.connectNode("Example2", new DataSource("http://localhost:8086/", "testDB"), "SELECT Percent_DPC_Time FROM win_cpu");
        const updater: NetUpdater = new NetUpdater(network);
        let writer: NetWriter;
        let errorFlag: boolean = false;
        let error: any;
        await new ConcreteWriteClientFactory().makeInfluxWriteClient("http://localhost/", "8086", "testDB").then(async function(result){
            writer = await new SingleNetWriter(result);
            new NetManager(reader, updater, writer).updateNet().catch(function(e){
                errorFlag = true;
                error = e;
            });
        }).catch(function(e){
            errorFlag = true;
            error = e;    
        });
        if(errorFlag) {
            console.log("NetManager constructor ERROR: " + error);
        }
        expect(errorFlag).to.equal(false);  
    }); 
});
