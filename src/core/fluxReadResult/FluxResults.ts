import { FluxResult } from "./FluxResult";

export class FluxResults {
    public collection: Array<FluxResult>;

    public constructor(collection: Array<FluxResult>) {
        this.collection = collection;
    }

    public buildIterator(): IterableIterator<FluxResult> {
        return this.collection[Symbol.iterator]();
    }
}
