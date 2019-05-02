/**
 * @File InputResultAggregate.ts
 * @Type TypeScript file
 * @Desc Contains the InputResultAggregate class.
 */
import {InputResult} from "./input-result";
/**
 * @class InputResultAggregate
 * @desc Part of iterator pattern for the reading results.
 */
export class InputResultAggregate {
  /**
   * @field Collection of InputResult items
   */
  public collection: Array<InputResult>;

  public constructor (collection: Array<InputResult>) {
    if (collection == null) {
      throw new Error("invalid collection parameter");
    }
    this.collection = collection;
  }
  /**
   * @desc Creates an iterator.
   * @returns An IterableIterator for the collection.
   */
  public buildIterator (): IterableIterator<InputResult> {
    return this.collection[Symbol.iterator]();
  }
}
