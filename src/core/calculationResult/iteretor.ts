import { CalcResult } from "./CalcResult";

interface Iterator<T> {
    next(): T;
    hasNext(): boolean;
}

interface Collection<T> {
    createIterator(): Iterator<T>;
  }

class CalcResultIterator implements Iterator<CalcResult> {
    private collection: Array<CalcResult>;
    private index: number = 0;

    constructor(newCollection: Array<CalcResult>) {
      this.collection = newCollection;
    }

    public next(): any {
      const result = this.collection[this.index];
      this.index += 1;
      return result;
    }

    public hasNext(): boolean {
      return this.index < this.collection.length;
    }
  }

export class CalcResults implements Collection<CalcResult> {
    private collection: Array<CalcResult> = [];

    constructor(collection: Array<CalcResult>) {
      this.collection = collection;
    }

    public createIterator(): Iterator<CalcResult> {
      return new CalcResultIterator(this.collection);
    }
  }
