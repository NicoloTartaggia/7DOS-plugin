import { NodeAdapter } from "core/node/NodeAdapter";

export class ConcreateNetworkAdapter {
    private graph: JGraph ;
    private readonly nodeList: Array<NodeAdapter>;

    public constructor(network: JGraph, nodeList: Array<NodeAdapter>) {
        this.graph = network;
        this.nodeList = nodeList;
    }

    public observeNode(node: string, value: string): void {
        this.graph.observe(node, value);
    }
    public unbserveNode(node: string): void {
        this.graph.unobserve(node);
    }
    public sampleNetwork(sampleNum: number): void {
        this.graph.sample(sampleNum);
    }
    public getNodeProbs(nodeName: string): Array<number> {
        for (const node of this.graph.nodes) {
            if (node.name === nodeName) {
                return node.probs();
            }
        }
        return null;
    }

    public getNodeList(): Array<NodeAdapter> {
        return this.nodeList;
    }
}
