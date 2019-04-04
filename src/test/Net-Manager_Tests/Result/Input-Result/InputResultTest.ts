import { InputResult } from "../../../../core/net-manager/result/input-result/InputResult";
import { ConcreteNodeAdapter } from "../../../../core/network/adapter/adapter";
import { BoolValue, AbstractValue } from "../../../../core/network/value/value";

import {expect} from "chai";
import jsbayes = require("jsbayes");

describe("InputResult - constructor", () => {
    it("Undefined nodeName - Error", () => {
        let nodeName: ConcreteNodeAdapter;
        expect(() => new InputResult(nodeName, "valore")).to.throw(Error, "invalid parameter");
    });
    it("Undefined currentValue - Error", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
        const values: Array<AbstractValue> = new Array<AbstractValue>();
        values.push(new BoolValue(true, "prova"));
        
        const nodeName: ConcreteNodeAdapter = new ConcreteNodeAdapter(n1, values);
        let currentValue: string;
        expect(() => new InputResult(nodeName, currentValue)).to.throw(Error, "invalid parameter");
    });
});

describe("InputResult - getNode", () => {
    it("Node - Node", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
        const values: Array<AbstractValue> = new Array<AbstractValue>();
        values.push(new BoolValue(true, "prova"));
        
        const nodeName: ConcreteNodeAdapter = new ConcreteNodeAdapter(n1, values);
        const currentValue: string = "valore";
        const name: string = new InputResult(nodeName, currentValue).getNode().getName();
        expect(name).to.equal("n1");
    });
});

describe("InputResult - getCurrentValue", () => {
    it("Value - Value", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
        const values: Array<AbstractValue> = new Array<AbstractValue>();
        values.push(new BoolValue(true, "prova"));
        
        const nodeName: ConcreteNodeAdapter = new ConcreteNodeAdapter(n1, values);
        const currentValue: string = "valore";
        const getCurrent: string = new InputResult(nodeName, currentValue).getCurrentValue();
        expect(getCurrent).to.equal("valore");
    });
});
