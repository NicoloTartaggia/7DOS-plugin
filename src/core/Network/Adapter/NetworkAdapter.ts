import { NodeAdapter } from "core/node/NodeAdapter";

export interface NetworkAdapter {
     observeNode(node: string, value: string): void;
     unbserveNode(node: string): void;
     sampleNetwork(sampleNum: number): void;
     getNodeProbs(nodeName: string): Array < number > ;
     getNodeList(): Array<NodeAdapter>;
}
