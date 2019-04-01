import {CalcResultItem} from "./CalcResultItem";

export class CalcResult {
  private readonly nodeName: string;
  private readonly items: Array<CalcResultItem>;

  public constructor(nodeName: string, items: Array<CalcResultItem>) {
    this.nodeName = name;
    this.items = items;
  }
  public getNodeName(): string {
    return this.nodeName;
  }
  public getValueProbs(): Array<CalcResultItem> {
    return this.items;
  }
}
