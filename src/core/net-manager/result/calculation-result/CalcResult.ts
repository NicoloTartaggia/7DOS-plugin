/**
 * @File CalcResult.ts
 * @Type TypeScript file
 * @Desc Contains the CalcResult class.
 */
import {CalcResultItem} from "./calculation-result";

/**
 * @class CalcResult
 * @desc Contains the result of the recalculation of the probabilities for a single node.
 */
export class CalcResult {
  /**
   * @field Name of the node.
   */
  private readonly nodeName: string;
  /**
   * @field Results of the recalculation.
   */
  private readonly items: Array<CalcResultItem>;
  /**
   * @desc Constructor for the CalcResult class.
   * @param nodeName Name of the node.
   * @param items Results of the calculation.
   */
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

  /**
   * @returns The name of the node.
   */
  public getNodeName (): string {
    return this.nodeName;
  }

  /**
   * @returns A deep copy of the probabilities for the node.
   */
  public getValueProbs (): Array<CalcResultItem> {
  // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.items); // returns deep copy
  }
}
