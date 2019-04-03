import { CalcResultItem } from "../../core/calculation_result/CalcResultItem";

import {expect} from "chai";

describe("CalcResultItem - constructor", () => {
    it(" null parameter - exception thrown ", () => {
        expect(() => new CalcResultItem(null,null)).to.throw(Error, "invalid parameter");
    });
    it(" negative prob - exception thrown ", () => {
        expect(() => new CalcResultItem("n1",-5)).to.throw(Error, "invalid parameter");
    });
    it(" prob greater than 1 - exception thrown ", () => {
        expect(() => new CalcResultItem("n1",1.1)).to.throw(Error, "invalid parameter");
    });
});

describe("CalcResultItem - getValueName", () => {
    it(" Base method call-correct name returned ", () => {
        expect(new CalcResultItem("n1",0.5).getValueName()).to.equal("n1");
    });
});

describe("CalcResultItem - getProbValue", () => {
    it(" Base method call-correct value returned ", () => {
        expect(new CalcResultItem("n1",0.5).getProbValue()).to.equal(0.5);
    });
});