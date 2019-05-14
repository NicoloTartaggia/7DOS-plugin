import { NetReader } from "../../../core/net-manager/reader/reader";
import { ConcreteNetworkAdapter, NetworkAdapter } from "../../../core/network/adapter/adapter";
import { JsonNetParser } from "../../../core/network/factory/factory";
import {DataSource} from "../../../core/net-manager/reader/Datasource";

import {expect} from "chai";

const schemaPath: string = "../../../../example_network/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../../Util_JSON/CorrectNetwork.json";
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);

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

describe("NetReader - constructor", () => {
    it("Undefined network_ref - Error", () => {
        let networkAdapter: ConcreteNetworkAdapter;
        expect(()=> new NetReader(networkAdapter)).to.throw(Error, "[7DOS G&B][NetReader]constructor - invalid parameter");
    });
    it("Correct inputs - NetReader", () => {
        expect(()=> new NetReader(network)).to.not.throw(Error, "[7DOS G&B][NetReader]constructor - invalid parameter");
    });
});

describe("NetReader - read", () => {
    it("Correct network, connection to node - Collection", async () => {
        const networkReader: NetReader = new NetReader(network);
        networkReader.connectNode("Example", new DataSource("http://localhost:8086/", "testDB"), "SELECT Percent_DPC_Time FROM win_cpu");
        let result: any = await networkReader.read()
        .catch(function(e){
            console.log("NetReader read ERROR: " + e);
        });
        expect(result.buildIterator().next().value.getNode().getName()).to.equal("Example");
    });
});

describe("NetReader - connectNode", () => {
    const networkReader: NetReader = new NetReader(network);
    it("Undefined node - Error", () => {
        let node: string;
        expect(() => networkReader.connectNode(node, new DataSource("http://localhost", "testDB"), "query")).to.throw(Error, "[7DOS G&B][NetReader]connectNode - Invalid node");
    });
    it("Undefined datasource - Error", () => {
        let dataS: DataSource;
        expect(() => networkReader.connectNode("node", dataS, "query")).to.throw(Error, "[7DOS G&B][NetReader]connectNode - Invalid dataSource.");
    });
    it("Undefined query - Error", () => {
        let query: string;
        expect(() => networkReader.connectNode("node", new DataSource("http://localhost", "testDB"), query)).to.throw(Error, "[7DOS G&B][NetReader]connectNode - Invalid query.");
    });
    it("Empty node - Error", () => {
        expect(() => networkReader.connectNode("", new DataSource("http://localhost", "testDB"), "query")).to.throw(Error, "[7DOS G&B][NetReader]connectNode - Invalid node");
    });
    it("Empty query - Error", () => {
        expect(() => networkReader.connectNode("node", new DataSource("http://localhost", "testDB"), "")).to.throw(Error, "[7DOS G&B][NetReader]connectNode - Invalid query");
    });
});

describe("NetReader - disconnectNode", () => {
    const networkReader: NetReader = new NetReader(network);
    it("Undefined node - Error", () => {
        let node: string;
        expect(() => networkReader.disconnectNode(node)).to.throw(Error, "[7DOS G&B][NetReader]disconnectNode - Invalid node");
    });
    it("Node not present - Error", () => {
        expect(() => networkReader.disconnectNode("nodochenonce")).to.throw(Error, "[7DOS G&B][NetReader]disconnectNode - This node might be not linked to any flow");
    });
    it("Undefined query - Error", () => {
        networkReader.connectNode("Example2", new DataSource("http://localhost:8086/", "testDB"), "SELECT Percent_DPC_Time FROM win_cpu");
        expect(() => networkReader.disconnectNode("Example2")).to.not.throw(Error);
    });
});