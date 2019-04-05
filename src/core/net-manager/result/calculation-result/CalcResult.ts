import {CalcResultItem} from "./CalcResultItem";

export class CalcResult {
  private readonly nodeName: string;
  private readonly items: Array<CalcResultItem>;

  public constructor (nodeName: string, items: Array<CalcResultItem>) {
    if (nodeName == null || nodeName.length === 0) {
      throw new Error("invalid nodeName parameter");
    }
    if (items == null || items.length === 0) {
      throw new Error("invalid items parameter");
    }
    for (const item of items) {
      if (item === null) {
        throw new Error("invalid items parameter");
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
