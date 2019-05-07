/**
 * @File ConcreteNetworkAdapter.ts
 * @Type TypeScript file
 * @Desc Contains the ConcreteNetworkAdapter class.
 */
import {NetworkAdapter, NodeAdapter} from "./adapter";

/**
 * @class ConcreteNetworkAdapter
 * @desc Adapter pattern implementation for the JGraph interface provided by JsBayes.
 */
export class ConcreteNetworkAdapter implements NetworkAdapter {
  private graph: JGraph;
  private readonly nodeList: Array<NodeAdapter>;

  public constructor (network: JGraph, nodeList: Array<NodeAdapter>) {
    if (network == null) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]constructor - invalid network parameter");
    }
    if (nodeList == null || nodeList.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]constructor - invalid nodeList parameter");
    }
    this.graph = network;
    this.nodeList = nodeList;
  }

  /**
   * @Override - Function that fixes a specific values (state) for a node in the network
   */
  public observeNode (node: string, value: string): void {
    if (node == null || node.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid node parameter");
    }
    if (value == null || value.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]observeNode - invalid value parameter");
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
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]observeNode - Node " + node + " isn't present in the network");
    }
    if (valueIsCorrect === false) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]observeNode - Node " +
        node + " hasn't a value called " + value);
    }
    this.graph.observe(node, value);
  }

  /**
   * @Override - Function that remove the node from the observed nodes
   */
  public unobserveNode (node: string): void {
    if (node == null || node.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]unobserveNode - invalid node parameter");
    }
    let isPresent: boolean = false;
    for (const jn of this.graph.nodes) {
      if (jn.name === node) {
        isPresent = true;
        break;
      }
    }
    if (isPresent === false) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]unobserveNode - Node "
        + node + " isn't present in the network");
    }
    this.graph.unobserve(node);
  }

  /**
   * @Override - Function that makes the number of sample specified in sampleNum
   */
  public sampleNetwork (sampleNum: number): void {
    if (sampleNum == null || sampleNum <= 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]sampleNetwork - invalid sampleNum parameter");
    }
    this.graph.sample(sampleNum);
  }

  /**
   * @Override - Function that retuns the probs of a specific node
   * @returns Return a Array<number> that represent the probs of a specific node
   */
  public getNodeProbs (nodeName: string): Array<number> {
    if (nodeName == null || nodeName.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetworkAdapter]getNodeProbs - invalid nodeName parameter");
    }
    for (const node of this.graph.nodes) {
      if (node.name === nodeName) {
        return node.probs();
      }
    }
    throw new Error("[7DOS G&B][ConcreteNetworkAdapter]getNodeProbs - Node "
      + nodeName + " isn't present in the network");
  }

  /**
   * @Override - Function that retuns the NodeList
   * @returns Return a Array<NodeAdapter> that represent the NodeList
   */
  public getNodeList (): Array<NodeAdapter> {
  // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.nodeList); // returns deep copy
  }

  public getJgraphCopy(): JGraph {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.graph);
  }
}
