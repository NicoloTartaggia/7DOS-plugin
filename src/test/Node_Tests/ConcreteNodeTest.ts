import { expect } from "chai";
import { ConcreteNodeAdapter } from "core/node/ConcreteNodeAdapter";
import { AbstractValue } from "core/node/Value/AbstractValue";
import { BoolValue } from "core/node/Value/BoolValue";
import jsbayes = require("jsbayes");
import "mocha";

// ConcreteNode -------------------------------------------------------------------------------
describe("ConcreteNode - constructor", () => {
    it("Undefined node parameter", () => {
// tslint:disable-next-line: prefer-const
        let node: JNode;
        const values: Array<AbstractValue> = new Array<AbstractValue>();

        expect(() => new ConcreteNodeAdapter(node, values)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined values parameter", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
// tslint:disable-next-line: prefer-const
        let values: Array<AbstractValue>;

        expect(() => new ConcreteNodeAdapter(n1, values)).to.throw(TypeError, "invalid parameter");
    });
});

describe("ConcreteNode - getStates", () => {
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

describe("ConcreteNode - getValues", () => {
    it("Same list comparison", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        expect(concreteNode.getValues().toLocaleString()).to.equal("false,true,true");
    });
    it("Reverse returned list comparison with original", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);

        const concreteNodeValues: Array<AbstractValue> = new Array<AbstractValue>();
        concreteNodeValues.push(new BoolValue(false, "boolvalue-1"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));
        concreteNodeValues.push(new BoolValue(true, "boolvalue-2"));

        const concreteNode = new ConcreteNodeAdapter(n1, concreteNodeValues);
        const values: Array<AbstractValue> = concreteNode.getValues();
        values.reverse();
        expect(concreteNode.getValues().toLocaleString()).to.equal("false,true,true");
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
        values.forEach((element) => {
            expect(element.getValueName()).to.not.equal("true,true,false");
        });
    });
});
