import {CalcResult} from "./CalcResult";

export class CalcResultAggregate {
  private collection: Array<CalcResult>;

  constructor (collection: Array<CalcResult>) {
    if (collection == null || collection.length === 0) {
      throw new Error("invalid collection parameter");
    }
    this.collection = collection;
  }

  public createIterator (): IterableIterator<CalcResult> {
    return this.collection[Symbol.iterator]();
  }
}
