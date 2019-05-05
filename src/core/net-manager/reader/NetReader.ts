/**
 * @File NetReader.ts
 * @Type TypeScript file
 * @Desc Contains the NetReader class.
 */
import {NetworkAdapter, NodeAdapter} from "../../network/adapter/adapter";
import {InputResult, InputResultAggregate} from "../result/input-result/input-result";
import {InfluxInputFlow, InputFlow} from "./input-flow/input-flow";
import {DataSource, ReusableReadClientPool} from "./reader";

/**
 * @class NetReader
 * @desc Connects nodes to input data flows and reads the data for every node in the network.
 */
export class NetReader {
  private flowMap: Map<string, InputFlow>;
  private readonly node_list_ref: Array<NodeAdapter>;
  /**
   * @desc Creates a new NetReader object
   * @param network_ref Reference to the Bayesian network.
   * @returns A new NetReader object.
   */
  public constructor (network_ref: NetworkAdapter) {
    if (network_ref == null) {
      throw new Error("[7DOS G&B][NetReader]constructor - invalid parameter");
    }
    this.flowMap = new Map<string, InputFlow>();
    this.node_list_ref = network_ref.getNodeList();
  }
  /**
   * @desc For each node, reads the corrisponding value from the assigned InputFlow and creates an InputResult
   * associating the node with the read value.
   * @returns A Promise of an InputResultAggregate object.
   */
  public async read (): Promise<InputResultAggregate> {
    const return_array: Array<InputResult> = new Array<InputResult>();

    for (const [key, value] of this.flowMap) {
      const node: NodeAdapter = this.getNodeFromName(key);
      if (node === null) {
        throw new Error("[7DOS G&B][NetReader]read - getNodeFromName() failed and returned null");
      } else {
        const res_value: string  = await value.getResult();
        return_array.push(new InputResult(node, res_value));
      }
    }
    return new InputResultAggregate(return_array);
  }
  /**
   * @desc Assigns an input data flow to a node.
   * @param node Node to associate the data flow to.
   * @param dataSource Datasource that will provide the data.
   * @param query Text of the query.
   */
  public connectNode (node: string, dataSource: DataSource, query: string): void {
    if (node == null || node.length === 0) {
      throw new Error("[7DOS G&B][NetReader]connectNode - Invalid node");
    } else if (dataSource == null) {
      throw new Error("[7DOS G&B][NetReader]connectNode - Invalid dataSource.");
    } else if (query == null || query.length === 0) {
      throw new Error("[7DOS G&B][NetReader]connectNode - Invalid query.");
    }
    const client = ReusableReadClientPool.getInstance().acquireReusable(dataSource);
    this.flowMap.set(node, new InfluxInputFlow(dataSource.getDatabase(), query, client));
  }

  public disconnectNode (node: string): void {
    if (node == null || node.length === 0) {
      throw new Error("[7DOS G&B][NetReader]disconnectNode - Invalid node");
    } else if (this.flowMap.has(node) === false) {
      console.error("[7DOS G&B][NetReader]disconnectNode - This node might be not linked to any flow");
      throw new Error("[7DOS G&B][NetReader]disconnectNode - This node might be not linked to any flow");
    } else {
      this.flowMap.delete(node);
    }
  }
  /**
   * @desc Gets a reference to a specified node by searching the network for a specific node name.
   * @param name The name of the node.
   * @returns A reference to the specified node.
   */
  private getNodeFromName (name: string): NodeAdapter {
    for (const node of this.node_list_ref) {
      if (node.getName() === name) {
        return node;
      }
    }
    return null;
  }
}
