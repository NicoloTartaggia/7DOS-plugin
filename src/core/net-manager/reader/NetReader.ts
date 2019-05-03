import DataSource from "./Datasource";
import ReusableReadClientPool from "./ReusableReadClientPool";

import {InfluxInputFlow} from "./input-flow/InfluxInputFlow";
import {InputFlow} from "./input-flow/InputFlow";

import {InputResult} from "../result/input-result/InputResult";
import {InputResultAggregate} from "../result/input-result/InputResultAggregate";

import {JsImportPanel} from "../../../panels/import-json-panel/JsonImportPanel";

import {NetworkAdapter} from "../../network/adapter/NetworkAdapter";
import {NodeAdapter} from "../../network/adapter/NodeAdapter";

export class NetReader {
  private flowMap: Map<string, InputFlow>;
  private readonly node_list_ref: Array<NodeAdapter>;

  public constructor (network_ref: NetworkAdapter) {
    if (network_ref == null) {
      throw new Error("[7DOS G&B][NetReader]constructor - invalid parameter");
    }
    this.flowMap = new Map<string, InputFlow>();
    this.node_list_ref = network_ref.getNodeList();
  }

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
      JsImportPanel.showErrorMessage("", "[7DOS G&B][NetReader]disconnectNode - This node is not linked to any flow");
      throw new Error("[7DOS G&B][NetReader]disconnectNode - This node is not linked to any flow");
    } else {
      this.flowMap.delete(node);
    }
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
