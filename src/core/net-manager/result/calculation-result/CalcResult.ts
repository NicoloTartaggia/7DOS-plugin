import {CalcResultItem} from "./CalcResultItem";

export class CalcResult {
  private readonly nodeName: string;
  private readonly items: Array<CalcResultItem>;

  public constructor (nodeName: string, items: Array<CalcResultItem>) {
    if (nodeName == null || items == null) {
      throw new Error("invalid parameter");
    }
    for (const item of items) {
      if (item === null) {
        throw new Error("invalid parameter");
      }
    }
    this.nodeName = nodeName;
    this.items = items;
  }

  public getNodeName (): string {
    return this.nodeName;
  }

  public getValueProbs (): Array<CalcResultItem> {
  // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.items); // returns deep copy
  }
}
