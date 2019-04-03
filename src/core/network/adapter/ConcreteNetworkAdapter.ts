import {NetworkAdapter} from "./NetworkAdapter";
import {NodeAdapter} from "./NodeAdapter";

export class ConcreteNetworkAdapter implements NetworkAdapter {
  private graph: JGraph;
  private readonly nodeList: Array<NodeAdapter>;

  public constructor (network: JGraph, nodeList: Array<NodeAdapter>) {
    if (network == null || nodeList == null) {
      throw new Error("invalid parameter");
    }
    this.graph = network;
    this.nodeList = nodeList;
  }

  /**
   * @Override - Function that fixes a specific values (state) for a node in the network
   */
  public observeNode (node: string, value: string): void {
    if (node == null || value == null) {
      throw new Error("invalid parameter");
    }
    let isPresent: boolean = false;
    let valueIsCorrect: boolean = false;
    for (const jn of this.graph.nodes) {
      if (jn.name === node) {
        isPresent = true;
        for (const val of jn.values) {
          if (val === value) {
            valueIsCorrect = true;
            break;
          }
        }
        break;
      }
    }
    if (isPresent === false) {
      throw new Error("Node " + node + " isn't present in the network");
    }
    if (valueIsCorrect === false) {
      throw new Error("Node " + node + " hasn't a value called " + value);
    }
    this.graph.observe(node, value);
  }

  /**
   * @Override - Function that remove the node from the observed nodes
   */
  public unobserveNode (node: string): void {
    if (node == null) {
      throw new Error("invalid parameter");
    }
    let isPresent: boolean = false;
    for (const jn of this.graph.nodes) {
      if (jn.name === node) {
        isPresent = true;
        break;
      }
    }
    if (isPresent === false) {
      throw new Error("Node " + node + " isn't present in the network");
    }
    this.graph.unobserve(node);
  }

  /**
   * @Override - Function that makes the number of sample specified in sampleNum
   */
  public sampleNetwork (sampleNum: number): void {
    this.graph.sample(sampleNum);
  }

  /**
   * @Override - Function that retuns the probs of a specific node
   * @returns Return a Array<number> that represent the probs of a specific node
   */
  public getNodeProbs (nodeName: string): Array<number> {
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
  public getNodeList (): Array<NodeAdapter> {
  // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.nodeList); // returns deep copy
  }
}
