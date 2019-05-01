import { expect } from "chai";
import "mocha";
import { BoolValue } from "../../../core/network/value/BoolValue";

// BoolValue -------------------------------------------------------------------------------
describe("BoolValue - constructor", () => {
    it("Undefined name - Error", () => {
        let str: string;
        expect(() => new BoolValue(true, str)).to.throw(Error, "[7DOS G&B][BoolValue]constructor - invalid name parameter");
    });
    it("Empty name - Error", () => {
        expect(() => new BoolValue(true, "")).to.throw(Error, "[7DOS G&B][BoolValue]constructor - invalid name parameter");
    });
    it("Undefined value - Error", () => {
        let str: boolean;
        expect(() => new BoolValue(str, "name1")).to.throw(Error, "[7DOS G&B][BoolValue]constructor - invalid value parameter");
    });
    it("Correct inputs - BoolValue", () => {
        expect(() => new BoolValue(true, "name1")).to.not.throw(Error);
    });
});

describe("BoolValue - isValueType", () => {
    it("Correct inputs - True", () => {
        const boolV = new BoolValue(true, "name2");
        const result: boolean = boolV.isValueType("true");
        expect(result).to.equal(true);
    });
    it("Wrong value - False", () => {
        const boolV = new BoolValue(false, "name3");
        const result: boolean = boolV.isValueType("true");
        expect(result).to.equal(false);
    });
    it("Randomic value - False", () => {
        const boolV = new BoolValue(false, "name4");
        const result: boolean = boolV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Correct but upper case value - True", () => {
        const boolV = new BoolValue(true, "name5");
        const result: boolean = boolV.isValueType("True");
        expect(result).to.equal(true);
    });
    it("Empty value - Error", () => {
        const boolV = new BoolValue(true, "name6");
        expect(() => boolV.isValueType("")).to.throw(Error, "[7DOS G&B][BoolValue]isValueType - invalid value parameter");
    });
    it("Undefined value - Error", () => {
        const boolV = new BoolValue(true, "name7");
        let str: string;
        expect(() => boolV.isValueType(str)).to.throw(Error, "[7DOS G&B][BoolValue]isValueType - invalid value parameter");
    });
});

describe("BoolValue - getValueName", () => {
    it("Name - Same name", () => {
        const name: string = "name8";
        const boolV = new BoolValue(true, name);
        boolV.isValueType("true");
        boolV.isValueType("false");
        const result: string = boolV.getValueName();
        expect(result).to.equal(name);
    });
});
