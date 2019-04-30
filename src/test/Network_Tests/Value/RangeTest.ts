import { expect } from "chai";
import "mocha";
import { RangeValue } from "../../../core/network/value/RangeValue";

// RangeValue -------------------------------------------------------------------------------
describe("RangeValue - constructor", () => {
    it("Undefined name - Error", () => {
        let str: string;
        expect(() => new RangeValue(30, 70, str)).to.throw(Error, "[7DOS G&B][RangeValue]constructor - invalid name parameter");
    });
    it("Empty name - Error", () => {
        expect(() => new RangeValue(30, 70, "")).to.throw(Error, "[7DOS G&B][RangeValue]constructor - invalid name parameter");
    });
    it("Undefined minRange, maxRange - Error", () => {
        let n1: number;
        let n2: number;
        expect(() => new RangeValue(n1, 8, "name1")).to.throw(Error, "[7DOS G&B][RangeValue]constructor - invalid minRange parameter");
        expect(() => new RangeValue(8, n2, "name1")).to.throw(Error, "[7DOS G&B][RangeValue]constructor - invalid maxRange parameter");
    });
    it("Inverted minRange, maxRange - Error", () => {
        expect(() => new RangeValue(70, 30, "name1")).to.throw(Error, "[7DOS G&B][RangeValue]constructor - maxRange is less then minRange");
    });
    it("minRange === maxRange - Ok", () => {
        const name: string = "name1";
        const rangeV: RangeValue = new RangeValue(50, 50, name);
        rangeV.getValueName();
        expect(rangeV.getValueName()).to.equal(name);
    });
    it("Correct input - RangeValue", () => {
        expect(() => new RangeValue(30, 50, "name1")).to.not.throw(Error);
    });
});

describe("RangeValue - isValueType", () => {
    it("Correct input - True", () => {
        const rangeV = new RangeValue(30, 70, "name2");
        const result: boolean = rangeV.isValueType("50");
        expect(result).to.equal(true);
    });
    it("Limit input value - True", () => {
        const rangeV = new RangeValue(30, 70, "name3");
        const result: boolean = rangeV.isValueType("70");
        expect(result).to.equal(true);
    });
    it("Randomic value - False", () => {
        const rangeV = new RangeValue(30, 70, "name4");
        const result: boolean = rangeV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Wrong value - False", () => {
        const rangeV = new RangeValue(30, 70, "name5");
        const result: boolean = rangeV.isValueType("20");
        expect(result).to.equal(false);
    });
    it("Undefined value - Error", () => {
        const rangeV = new RangeValue(30, 70, "name6");
        let str: string;
        expect(() => rangeV.isValueType(str)).to.throw(Error, "[7DOS G&B][RangeValue]isValueType - invalid value parameter");
    });
    it("Empty value - False", () => {
        const rangeV = new RangeValue(30, 70, "name7");
        expect(() => rangeV.isValueType("")).to.throw(Error, "[7DOS G&B][RangeValue]isValueType - invalid value parameter");
    });
    it("value === minRange === maxRange - True", () => {
        const rangeV = new RangeValue(50, 50, "name8");
        const result: boolean = rangeV.isValueType("50");
        expect(result).to.equal(true);
    });
});

describe("RangeValue - getValueName", () => {
    it("Name - Same name", () => {
        const name: string = "name9";
        const rangeV = new RangeValue(30, 70, name);
        rangeV.isValueType("true");
        rangeV.isValueType("false");
        const result: string = rangeV.getValueName();
        expect(result).to.equal(name);
    });
});
