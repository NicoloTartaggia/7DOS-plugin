import {ConcreteNodeAdapter} from "../../node/ConcreteNodeAdapter";
import {ConcreteNetworkAdapter} from "../Adapter/ConcreteNetworkAdapter";

import {NodeAdapter} from "../../node/NodeAdapter";
import {AbstractValue} from "../../node/Value/AbstractValue";
import {BoolValue} from "../../node/Value/BoolValue";
import {RangeValue} from "../../node/Value/RangeValue";
import {StringValue} from "../../node/Value/StringValue";
import NetworkFactory from "./NetworkFactory";

import jsbayes from "jsbayes";

class ConcreteNetworkFactory implements NetworkFactory {
  // --------------------------------
  // NETWORK CREATION STUFF

  private static addNode (node_name: string, network: JGraph, values_names: Array<string>): JNode {
    return network.addNode(node_name, values_names);
  }

  private static setNodeParent (node: JNode, parent: JNode): void {
    node.addParent(parent);
  }

  private static setNodeCpt (node: JNode, cpt: Array<Array<number>>): void {
    node.setCpt(cpt);
  }

  // --------------------------------
  // NETWORK CONTROL STUFF

  private static nodeExist (node_name: string, node_dictionary: { [node_name: string]: JNode; }): boolean {
    return Object.keys(node_dictionary).indexOf(node_name) >= 0;
  }

  // --------------------------------
  // JSON PARSING STUFF

  private static parse_current_value (current_value): AbstractValue {
    if (current_value.type === "boolean") {
      return new BoolValue(current_value.value, current_value.name);
    } else if (current_value.type === "range") {
      return new RangeValue(current_value.rangeMin, current_value.rangeMax, current_value.name);
    } else if (current_value.type === "string") {
      return new StringValue(current_value.value, current_value.name);
    } else {
      throw new Error("Found a JSON value that's not in the list boolean|range|string," +
        "validate your JSON using the schema!");
    }
  }

  public parseNetwork (file_content: string): ConcreteNetworkAdapter {
    const network: JGraph = jsbayes.newGraph();
    const nodeList: Array<NodeAdapter> = new Array<NodeAdapter>();
    const node_dictionary: { [node_name: string]: JNode; } = {};
    const node_parents_dictionary: { [node_name: string]: Array<string>; } = {};
    const node_values_dictionary: { [node_name: string]: Array<AbstractValue>; } = {};

    // --------------------------------
    // Check if JSON file is not null and is valid to parse
    if (file_content == null) {
      throw new Error("JSON file content is null...");
    }

    let json_file;
    // Check if Json String is valid
    try {
      json_file = JSON.parse(file_content);
    } catch (e) {
      throw new Error("Bad Json Content! Error:" + e.toString());
    }
    // --------------------------------
    // Begin to parse every node in the JSON file
    for (const node of (json_file).nodes) {
      const name = node.name;
      // Create structures for current node
      node_parents_dictionary[name] = new Array<string>();
      node_values_dictionary[name] = new Array<AbstractValue>();

      // For each node i read his list of possible values
      const node_values_names: Array<string> = new Array<string>();
      for (const current_value of node.values) {
        // Insert the value name in the JNode values
        node_values_names.push(current_value.name);
        // Create the correct AbstractValue and save it in the list
        node_values_dictionary[name].push(ConcreteNetworkFactory.parse_current_value(current_value));
      }

      // Add the node to the network
      node_dictionary[name] = ConcreteNetworkFactory.addNode(name, network, node_values_names);
    }

    // For each node i read his parents and create a link between them
    for (const node of (json_file).nodes) {
      const name = node.name;
      for (const parent of node.parents) {
        if (ConcreteNetworkFactory.nodeExist(parent, node_dictionary)) {
          // Set parent for JNode
          ConcreteNetworkFactory.setNodeParent(node_dictionary[name], node_dictionary[parent]);
          // Insert parent in the list of current node parents
          node_parents_dictionary[name].push(parent);
        } else {
          throw new Error("Node " + parent + " not found in the network!");
        }
      }
    }

    // For each node i read his CPT table
    for (const node of (json_file).nodes) {
      const name = node.name;
      // TODO CHECK CORRECT SIZE USING node_parents_dictionary[name]
      ConcreteNetworkFactory.setNodeCpt(node_dictionary[name], node.cpt);
    }
    // --------------------------------
    // Build the array nodeList: Array<NodeAdapter>
    for (const node_name of Object.keys(node_dictionary)) {
      const node_values_array = node_values_dictionary[node_name];
      nodeList.push(new ConcreteNodeAdapter(node_dictionary[node_name], node_values_array));
    }
    // --------------------------------
    // Build and return the ConcreteNetworkAdapter
    return new ConcreteNetworkAdapter(network, nodeList);
  }// end of parseNetwork
}// end of ConcreteNetworkFactory

export { ConcreteNetworkFactory };
