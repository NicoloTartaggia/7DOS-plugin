/**
 * @File NetworkAdapter.ts
 * @Type TypeScript file
 * @Desc Contains the NetworkAdapter iterface declaration.
 */
import {NodeAdapter} from "./adapter";
export interface NetworkAdapter {
  observeNode (node: string, value: string): void;

  unobserveNode (node: string): void;

  sampleNetwork (sampleNum: number): void;

  getNodeProbs (nodeName: string): Array<number>;

  getNodeList (): Array<NodeAdapter>;

  getJgraphCopy(): JGraph;
}
