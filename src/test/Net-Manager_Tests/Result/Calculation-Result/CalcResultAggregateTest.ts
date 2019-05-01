import {expect} from "chai";
import { CalcResult, CalcResultAggregate, CalcResultItem } from "../../../../core/net-manager/result/result";

describe("CalcResultAggregate - constructor", () => {
    it("Undefined collection - Error", () => {
        let collection: Array<CalcResult>;
        expect(()=> new CalcResultAggregate(collection)).to.throw(Error, "[7DOS G&B][CalcResultAggregate]constructor - invalid collection parameter");
    });
    it("Empty collection - Error", () => {
        let collection: Array<CalcResult> = new Array<CalcResult>();
        expect(()=> new CalcResultAggregate(collection)).to.throw(Error, "[7DOS G&B][CalcResultAggregate]constructor - invalid collection parameter");
    });
    it("Correct inputs - CalcResultAggregate", () => {
        let collection: Array<CalcResult> = new Array<CalcResult>();
        let itemsArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        itemsArray.push(new CalcResultItem("stringa", 1));
        collection.push(new CalcResult("nodo", itemsArray));        
        expect(()=> new CalcResultAggregate(collection)).to.not.throw(Error);
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
