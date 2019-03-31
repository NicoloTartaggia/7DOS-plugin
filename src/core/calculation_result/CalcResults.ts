import {CalcResult} from "./CalcResult";

export class CalcResults {
  private collection: Array<CalcResult>;

  constructor (collection: Array<CalcResult>) {
    this.collection = collection;
  }

  public createIterator (): IterableIterator<CalcResult> {
    return this.collection[Symbol.iterator]();
  }
}
