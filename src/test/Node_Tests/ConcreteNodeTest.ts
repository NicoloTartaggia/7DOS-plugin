import { expect } from "chai";
import jsbayes = require("jsbayes");
import "mocha";
import { ConcreteNodeAdapter } from "../../core/node/ConcreteNodeAdapter";
import { AbstractValue } from "../../core/node/Value/AbstractValue";
import { BoolValue } from "../../core/node/Value/BoolValue";

// ConcreteNode -------------------------------------------------------------------------------
describe("ConcreteNodeAdapter - constructor", () => {
    it("Undefined node parameter", () => {
        let node: JNode;
        const values: Array<AbstractValue> = new Array<AbstractValue>();

        expect(() => new ConcreteNodeAdapter(node, values)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined values parameter", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
        let values: Array<AbstractValue>;

        expect(() => new ConcreteNodeAdapter(n1, values)).to.throw(TypeError, "invalid parameter");
    });
});

describe("ConcreteNodeAdapter - getStates", () => {
    it("Same list comparison", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNode = new ConcreteNodeAdapter(n1, new Array<AbstractValue>());
        const states: Array<string> = concreteNode.getStates();
        expect(states.toLocaleString()).to.equal("true,false");
    });
    it("Reverse returned list comparison with original", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNode = new ConcreteNodeAdapter(n1, new Array<AbstractValue>());
        const states = concreteNode.getStates();
        states.reverse();

        expect(concreteNode.getStates().toLocaleString()).to.equal("true,false");
    });
    it("Other list comparison", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNode = new ConcreteNodeAdapter(n1, new Array<AbstractValue>());
        const states = concreteNode.getStates();

        expect(states.toLocaleString()).to.not.equal("false,true");
    });
 });

describe("ConcreteNodeAdapter - getValues", () => {
    it("Same list comparison", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-3"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const values: Array<AbstractValue> = concreteNode.getValues();
        expect(values[0].getValueName()).to.equal("boolvalue-1");
        expect(values[1].getValueName()).to.equal("boolvalue-2");
        expect(values[2].getValueName()).to.equal("boolvalue-3");
    });
    it("Reverse returned list comparison with original", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-3"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const values: Array<AbstractValue> = concreteNode.getValues();
        values.reverse();
        const newValues = concreteNode.getValues();
        expect(newValues[0].getValueName()).to.equal("boolvalue-1");
        expect(newValues[1].getValueName()).to.equal("boolvalue-2");
        expect(newValues[2].getValueName()).to.equal("boolvalue-3");
    });
    it("Other list comparison", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const values: Array<AbstractValue> = concreteNode.getValues();

        let str: string;
        expect(values[0].getValueName()).to.not.equal("tizio");
        expect(values[1].getValueName()).to.not.equal(str);
        expect(values[2].getValueName()).to.not.equal("");
    });
});

describe("ConcreteNodeAdapter - findValue", () => {
    it("Look for a value present in the array", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-3"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const value: AbstractValue = concreteNode.findValue("true");
        expect(value.getValueName()).to.equal("boolvalue-2");
    });
    it("Look for a value not present in the array", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-3"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const value: AbstractValue = concreteNode.findValue("valorechenonce");
        expect(value).to.equal(null);
    });
    it("Look for a null value", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-3"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        let str: string;

        expect(() => concreteNode.findValue(str)).to.throw(TypeError, "invalid parameter");
    });
});