/**
 * @File ConcreteNetBuilder.ts
 * @Type TypeScript file
 * @Desc Contains the ConcreteNetBuilder class.
 */
import jsbayes from "jsbayes";
import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";
import {ConcreteNodeAdapter} from "../adapter/ConcreteNodeAdapter";
import {NodeAdapter} from "../adapter/NodeAdapter";
import {AbstractValue} from "../value/AbstractValue";
import {NetBuilder} from "./NetBuilder";

/**
 * @class ConcreteNetworkAdapter
 * @desc Builder pattern implementation for creating a JGraph object.
 */
export class ConcreteNetBuilder implements NetBuilder {

  // --------------------------------
  // NETWORK CONTROL STUFF

  /**
   * @desc Checks whether a node can be another node's parent.
   * @param main_node Name of the node to which add a parent
   * @param parent Name of the node to add as parent
   * @param parents Dictionary of all network parents
   * @returns True if the node can be a parent of the other node, false if not.
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
  /**
   * @desc Checks whether a node exists or not.
   * @param node_name Name of the node to be checked.
   * @param node_dictionary Dictionary of all nodes.
   * @returns True if the node can be a parent of the other node, false if not.
   */
  private static nodeExist (node_name: string, node_dictionary: { [node_name: string]: JNode; }): boolean {
    return Object.keys(node_dictionary).indexOf(node_name) >= 0;
  }

  // --------------------------------
  // CLASS VARIABLES
  /**
   * @field The network to be created.
   */
  private readonly network: JGraph;
  /**
   * @field List of nodes in the network.
   */
  private readonly nodeList: Array<NodeAdapter>;
  /**
   * @field Dictionary of nodes in the network.
   */
  private readonly node_dictionary: { [node_name: string]: JNode; };
  /**
   * @field Dictionary of nodes that are parents to other nodes in the network.
   */
  private readonly node_parents_dictionary: { [node_name: string]: Array<string>; };
  /**
   * @field Dictionary of node states.
   */
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

  /**
   * @desc Initializes a node, and throws an error if the node already exists.
   * @param node_name Name of the node to be initialized.
   */
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
  /**
   * @desc Adds a state to a node.
   * @param node_name Name of the node.
   * @param value State to add.
   */
  public addNodeValue (node_name: string, value: AbstractValue): void {
    this.node_values_dictionary[node_name].push(value);
  }

  /**
   * @desc Adds a node to the network and registers it in the dictionary.
   * @param node_name Name of the node.
   * @param values_names Names of the states.
   */
  public addNode (node_name: string, values_names: Array<string>): void {
    this.node_dictionary[node_name] = this.network.addNode(node_name, values_names);
  }

  /**
   * @desc Sets a node as a parent of another node.
   * @param node_name Name of the child node.
   * @param parent_name Names of the parent node.
   */
  public setNodeParent (node_name: string, parent_name: string): void {
    if (!ConcreteNetBuilder.nodeExist(parent_name, this.node_dictionary)) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]setNodeParent - " +
        "Node " + parent_name + " not found in the network!");
    }
    if (!ConcreteNetBuilder.checkCanBeParent(node_name, parent_name, this.node_parents_dictionary)) {
      throw new Error("[7DOS G&B][ConcreteNetBuilder]setNodeParent - Circular parenthood");
    }
    this.node_parents_dictionary[node_name].push(parent_name);
    this.node_dictionary[node_name].addParent(this.node_dictionary[parent_name]);
  }

  /**
   * @desc Sets a node's conditional probability table.
   * @param node_name Name of the node.
   * @param cpt Conditional probability table for the node.
   */
  public setNodeCpt (node_name: string, cpt: Array<Array<number>>): void {
    this.checkCPT(node_name, cpt);
    if (cpt.length === 1) {
      this.node_dictionary[node_name].setCpt(cpt[0]);
    } else {
      this.node_dictionary[node_name].setCpt(cpt);
    }
  }

  /**
   * @desc Creates a ConcreteNetworkAdapter from the internal JGraph field.
   * @returns a ConcreteNetworkAdapter object.
   */
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
  /**
   * @desc Checks whether a node's conditional probability table is valid or not (in which case it throws an error).
   * @param node_name Name of the node.
   * @param cpt Conditional probability table for the node.
   */
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
