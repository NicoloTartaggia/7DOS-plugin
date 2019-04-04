import { CalcResult } from "../../core/net_manager/result/calculation-result/CalcResult";
import { CalcResultItem } from "../../core/net_manager/result/calculation-result/CalcResultItem";

import {expect} from "chai";

describe("CalcResult - constructor", () => {
    it(" null parameters passed - exception thrown ", () => {
        expect(() => new CalcResult(null,null)).to.throw(Error, "invalid parameter");
    });
    it(" null item in array passed - exception thrown ", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        calcItems.push(new CalcResultItem("2",0.6));
        calcItems.push(new CalcResultItem("3",0.3));
        calcItems.push(null);
        expect(() => new CalcResult(null,calcItems)).to.throw(Error, "invalid parameter");
    });
});

describe("CalcResult - getNodeName", () => {
    it(" base function call- returns node name ", () => {
        let calcItems:Array<CalcResultItem>=new Array<CalcResultItem>();
        calcItems.push(new CalcResultItem("1",0.5));
        expect(new CalcResult("n1",calcItems).getNodeName()).to.equal("n1");
    });
});

describe("CalcResult - getValueProbs", () => {
    it(" base function call- returns node name ", () => {
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
    it(" check deep copy of ValueProbs- ValueProbs is not changed ", () => {
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
