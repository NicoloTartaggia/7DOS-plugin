import { expect } from "chai";
import "mocha";
import { BoolValue } from "../../src/core/node/Value/BoolValue";

// BoolValue -------------------------------------------------------------------------------
describe("BoolValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        expect(() => new BoolValue(true, str)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined value parameter", () => {
        let str: boolean;
        expect(() => new BoolValue(str, "name1")).to.throw(TypeError, "invalid parameter");
    });
});

describe("BoolValue - isValueType", () => {
    it("Correct inputs", () => {
        const boolV = new BoolValue(true, "name2");
        const result: boolean = boolV.isValueType("true");
        expect(result).to.equal(true);
    });
    it("Wrong value parameter", () => {
        const boolV = new BoolValue(false, "name3");
        const result: boolean = boolV.isValueType("true");
        expect(result).to.equal(false);
    });
    it("Randomic value parameter", () => {
        const boolV = new BoolValue(false, "name4");
        const result: boolean = boolV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Empty value parameter", () => {
        const boolV = new BoolValue(true, "name5");
        const result: boolean = boolV.isValueType("");
        expect(result).to.equal(false);
    });
    it("Correct but upper case value parameter", () => {
        const boolV = new BoolValue(true, "name6");
        const result: boolean = boolV.isValueType("True");
        expect(result).to.equal(true);
    });
    it("Undefined value parameter", () => {
        const boolV = new BoolValue(true, "name7");
        let str: string;
        expect(() => boolV.isValueType(str)).to.throw(TypeError, "invalid parameter");
    });
});

describe("BoolValue - getName", () => {
    it("Base case", () => {
        const name: string = "name8";
        const boolV = new BoolValue(true, name);
        boolV.isValueType("true");
        boolV.isValueType("false");
        const result: string = boolV.getName();
        expect(result).to.equal(name);
    });
});
