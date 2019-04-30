import { CalcResult } from "../../../../core/net-manager/result/calculation-result/CalcResult";
import { CalcResultItem } from "../../../../core/net-manager/result/calculation-result/CalcResultItem";

import {expect} from "chai";

describe("CalcResult - constructor", () => {
    it("Undefined nodeName passed - Error", () => {
        let nodeName: string;
        let calcItems:Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        calcItems.push(new CalcResultItem("2",0.6));
        calcItems.push(new CalcResultItem("3",0.3));
        expect(() => new CalcResult(nodeName,calcItems)).to.throw(Error, "[7DOS G&B][CalcResult]constructor - invalid nodeName parameter");
    });
    it("Undefined items passed - Error", () => {
        let calcItems:Array<CalcResultItem>;
        expect(() => new CalcResult("something",calcItems)).to.throw(Error, "[7DOS G&B][CalcResult]constructor - invalid items parameter");
    });
    it("Null item(s) in array passed - Error", () => {
        let calcItems:Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        calcItems.push(new CalcResultItem("2",0.6));
        calcItems.push(new CalcResultItem("3",0.3));
        calcItems.push(null);
        expect(() => new CalcResult("something",calcItems)).to.throw(Error, "[7DOS G&B][CalcResult]constructor - invalid items parameter");
    });
    it("Correct inputs - CalcResult", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        expect(() => new CalcResult("n1",calcItems)).to.not.throw(Error);
    });    
});

describe("CalcResult - getNodeName", () => {
    it("Base function call - Returns node name", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        expect(new CalcResult("n1",calcItems).getNodeName()).to.equal("n1");
    });
});

describe("CalcResult - getValueProbs", () => {
    it("Base function call - Returns node name", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("n5",0.5));
        calcItems.push(new CalcResultItem("n3",0.6));
        let calcResult=new CalcResult("n1",calcItems);
        let probs=calcResult.getValueProbs();
        expect(probs[0].getValueName()).to.equals("n5");
        expect(probs[0].getProbValue()).to.equals(0.5);
        expect(probs[1].getValueName()).to.equals("n3");
        expect(probs[1].getProbValue()).to.equals(0.6);
    });
    it("Check deep copy of ValueProbs - ValueProbs is not changed", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("n5",0.5));
        let calcResult=new CalcResult("n1",calcItems);
        let probs=calcResult.getValueProbs();
        probs[0]=new CalcResultItem("n10",0.9);
        let probs2=calcResult.getValueProbs();
        expect(probs2[0].getValueName()).to.equals("n5");
        expect(probs2[0].getProbValue()).to.equals(0.5);
    });
});
