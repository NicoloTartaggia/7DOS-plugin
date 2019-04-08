import {ConcreteNodeAdapter} from "../adapter/ConcreteNodeAdapter";

import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";
import {NodeAdapter} from "../adapter/NodeAdapter";
import {AbstractValue} from "../value/AbstractValue";
import {BoolValue} from "../value/BoolValue";
import {RangeValue} from "../value/RangeValue";
import {StringValue} from "../value/StringValue";
import NetworkFactory from "./NetworkFactory";

import Ajv from "ajv";
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
    if (cpt.length === 1) {
      node.setCpt(cpt[0]);
    } else {
      node.setCpt(cpt);
    }
  }

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
      if (!ConcreteNetworkFactory.checkCanBeParent(main_node, current_parent, parents)) {
        return false;
      }
    }
    return true;
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
      let rangeMin: number = 0;
      let rangeMax: number = 0;
      if (current_value.rangeMin === "-inf") {
        rangeMin = Number.MIN_SAFE_INTEGER;
      } else if (current_value.rangeMin === "+inf") {
        rangeMin = Number.MAX_SAFE_INTEGER;
      } else {
        rangeMin = Number(current_value.rangeMin);
      }
      if (current_value.rangeMax === "-inf") {
        rangeMax = Number.MIN_SAFE_INTEGER;
      } else if (current_value.rangeMax === "+inf") {
        rangeMax = Number.MAX_SAFE_INTEGER;
      } else {
        rangeMax = Number(current_value.rangeMax);
      }
      return new RangeValue(rangeMin, rangeMax, current_value.name);
    } else if (current_value.type === "string") {
      return new StringValue(current_value.value, current_value.name);
    } else {
      throw new Error("Found a JSON value that's not in the list boolean|range|string," +
        "validate your JSON using the schema!");
    }
  }

  public parseNetwork (file_content: string, json_schema_content: string = null): ConcreteNetworkAdapter {
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
    // JSON schema validation
    if (json_schema_content !== null) {
      let json_schema;
      try {
        json_schema = JSON.parse(json_schema_content);
      } catch (e) {
        throw new Error("Bad Json Content! Error:" + e.toString());
      }

      const ajv = new Ajv();
      const validate = ajv.compile(json_schema);
      const valid = validate(json_file);
      if (!valid) {
        throw new Error("JSON doesn't validate the schema!" + validate.errors);
      }
    }
    // --------------------------------
    // Begin to parse every node in the JSON file
    for (const node of (json_file).nodes) {
      const name = node.name;
      // Check that the node doesn't exist already
      if (Object.keys(node_dictionary).indexOf(name) >= 0) {
        throw new Error("The node " + name + " already exist in the network!");
      }
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
        if (!ConcreteNetworkFactory.nodeExist(parent, node_dictionary)) {
          throw new Error("Node " + parent + " not found in the network!");
        }
        if (!ConcreteNetworkFactory.checkCanBeParent(name, parent, node_parents_dictionary)) {
          throw new Error("Circular parenthood");
        }
        // Set parent for JNode
        ConcreteNetworkFactory.setNodeParent(node_dictionary[name], node_dictionary[parent]);
        // Insert parent in the list of current node parents
        node_parents_dictionary[name].push(parent);
      }
    }

    // For each node i read his CPT table
    for (const node of (json_file).nodes) {
      if (node.cpt.length === 0) {
        throw new Error("Empty cpt");
      }
      const name = node.name;
      // Check that cpt sum is 1
      for (const cpt_line of node.cpt) {
        let sum = 0;
        for (const prob of cpt_line) {
          sum += prob;
        }
        if (sum > 1) {
          throw new Error("The cpt sum of a line is > 1!");
        }
      }
      let numberOfRows: number = 1;
      for (const parName of node_parents_dictionary[name]) {
        const par = node_dictionary[parName];
        numberOfRows *= par.values.length;
      }
      if (numberOfRows === node.cpt.length) {
        for (const row of node.cpt) {
          if (row.length !== node.values.length) {
            throw new Error("Incorrect cpt's number of columns for node" + name + " (found:"
              + row.length.toString() + " expected:" + node.values.length.toString() + ")");
          }
        }
        ConcreteNetworkFactory.setNodeCpt(node_dictionary[name], node.cpt);
      } else {
        throw new Error("Incorrect cpt's number of columns for node" + name + " (found:" + node.cpt.length.toString()
          + " expected:" + numberOfRows.toString() + ")");
      }

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

export {ConcreteNetworkFactory};

/*
    let arrayCpt: number[] = [];
    for (let c of cpt) {
      for (let cin of c) {
        arrayCpt.push(cin);
      }
    }
    node.setCpt(arrayCpt);
    node.setCpt(cpt);*/
