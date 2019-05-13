/**
 * @File JsonNetParser.ts
 * @Type TypeScript file
 * @Desc Contains the JsonNetParser class.
 */
import {ConcreteNetworkAdapter} from "../adapter/adapter";
import {AbstractValue, BoolValue, RangeValue, StringValue} from "../value/value";
import {ConcreteNetBuilder, NetBuilder, NetParser} from "./factory";

import Ajv from "ajv";
/**
 * @class JsonNetParser
 * @desc Provides the necessary methods to parse a JSON file containing a
 * valid network, and creates with a ConcreteNetBuilder.
 */
export class JsonNetParser implements NetParser {
/**
 * @desc Parses a node's state creating the correct AbstractValue subclassed object.
 * @param current_value The current state to be parsed.
 * @returns An AbstractValue.
 */
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
      throw new Error("[7DOS G&B][JsonNetParser]parse_current_value - " +
        "Found a JSON value that's not in the list boolean|range|string," +
        "validate your JSON using the schema!");
    }
  }

  // --------------------------------
  // JSON PARSING STUFF
  /**
   * @desc Parses an uploaded JSON file, using a JSON schema to validate it.
   * @param file_content Content of the uploaded JSON file.
   * @param json_schema_content Content of the JSON schema.
   * @returns A ConcreteNetworkAdapter consistent with the network described in the JSON file.
   */
  public createNet (file_content: string, json_schema_content: string = null): ConcreteNetworkAdapter {
    const builder: NetBuilder = new ConcreteNetBuilder();

    // Check if JSON file is not null and is valid to parse
    if (file_content == null) {
      throw new Error("[7DOS G&B][JsonNetParser]createNet - JSON file content is null...");
    }

    let json_file;
    // Check if Json String is valid
    try {
      json_file = JSON.parse(file_content);
    } catch (e) {
      throw new Error("[7DOS G&B][JsonNetParser]createNet - Bad Json Content! Error:" + e.toString());
    }
    // --------------------------------
    // JSON schema validation
    if (json_schema_content !== null) {
      let json_schema;
      try {
        json_schema = JSON.parse(json_schema_content);
      } catch (e) {
        throw new Error("[7DOS G&B][JsonNetParser]createNet - Bad Json Content! Error:" + e.toString());
      }

      const ajv = new Ajv();
      const validate = ajv.compile(json_schema);
      const valid = validate(json_file);
      if (!valid) {
        throw new Error("[7DOS G&B][JsonNetParser]createNet - " +
          "JSON doesn't validate the schema!" + validate.errors);
      }
    }
    // --------------------------------
    // Begin to parse every node in the JSON file
    for (const node of (json_file).nodes) {
      const name = node.name;
      builder.initNode(name);

      // For each node i read his list of possible values
      const node_values_names: Array<string> = new Array<string>();
      for (const current_value of node.values) {
        // Insert the value name in the JNode values
        node_values_names.push(current_value.name);
        // Create the correct AbstractValue and save it in the list
        builder.addNodeValue(name, JsonNetParser.parse_current_value(current_value));
      }

      // Add the node to the network
      builder.addNode(name, node_values_names);
    }

    // For each node i read his parents and create a link between them
    for (const node of (json_file).nodes) {
      const name = node.name;
      for (const parent of node.parents) {
        builder.setNodeParent(name, parent);
      }
    }

    // For each node i read his CPT table
    for (const node of (json_file).nodes) {
      const name = node.name;
      builder.setNodeCpt(name, node.cpt);
    }

    // Return the created ConcreteNetworkAdapter
    return builder.build();
  }// end of createNet
}// end of JsonNetParser
