import {expect} from "chai";
import { CalcResult, CalcResultAggregate, CalcResultItem } from "../../../../core/net-manager/result/result";

describe("CalcResultAggregate - constructor", () => {
    it("Undefined collection - Error", () => {
        let collection: Array<CalcResult>;
        expect(()=> new CalcResultAggregate(collection)).to.throw(Error, "invalid collection parameter");
    });
    it("Empty collection - Error", () => {
        let collection: Array<CalcResult> = new Array<CalcResult>();
        expect(()=> new CalcResultAggregate(collection)).to.throw(Error, "invalid collection parameter");
    });
});

describe("CalcResultAggregate - createIterator", () => {
    it("Base case - Given node", () => {
        let collection: Array<CalcResult> = new Array<CalcResult>();
        let itemsArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        itemsArray.push(new CalcResultItem("stringa", 1));
        collection.push(new CalcResult("nodo", itemsArray));
        expect(new CalcResultAggregate(collection).createIterator().next().value.getNodeName()).to.equal("nodo");
    });
});
