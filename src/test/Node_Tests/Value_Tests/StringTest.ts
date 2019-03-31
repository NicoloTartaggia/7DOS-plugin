import { expect } from "chai";
import "mocha";
import { StringValue } from "../../../core/node/values/StringValue";

// StringValue -------------------------------------------------------------------------------
describe("StringValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        expect(() => new StringValue("value1", str)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined value parameter", () => {
        let str: string;
        expect(() => new StringValue(str, "name1")).to.throw(TypeError, "invalid parameter");
    });
});

describe("StringValue - isValueType", () => {
    it("Correct inputs", () => {
        const stringV = new StringValue("value2", "name2");
        const result: boolean = stringV.isValueType("value2");
        expect(result).to.equal(true);
    });
    it("Wrong value parameter", () => {
        const stringV = new StringValue("value3", "name3");
        const result: boolean = stringV.isValueType("true");
        expect(result).to.equal(false);
    });
    it("Randomic value parameter", () => {
        const stringV = new StringValue("value4", "name4");
        const result: boolean = stringV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Empty value parameter", () => {
        const stringV = new StringValue("value5", "name5");
        const result: boolean = stringV.isValueType("");
        expect(result).to.equal(false);
    });
    it("Correct but upper case value parameter", () => {
        const stringV = new StringValue("value6", "name6");
        const result: boolean = stringV.isValueType("VALUE6");
        expect(result).to.equal(false);
    });
    it("Undefined value parameter", () => {
        const stringV = new StringValue("value7", "name7");
        let str: string;
        expect(() => stringV.isValueType(str)).to.throw(TypeError, "invalid parameter");
    });
});

describe("StringValue - getValueName", () => {
    it("Base case", () => {
        const name: string = "name8";
        const stringV = new StringValue("value8", name);
        stringV.isValueType("true");
        stringV.isValueType("false");
        const result: string = stringV.getValueName();
        expect(result).to.equal(name);
    });
});
