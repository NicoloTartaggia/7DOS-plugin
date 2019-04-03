import { ConcreteNetworkAdapter } from "../../../core/network/adapter/ConcreteNetworkAdapter";
import { ConcreteNetworkFactory } from "../../../core/network/factory/ConcreteNetworkFactory";
import { NodeAdapter } from "core/node/NodeAdapter";

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
    // TODO
});

describe("ConcreteNetworkAdapter - unobserveNode", () => {
    // TODO
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
    it("Base case", () => {
      const json = require("../CorrectNetwork.json");
      const jsonString: string = JSON.stringify(json);
      const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
      const nodeOne = s.getNodeList()[1];
      expect(nodeOne.getName()).to.equal('Example2');
    });
});

