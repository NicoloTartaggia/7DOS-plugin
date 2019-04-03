import { NetworkAdapter } from "../../../core/network/adapter/NetworkAdapter";
import { ConcreteNetworkAdapter } from "../../../core/network/adapter/ConcreteNetworkAdapter";
import { ConcreteNetworkFactory } from "../../../core/network/factory/ConcreteNetworkFactory";
import { NodeAdapter } from "../../../core/network/adapter/NodeAdapter";

import jsbayes = require("jsbayes");

import {expect} from "chai";

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
});

describe("ConcreteNetworkAdapter - observeNode", () => {
    const jsonSchema = require("../../../core/network/factory/network_structure.schema.json");
    const jsonSchemaString: string = JSON.stringify(jsonSchema);
    it("Correct node, isObserved - True", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        network.observeNode("Example", "Example of string value");

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------

        expect(true).to.equal(true);        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------
    });
    it("Undefined node name - Error", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.observeNode(name, "Example of string value")).to.throw(Error, "invalid parameter");
    });
    it("Incorrect node name - Error", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        expect(()=>network.observeNode("FakeNode", "Example of string value")).to.throw(Error, "Node FakeNode isn't present in the network");
    });
    it("Incorrect node value - Error", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        expect(()=>network.observeNode("Example", "FakeValue")).to.throw(Error, "Node Example hasn't a value called FakeValue");
    });
});

describe("ConcreteNetworkAdapter - unobserveNode", () => {
    const jsonSchema = require("../../../core/network/factory/network_structure.schema.json");
    const jsonSchemaString: string = JSON.stringify(jsonSchema);
    it("Correct node, isObserved - False", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
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
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.unobserveNode(name)).to.throw(Error, "invalid parameter");
    });
    it("Incorrect node name - Error", () => {
        const json = require("../CorrectNetwork.json");
        const jsonString: string = JSON.stringify(json);
    
        const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
        expect(()=>network.unobserveNode("FakeNode")).to.throw(Error, "Node FakeNode isn't present in the network");
    });
});

describe("ConcreteNetworkAdapter - sampleNetwork", () => {
    // TODO
});

describe("ConcreteNetworkAdapter - getNodeProbs", () => {
    // TODO
});

describe("ConcreteNetworkAdapter - getNodeList", () => {
    const jsonSchema = require("../../../core/network/factory/network_structure.schema.json");
    const jsonSchemaString: string = JSON.stringify(jsonSchema);
    it("Correct network, grab second node's name - Second node's name", () => {
      const json = require("../CorrectNetwork.json");
      const jsonString: string = JSON.stringify(json);
      const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
      const nodeOne = s.getNodeList()[1];
      expect(nodeOne.getName()).to.equal('Example2');
    });
});

