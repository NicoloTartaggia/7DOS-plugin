import { expect } from "chai";
import { RangeValue } from "core/node/Value/RangeValue";
import "mocha";

// RangeValue -------------------------------------------------------------------------------
describe("RangeValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        expect(() => new RangeValue(30, 70, str)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined minRange, maxRange parameter", () => {
        let n1: number;
        let n2: number;
        expect(() => new RangeValue(n1, n2, "name1")).to.throw(TypeError, "invalid parameter");
    });
    it("Inverted minRange, maxRange parameter", () => {
        expect(() => new RangeValue(70, 30, "name1")).to.throw(TypeError, "maxRange is less then minRange");
    });
    it("minRange === maxRange", () => {
        const name: string = "name1";
        const rangeV: RangeValue = new RangeValue(50, 50, name);
        rangeV.getValueName();
        expect(rangeV.getValueName()).to.equal(name);
    });
});

describe("RangeValue - isValueType", () => {
    it("Correct input", () => {
        const rangeV = new RangeValue(30, 70, "name2");
        const result: boolean = rangeV.isValueType("50");
        expect(result).to.equal(true);
    });
    it("Limit input value", () => {
        const rangeV = new RangeValue(30, 70, "name3");
        const result: boolean = rangeV.isValueType("70");
        expect(result).to.equal(true);
    });
    it("Randomic value parameter", () => {
        const rangeV = new RangeValue(30, 70, "name4");
        const result: boolean = rangeV.isValueType("brzcld");
        expect(result).to.equal(false);
    });
    it("Empty value parameter", () => {
        const rangeV = new RangeValue(30, 70, "name5");
        const result: boolean = rangeV.isValueType("");
        expect(result).to.equal(false);
    });
    it("Wrong value parameter", () => {
        const rangeV = new RangeValue(30, 70, "name6");
        const result: boolean = rangeV.isValueType("20");
        expect(result).to.equal(false);
    });
    it("Undefined value parameter", () => {
        const rangeV = new RangeValue(30, 70, "name7");
        let str: string;
        expect(() => rangeV.isValueType(str)).to.throw(TypeError, "invalid parameter");
    });
    it("value === minRange === maxRange", () => {
        const rangeV = new RangeValue(50, 50, "name8");
        const result: boolean = rangeV.isValueType("50");
        expect(result).to.equal(true);
    });
});

describe("RangeValue - getValueName", () => {
    it("Base case", () => {
        const name: string = "name9";
        const rangeV = new RangeValue(30, 70, name);
        rangeV.isValueType("true");
        rangeV.isValueType("false");
        const result: string = rangeV.getValueName();
        expect(result).to.equal(name);
    });
});
