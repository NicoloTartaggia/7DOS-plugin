import { ConcreteNetworkAdapter } from "../../../core/network/adapter/ConcreteNetworkAdapter";
import { ConcreteNetworkFactory } from "../../../core/network/factory/ConcreteNetworkFactory";
import { NodeAdapter } from "core/node/NodeAdapter";

import jsbayes = require("jsbayes");

import {expect} from "chai";

describe("ConcreteNetworkAdapter - constructor", () => {
    it("Undefined graph parameter", () => {
        let graph: JGraph;
        let list: Array<NodeAdapter> = new Array<NodeAdapter>();

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined list parameter", () => {
        let graph: JGraph = jsbayes.newGraph();
        let list: Array<NodeAdapter>;

        expect(() => new ConcreteNetworkAdapter(graph, list)).to.throw(TypeError, "invalid parameter");
    });

});

describe("ConcreteNetworkAdapter - observeNode", () => {
    // TODO
});

describe("ConcreteNetworkAdapter - unbserveNode", () => {
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
      expect(JSON.stringify(nodeOne)).to.equal('{"node":{"name":"Example2","values":["Low Range","Normal Range","Alert Range"],"value":-1,"parents":[],"wasSampled":false,"cpt":[0.5992023928215353,0.2003988035892323,0.2003988035892323]},"values":[{"valueName":"Low Range","minRange":0,"maxRange":10},{"valueName":"Normal Range","minRange":11,"maxRange":80},{"valueName":"Alert Range","minRange":81,"maxRange":100}]}');
    });
});