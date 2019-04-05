import {InputResult} from "./InputResult";

export class InputResultAggregate {
  public collection: Array<InputResult>;

  public constructor (collection: Array<InputResult>) {
    if (collection == null) {
      throw new Error("invalid collection parameter");
    }
    this.collection = collection;
  }

  public buildIterator (): IterableIterator<InputResult> {
    return this.collection[Symbol.iterator]();
  }
}
