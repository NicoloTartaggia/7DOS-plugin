import {CalcResultItem} from "./calcResultItem";

export class CalcResult {
  private readonly name: string;
  private readonly items: Array<CalcResultItem>;

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
