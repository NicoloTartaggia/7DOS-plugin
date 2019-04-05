import { NetReader } from "../../../core/net-manager/reader/reader";
import { ConcreteNetworkAdapter, NetworkAdapter } from "../../../core/network/adapter/adapter";
import { ConcreteNetworkFactory } from "../../../core/network/factory/factory";
import DataSource from "../../../core/net-manager/reader/Datasource";

import {expect} from "chai";

const schemaPath: string = "../../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../../Util_JSON/CorrectNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);

describe("NetReader - constructor", () => {
    it("Undefined network_ref - Error", () => {
        let networkAdapter: ConcreteNetworkAdapter;
        expect(()=> new NetReader(networkAdapter)).to.throw(Error, "invalid parameter");
    });
});

describe("NetReader - read", () => {
    it("Correct network - Collection", () => {
        const networkReader: NetReader = new NetReader(network);
        networkReader.read().then(function(result){
            expect(result.collection.length).to.equal(0);
        }).catch(function(e){
            console.log("errore");
            console.log(e);
        });
    });
});

describe("NetReader - connectNode", () => {
    const networkReader: NetReader = new NetReader(network);
    it("Undefined node - Error", () => {
        let node: string;
        expect(() => networkReader.connectNode(node, new DataSource("http://localhost"), "query")).to.throw(Error, "Invalid node");
    });
    it("Undefined datasource - Error", () => {
        let dataS: DataSource;
        expect(() => networkReader.connectNode("node", dataS, "query")).to.throw(Error, "Invalid dataSource.");
    });
    it("Undefined query - Error", () => {
        let query: string;
        expect(() => networkReader.connectNode("node", new DataSource("http://localhost"), query)).to.throw(Error, "Invalid query.");
    });
    it("Empty node - Error", () => {
        expect(() => networkReader.connectNode("", new DataSource("http://localhost"), "query")).to.throw(Error, "Invalid node");
    });
    it("Empty query - Error", () => {
        expect(() => networkReader.connectNode("node", new DataSource("http://localhost"), "")).to.throw(Error, "Invalid query");
    });
});