import jsbayes from "jsbayes";
import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";
import {ConcreteNodeAdapter} from "../adapter/ConcreteNodeAdapter";
import {NodeAdapter} from "../adapter/NodeAdapter";
import {AbstractValue} from "../value/AbstractValue";
import {NetBuilder} from "./NetBuilder";

export class ConcreteNetBuilder implements NetBuilder {

  // --------------------------------
  // NETWORK CONTROL STUFF

  /**
   * n5.addParent(n1)
   * @param main_node Main node: n5
   * @param parent Node to add as parent: n1
   * @param parents Dictionary of all network parents
   */
  private static checkCanBeParent (main_node: string,
                                   parent: string,
                                   parents: { [node_name: string]: Array<string>; }): boolean {
    if (main_node === parent) {
      return false;
    }
    // Check if n1 is already in n5's list
    if (Object.keys(parents).indexOf(main_node) >= 0 && parents[main_node].indexOf(parent) >= 0) {
      return false;
    }
    if (Object.keys(parents).indexOf(parent) >= 0 && parents[parent].indexOf(main_node) >= 0) {
      return false;
    }
    for (const current_parent of parents[parent]) {
      if (!ConcreteNetBuilder.checkCanBeParent(main_node, current_parent, parents)) {
        return false;
      }
    }
    return true;
  }

  private static nodeExist (node_name: string, node_dictionary: { [node_name: string]: JNode; }): boolean {
    return Object.keys(node_dictionary).indexOf(node_name) >= 0;
  }

  // --------------------------------
  // CLASS VARIABLES

  private readonly network: JGraph;
  private readonly nodeList: Array<NodeAdapter>;
  private readonly node_dictionary: { [node_name: string]: JNode; };
  private readonly node_parents_dictionary: { [node_name: string]: Array<string>; };
  private readonly node_values_dictionary: { [node_name: string]: Array<AbstractValue>; };

  // --------------------------------
  // NETWORK CREATION STUFF

  constructor () {
    this.network = jsbayes.newGraph();
    this.nodeList = new Array<NodeAdapter>();
    this.node_dictionary = {};
    this.node_parents_dictionary = {};
    this.node_values_dictionary = {};
  }

  public initNode (node_name: string): void {
    // Check that the node doesn't exist already
    if (Object.keys(this.node_dictionary).indexOf(node_name) >= 0) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]initNode - " +
        "The node " + node_name + " already exist in the network!");
    }
    // Create structures for current node
    this.node_parents_dictionary[node_name] = new Array<string>();
    this.node_values_dictionary[node_name] = new Array<AbstractValue>();
  }

  // --------------------------------
  // ABSTRACT METHODS

  public addNodeValue (node_name: string, value: AbstractValue): void {
    this.node_values_dictionary[node_name].push(value);
  }

  public addNode (node_name: string, values_names: Array<string>): void {
    this.node_dictionary[node_name] = this.network.addNode(node_name, values_names);
  }

  public setNodeParent (node_name: string, parent_name: string): void {
    if (!ConcreteNetBuilder.nodeExist(parent_name, this.node_dictionary)) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]setNodeParent - " +
        "Node " + parent + " not found in the network!");
    }
    if (!ConcreteNetBuilder.checkCanBeParent(node_name, parent_name, this.node_parents_dictionary)) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]setNodeParent - Circular parenthood");
    }
    this.node_parents_dictionary[node_name].push(parent_name);
    this.node_dictionary[node_name].addParent(this.node_dictionary[parent_name]);
  }

  public setNodeCpt (node_name: string, cpt: Array<Array<number>>): void {
    this.checkCPT(node_name, cpt);
    if (cpt.length === 1) {
      this.node_dictionary[node_name].setCpt(cpt[0]);
    } else {
      this.node_dictionary[node_name].setCpt(cpt);
    }
  }

  public build (): ConcreteNetworkAdapter {
    // Build the array nodeList: Array<NodeAdapter>
    for (const node_name of Object.keys(this.node_dictionary)) {
      const node_values_array = this.node_values_dictionary[node_name];
      this.nodeList.push(new ConcreteNodeAdapter(this.node_dictionary[node_name], node_values_array));
    }
    // Build and return the ConcreteNetworkAdapter
    return new ConcreteNetworkAdapter(this.network, this.nodeList);
  }

  // --------------------------------
  // NETWORK CHECK

  private checkCPT (node_name: string, cpt: Array<Array<number>>) {
    if (cpt.length === 0) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]checkCPT - Empty cpt");
    }
    // Check that cpt sum is 1
    for (const cpt_line of cpt) {
      let sum = 0;
      for (const prob of cpt_line) {
        sum += prob;
      }
      if (sum > 1) {
        throw new Error("[7DOS G&B][ConcreteNetBuilder]checkCPT - The cpt sum of a line is > 1!");
      }
    }
    let numberOfRows: number = 1;
    for (const parName of this.node_parents_dictionary[node_name]) {
      const par = this.node_dictionary[parName];
      numberOfRows *= par.values.length;
    }
    if (numberOfRows === cpt.length) {
      for (const row of cpt) {
        if (row.length !== this.node_values_dictionary[node_name].length) {
          throw new Error("[7DOS G&B][ConcreteNetBuilder]checkCPT - " +
            "Incorrect cpt's number of columns for node" + node_name + " (found:"
            + row.length.toString() + " expected:" + this.node_values_dictionary[node_name].length.toString() + ")");
        }
      }
    } else {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]checkCPT - " +
        "Incorrect cpt's number of columns for node" + node_name + " (found:" + cpt.length.toString()
        + " expected:" + numberOfRows.toString() + ")");
    }
  }
}
