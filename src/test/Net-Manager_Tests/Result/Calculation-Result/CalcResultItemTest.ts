import { CalcResultItem } from "../../../../core/net-manager/result/calculation-result/CalcResultItem";

import {expect} from "chai";

describe("CalcResultItem - constructor", () => {
    it("Null valueName - Error", () => {
        expect(() => new CalcResultItem(null,null)).to.throw(Error, "[7DOS G&B][CalcResultItem]constructor - invalid valueName parameter");
    });
    it("Negative prob - Error", () => {
        expect(() => new CalcResultItem("n1",-5)).to.throw(Error, "[7DOS G&B][CalcResultItem]constructor - invalid probValue parameter");
    });
    it("Prob greater than 1 - Error", () => {
        expect(() => new CalcResultItem("n1",1.1)).to.throw(Error, "[7DOS G&B][CalcResultItem]constructor - invalid probValue parameter");
    });
    it("Correct inputs - Error", () => {
        expect(() => new CalcResultItem("n1",0.5)).to.not.throw(Error);
    });
});

describe("CalcResultItem - getValueName", () => {
    it("Base method call - Correct name returned", () => {
        expect(new CalcResultItem("n1",0.5).getValueName()).to.equal("n1");
    });
});

describe("CalcResultItem - getProbValue", () => {
    it("Base method call - Correct value returned", () => {
        expect(new CalcResultItem("n1",0.5).getProbValue()).to.equal(0.5);
    });
});
