import {CalcResultItem} from "./calcResultItem";

export class CalcResult {
    private name: string;
    private items: Array<CalcResultItem>;
    public constructor(name: string, items: Array<CalcResultItem>) {
        this.name = name;
        this.items = items;
    }
    public getName(): string {
        return this.name;
    }
    public getValueProbs(): Array<CalcResultItem> {
        return this.items;
    }
}
