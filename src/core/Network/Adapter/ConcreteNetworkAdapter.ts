import { NetworkAdapter } from "core/network/adapter/NetworkAdapter";
import { NodeAdapter } from "core/node/NodeAdapter";

export class ConcreateNetworkAdapter implements NetworkAdapter {
    private graph: JGraph ;
    private readonly nodeList: Array<NodeAdapter>;

    public constructor(network: JGraph, nodeList: Array<NodeAdapter>) {
        this.graph = network;
        this.nodeList = nodeList;
    }

    /**
     * @Override - Function that fixes a specific values (state) for a node in the network
     */
    public observeNode(node: string, value: string): void {
        this.graph.observe(node, value);
    }

    /**
     * @Override - Function that remove the node from the observed nodes
     */
    public unbserveNode(node: string): void {
        this.graph.unobserve(node);
    }

    /**
     * @Override - Function that makes the number of sample specified in sampleNum
     */
    public sampleNetwork(sampleNum: number): void {
        this.graph.sample(sampleNum);
    }

    /**
     * @Override - Function that retuns the probs of a specific node
     * @returns Return a Array<number> that represent the probs of a specific node
     */
    public getNodeProbs(nodeName: string): Array<number> {
        for (const node of this.graph.nodes) {
            if (node.name === nodeName) {
                return node.probs();
            }
        }
        return null;
    }

    /**
     * @Override - Function that retuns the NodeList
     * @returns Return a Array<NodeAdapter> that represent the NodeList
     */
    public getNodeList(): Array<NodeAdapter> {
        return this.nodeList;
    }
}
