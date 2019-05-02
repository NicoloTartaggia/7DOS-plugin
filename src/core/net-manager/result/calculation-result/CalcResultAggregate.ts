/**
 * @File CalcResultAggregate.ts
 * @Type TypeScript file
 * @Desc Contains the CalcResultAggregate class.
 */
import {CalcResult} from "./calculation-result";

/**
 * @class CalcResultAggregate
 * @desc Part of iterator pattern for the calculation results.
 */
export class CalcResultAggregate {
  /**
   * @field Collection of CalcResult items
   */
  private collection: Array<CalcResult>;

  constructor (collection: Array<CalcResult>) {
    if (collection == null || collection.length === 0) {
      throw new Error("invalid collection parameter");
    }
    this.collection = collection;
  }

  /**
   * @desc Creates an iterator.
   * @returns An IterableIterator for the collection.
   */
  public createIterator (): IterableIterator<CalcResult> {
    return this.collection[Symbol.iterator]();
  }
}
