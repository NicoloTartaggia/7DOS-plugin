import { InputResultAggregate } from "../../../../core/net-manager/result/input-result/InputResultAggregate";
import { InputResult } from "../../../../core/net-manager/result/result";
import { ConcreteNodeAdapter } from "../../../../core/network/adapter/adapter";
import { BoolValue, AbstractValue } from "../../../../core/network/value/value";

import {expect} from "chai";
import jsbayes = require("jsbayes");

describe("InputResultAggregate - constructor", () => {
    it("Undefined collection - Error", () => {
        let collection: Array<InputResult>;
        expect(() => new InputResultAggregate(collection)).to.throw(Error, "invalid collection parameter");
    });
});

describe("InputResultAggregate - buildIterator", () => {
    it("Nodo - Nodo", () => {
        const graph: JGraph = jsbayes.newGraph();
        const n1: JNode = graph.addNode("n1", ["true", "false"]);
        const values: Array<AbstractValue> = new Array<AbstractValue>();
        values.push(new BoolValue(true, "prova"));
        
        const nodeName: ConcreteNodeAdapter = new ConcreteNodeAdapter(n1, values);
        const currentValue: string = "valore";

        const collection: Array<InputResult> = new Array<InputResult>();
        collection.push(new InputResult(nodeName, currentValue));
        expect(new InputResultAggregate(collection).buildIterator().next().value.getCurrentValue()).to.equal("valore");
    });
});
