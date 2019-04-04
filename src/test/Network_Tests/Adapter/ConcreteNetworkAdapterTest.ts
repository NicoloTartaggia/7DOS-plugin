import { NetworkAdapter } from "../../../core/network/adapter/NetworkAdapter";
import { ConcreteNetworkAdapter } from "../../../core/network/adapter/ConcreteNetworkAdapter";
import { ConcreteNetworkFactory } from "../../../core/network/factory/ConcreteNetworkFactory";
import { NodeAdapter } from "../../../core/network/adapter/NodeAdapter";

import jsbayes = require("jsbayes");

import {expect} from "chai";

const schemaPath: string = "../../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../../Util_JSON/CorrectNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

describe("ConcreteNetworkAdapter - constructor", () => {
    it("Undefined graph - Error", () => {
        let graph: JGraph;
        let list: Array<NodeAdapter> = new Array<NodeAdapter>();

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "invalid parameter");
    });
    it("Undefined list - Error", () => {
        let graph: JGraph = jsbayes.newGraph();
        let list: Array<NodeAdapter>;

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "invalid parameter");
    });
    it("Empty list - Error", () => {
        let graph: JGraph = jsbayes.newGraph();
        let list: Array<NodeAdapter> = new Array<NodeAdapter>();

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "invalid parameter");
    });
});

describe("ConcreteNetworkAdapter - observeNode", () => {
    it("Correct node, isObserved - True", () => {    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        network.observeNode("Example", "Example of string value");

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------

        expect(true).to.equal(true);        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------
    });
    it("Undefined node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.observeNode(name, "Example of string value")).to.throw(Error, "invalid parameter");
    });
    it("Empty node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("", "Example of string value")).to.throw(Error, "invalid parameter");
    });
    it("Incorrect node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("FakeNode", "Example of string value")).to.throw(Error, "Node FakeNode isn't present in the network");
    });
    it("Incorrect node value - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("Example", "FakeValue")).to.throw(Error, "Node Example hasn't a value called FakeValue");
    });
});

describe("ConcreteNetworkAdapter - unobserveNode", () => {
    it("Correct node, isObserved - False", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        network.observeNode("Example", "Example of string value");

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------

        //const isObs: boolean = network.isObserved("Example");
        expect(/*isObs*/true).to.equal(true); 
        network.unobserveNode("Example");
        expect(/*isObs*/false).to.equal(false);        
        network.observeNode("Example", "Example of string value");

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------
    });
    it("Undefined node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.unobserveNode(name)).to.throw(Error, "invalid parameter");
    });
    it("Empty node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>network.unobserveNode("")).to.throw(Error, "invalid parameter");
    });
    it("Incorrect node name - Error", () => {
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>network.unobserveNode("FakeNode")).to.throw(Error, "Node FakeNode isn't present in the network");
    });
});

describe("ConcreteNetworkAdapter - sampleNetwork", () => {
    it("Undefined number of samples - Error", () => {
      const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
      let undNumber: number;
      expect(()=>s.sampleNetwork(undNumber)).to.throw(Error, "invalid parameter");
    });
    it("Less than zero number of samples - Error", () => {
        const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        let negNumber: number = -50;
        expect(()=>s.sampleNetwork(negNumber)).to.throw(Error, "invalid parameter");
      });
});

describe("ConcreteNetworkAdapter - getNodeProbs", () => {
    it("Undefined node name - Error", () => {
      const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
      let undName: string;
      expect(()=>s.getNodeProbs(undName)).to.throw(Error, "invalid parameter");
    });
    it("Empty node name - Error", () => {
        const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>s.getNodeProbs("")).to.throw(Error, "invalid parameter");
    });
    it("Incorrect node name - Error", () => {
        const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
        expect(()=>s.getNodeProbs("IncorrectName")).to.throw(Error, "Node IncorrectName isn't present in the network");
    });
});

describe("ConcreteNetworkAdapter - getNodeList", () => {
    it("Correct network, grab second node's name - Second node's name", () => {
      const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);
      const nodeOne = s.getNodeList()[1];
      expect(nodeOne.getName()).to.equal('Example2');
    });
});

