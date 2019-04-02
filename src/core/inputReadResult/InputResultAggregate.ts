import { InputResult } from "./InputResult";

export class InputResultAggregate {
  public collection: Array<InputResult>;

  public constructor(collection: Array<InputResult>) {
    this.collection = collection;
  }

  public buildIterator(): IterableIterator<InputResult> {
    return this.collection[Symbol.iterator]();
  }
}
