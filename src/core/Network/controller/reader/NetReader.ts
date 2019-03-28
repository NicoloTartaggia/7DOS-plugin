import { NodeAdapter } from "core/node/NodeAdapter";
import { InputFlux } from "./InputFlux";

export class NetReader {
    private inputFlux: Map<NodeAdapter, InputFlux>;
    public constructor(nodeList: Array<NodeAdapter>) {
        for (const node of nodeList) {
            this.inputFlux.set(node, null);
        }
    }
    // TODO: Funzione di read per un NodeAdapter
}
