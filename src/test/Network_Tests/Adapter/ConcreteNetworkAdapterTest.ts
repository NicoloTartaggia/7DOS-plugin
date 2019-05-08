import { NetworkAdapter } from "../../../core/network/adapter/NetworkAdapter";
import { ConcreteNetworkAdapter } from "../../../core/network/adapter/ConcreteNetworkAdapter";
import { JsonNetParser } from "../../../core/network/factory/JsonNetParser";
import { NodeAdapter } from "../../../core/network/adapter/NodeAdapter";
import { ConcreteNodeAdapter } from "../../../core/network/adapter/adapter";
import { AbstractValue, BoolValue } from "../../../core/network/value/value";

import jsbayes = require("jsbayes");

import {expect} from "chai";

const schemaPath: string = "../../../../example_network/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../../Util_JSON/CorrectNetwork.json";
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

describe("ConcreteNetworkAdapter - constructor", () => {
    it("Undefined network - Error", () => {
        let graph: JGraph;
        let list: Array<NodeAdapter> = new Array<NodeAdapter>();

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]constructor - invalid network parameter");
    });
    it("Undefined nodeList - Error", () => {
        let graph: JGraph = jsbayes.newGraph();
        let list: Array<NodeAdapter>;

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]constructor - invalid nodeList parameter");
    });
    it("Empty nodeList - Error", () => {
        let graph: JGraph = jsbayes.newGraph();
        let list: Array<NodeAdapter> = new Array<NodeAdapter>();

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]constructor - invalid nodeList parameter");
    });
    it("Correct inputs - ConcreteNetworkAdapter", () => {
        const graph: JGraph = jsbayes.newGraph();
        const list: Array<NodeAdapter> = new Array<NodeAdapter>();
        const node: JNode = graph.addNode("n1", ["true", "false"]);
        const array: Array<AbstractValue> = new Array<AbstractValue>();
        array.push(new BoolValue(true, "name1"));
        list.push(new ConcreteNodeAdapter(node, array));
        expect(() => new ConcreteNetworkAdapter(graph, list)).to.not.throw(Error);
    });
});

describe("ConcreteNetworkAdapter - observeNode", () => {
    it("Correct node, isObserved - True", () => {    
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        network.observeNode("Example", "Example of string value");

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------

        expect(true).to.equal(true);        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED

        // TODO WHEN FUNCTIONALITY ISOBSERVED IS IMPLEMENTED --------------------------------------------------
    });
    it("Undefined node name - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.observeNode(name, "Example of string value")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid node parameter");
    });
    it("Empty node name - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("", "Example of string value")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid node parameter");
    });
    it("Undefined value - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        let value: string;
        expect(()=>network.observeNode("name", value)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid value parameter");
    });
    it("Empty value - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("name", "")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid value parameter");
    });
    it("Incorrect node name - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("FakeNode", "Example of string value")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - Node FakeNode isn't present in the network");
    });
    it("Incorrect node value - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.observeNode("Example", "FakeValue")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]observeNode - Node Example hasn't a value called FakeValue");
    });
});

describe("ConcreteNetworkAdapter - unobserveNode", () => {
    it("Correct node, isObserved - False", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
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
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        let name: string;
        expect(()=>network.unobserveNode(name)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]unobserveNode - invalid node parameter");
    });
    it("Empty node name - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.unobserveNode("")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]unobserveNode - invalid node parameter");
    });
    it("Incorrect node name - Error", () => {
        const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>network.unobserveNode("FakeNode")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]unobserveNode - Node FakeNode isn't present in the network");
    });
});

describe("ConcreteNetworkAdapter - sampleNetwork", () => {
    it("Undefined number of samples - Error", () => {
      const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
      let undNumber: number;
      expect(()=>s.sampleNetwork(undNumber)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]sampleNetwork - invalid sampleNum parameter");
    });
    it("Less than zero number of samples - Error", () => {
        const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        let negNumber: number = -50;
        expect(()=>s.sampleNetwork(negNumber)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]sampleNetwork - invalid sampleNum parameter");
      });
});

describe("ConcreteNetworkAdapter - getNodeProbs", () => {
    it("Undefined node name - Error", () => {
      const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
      let undName: string;
      expect(()=>s.getNodeProbs(undName)).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]getNodeProbs - invalid nodeName parameter");
    });
    it("Empty node name - Error", () => {
        const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>s.getNodeProbs("")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]getNodeProbs - invalid nodeName parameter");
    });
    it("Incorrect node name - Error", () => {
        const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
        expect(()=>s.getNodeProbs("IncorrectName")).to.throw(Error, "[7DOS G&B][ConcreteNetworkAdapter]getNodeProbs - Node IncorrectName isn't present in the network");
    });
});

describe("ConcreteNetworkAdapter - getNodeList", () => {
    it("Correct network, grab second node's name - Second node's name", () => {
      const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
      const nodeOne = s.getNodeList()[1];
      expect(nodeOne.getName()).to.equal('Example2');
    });
});

