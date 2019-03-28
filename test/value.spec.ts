import { expect } from "chai";
import "mocha";
import { BoolValue } from "../src/core/node/Value/BoolValue";
import { RangeValue } from "../src/core/node/Value/RangeValue";
import { StringValue } from "../src/core/node/Value/StringValue";

// BoolValue -------------------------------------------------------------------------------
describe("BoolValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        expect(() => new BoolValue(true, str)).to.throw(TypeError, "invalid parameter");
    });
    it("Undefined value parameter", () => {
        let str: boolean;
        try {
            const a: BoolValue = new BoolValue(str, "name1");
            a.getName();
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
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
        try {
            boolV.isValueType(str);
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
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

// StringValue -------------------------------------------------------------------------------
describe("StringValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        try {
            const a: StringValue = new StringValue("value1", str);
            a.getName();
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
    });
    it("Undefined value parameter", () => {
        let str: string;
        try {
            const a: StringValue = new StringValue(str, "name1");
            a.getName();
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
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
        try {
            stringV.isValueType(str);
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
    });
});

describe("StringValue - getName", () => {
    it("Base case", () => {
        const name: string = "name8";
        const stringV = new StringValue("value8", name);
        stringV.isValueType("true");
        stringV.isValueType("false");
        const result: string = stringV.getName();
        expect(result).to.equal(name);
    });
});

// RangeValue -------------------------------------------------------------------------------
describe("RangeValue - constructor", () => {
    it("Undefined name parameters", () => {
        let str: string;
        try {
            const rangeV: RangeValue = new RangeValue(30, 70, str);
            rangeV.getName();
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
    });
    it("Undefined minRange, maxRange parameter", () => {
        let n1: number;
        let n2: number;
        try {
            const rangeV: RangeValue = new RangeValue(n1, n2, "name1");
            rangeV.getName();
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
    });
    it("Inverted minRange, maxRange parameter", () => {
        try {
            const rangeV: RangeValue = new RangeValue(70, 30, "name1");
            rangeV.getName();
        } catch (e) {
            expect(e.message).to.equal("maxRange is less then minRange");
        }
    });
    it("minRange === maxRange", () => {
        const name: string = "name1";
        const rangeV: RangeValue = new RangeValue(50, 50, name);
        rangeV.getName();
        expect(rangeV.getName()).to.equal(name);
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
        try {
            rangeV.isValueType(str);
        } catch (e) {
            expect(e.message).to.equal("invalid parameter");
        }
    });
    it("value === minRange === maxRange", () => {
        const rangeV = new RangeValue(50, 50, "name8");
        const result: boolean = rangeV.isValueType("50");
        expect(result).to.equal(true);
    });
});

describe("RangeValue - getName", () => {
    it("Base case", () => {
        const name: string = "name9";
        const rangeV = new RangeValue(30, 70, name);
        rangeV.isValueType("true");
        rangeV.isValueType("false");
        const result: string = rangeV.getName();
        expect(result).to.equal(name);
    });
});
