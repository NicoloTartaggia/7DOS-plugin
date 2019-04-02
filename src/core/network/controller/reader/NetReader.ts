import {InputResult} from "../../../inputReadResult/InputResult";
import {InputResultAggregate} from "../../../inputReadResult/InputResultAggregate";
import {NodeAdapter} from "../../../node/NodeAdapter";
import {NetworkAdapter} from "../../adapter/NetworkAdapter";
import DataSource from "./Datasource";
import {InfluxInputFlow} from "./flow/InfluxInputFlow";
import {InputFlow} from "./flow/InputFlow";
import ReusableReadClientPool from "./ReusableReadClientPool";

export class NetReader {
  private inputFlux: Map<string, InputFlow>;
  private readonly node_list_ref: Array<NodeAdapter>;

  public constructor (network_ref: NetworkAdapter) {
    this.node_list_ref = network_ref.getNodeList();
  }

  public read (): InputResultAggregate {
    const return_array: Array<InputResult> = new Array<InputResult>();
    for (const [key, value] of this.inputFlux) {
      const node: NodeAdapter = this.getNodeFromName(key);
      if (node === null) {
        throw new Error("getNodeFromName() failed and returned null");
      } else {
        return_array.push(new InputResult(node, value.getResult()));
      }
    }
    return new InputResultAggregate(return_array);
  }

  public connectNode (node: string, dataSource: DataSource, query: string): void {
    const client = ReusableReadClientPool.getInstance().acquireReusable(dataSource);
    this.inputFlux[node] = new InfluxInputFlow(dataSource.getDatabase(), query, client);
  }

  private getNodeFromName (name: string): NodeAdapter {
    for (const node of this.node_list_ref) {
      if (node.getName() === name) {
        return node;
      }
    }
    return null;
  }
}
