import { expect } from "chai";
import "mocha";
import { StringValue } from "../../../core/network/value/StringValue";

// StringValue -------------------------------------------------------------------------------
describe("StringValue - constructor", () => {
    it("Undefined name - Error", () => {
        let str: string;
        expect(() => new StringValue("value1", str)).to.throw(Error, "invalid parameter");
    });
    it("Empty name - Error", () => {
        expect(() => new StringValue("value1", "")).to.throw(Error, "invalid parameter");
    });
    it("Undefined value - Error", () => {
        let str: string;
        expect(() => new StringValue(str, "name1")).to.throw(Error, "invalid parameter");
    });
    it("Empty value - Error", () => {
        expect(() => new StringValue("", "name1")).to.throw(Error, "invalid parameter");
    });
});

describe("StringValue - isValueType", () => {
    it("Correct inputs - True", () => {
        const stringV = new StringValue("value2", "name2");
        const result: boolean = stringV.isValueType("value2");
        expect(result).to.equal(true);
    });
    it("Wrong value - False", () => {
        const stringV = new StringValue("value3", "name3");
        const result: boolean = stringV.isValueType("true");
        expect(result).to.equal(false);
    });
    it("Randomic value - False", () => {
        const stringV = new StringValue("value4", "name4");
        const result: boolean = stringV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Empty value - Error", () => {
        const stringV = new StringValue("value5", "name5");
        expect(() => stringV.isValueType("")).to.throw(Error, "invalid parameter");
    });
    it("Correct but upper case value - False", () => {
        const stringV = new StringValue("value6", "name6");
        const result: boolean = stringV.isValueType("VALUE6");
        expect(result).to.equal(false);
    });
    it("Undefined value - Error", () => {
        const stringV = new StringValue("value7", "name7");
        let str: string;
        expect(() => stringV.isValueType(str)).to.throw(Error, "invalid parameter");
    });
    it("Empty value - Error", () => {
        const stringV = new StringValue("value8", "name8");
        expect(() => stringV.isValueType("")).to.throw(Error, "invalid parameter");
    });
});

describe("StringValue - getValueName", () => {
    it("Name - Same name", () => {
        const name: string = "name8";
        const stringV = new StringValue("value8", name);
        stringV.isValueType("true");
        stringV.isValueType("false");
        const result: string = stringV.getValueName();
        expect(result).to.equal(name);
    });
});
