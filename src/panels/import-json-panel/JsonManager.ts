import jsbayes from "jsbayes";

// ---
// Json Management Class
// ---

abstract class NodeValue {
  private readonly name: string;

  protected constructor(input_name: string) {
    this.name = input_name;
  }

  public getName() {
    return this.name;
  }

  /**
   * abstract function that will be implemented in the child classes
   * returns a string that represents the current node value in JSON object format
   * @returns Returns a string that represents the NodeValue as a Json Object
   */
  public abstract getJsonValue(): string;
}

export class SingleValue extends NodeValue {
  private readonly value: string;

  public constructor(input_name: string, input_value: string) {
    super(input_name);
    this.value = input_value;
  }

  public getValue() {
    return this.value;
  }

  /**
   * @Override - Function that returns a string that represents the current SingleValue object in JSON object format
   * @returns Returns a string that represents the SingleValue as a Json Object
   */
  public getJsonValue(): string {
    let json_string = "{";
    json_string = json_string.concat('"name": "' + this.getName() + '",');
    json_string = json_string.concat('"type": "single",');
    json_string = json_string.concat('"value": "' + this.value + '"');
    json_string = json_string.concat("}");
    return json_string;
  }
}

export class RangeValue extends NodeValue {
  private readonly rangeMin: number;
  private readonly rangeMax: number;

  public constructor(input_name: string, input_rangeMin: number, input_rangeMax: number) {
    super(input_name);
    this.rangeMin = input_rangeMin;
    this.rangeMax = input_rangeMax;
  }

  public getRangeMin(): number {
    return this.rangeMin;
  }

  public getRangeMax(): number {
    return this.rangeMax;
  }

  /**
   * @Override - Function that returns a string that represents the current RangeValue object in JSON object format
   * @returns Returns a string that represents the RangeValue as a Json Object
   */
  public getJsonValue(): string {
    let json_string = "{";
    json_string = json_string.concat('"name": "' + this.getName() + '",');
    json_string = json_string.concat('"type": "range",');
    json_string = json_string.concat('"rangeMin": ' + this.rangeMin + ",");
    json_string = json_string.concat('"rangeMax": ' + this.rangeMax);
    json_string = json_string.concat("}");
    return json_string;
  }
}

// -----------------------------------------
// -----------------------------------------
// -----------------------------------------
// Wrapper classes for Bayesian Network Library (jsbayes)

export class Network_Node {
  private readonly name: string;
  private parents: { [name: string]: Network_Node; } = {};
  private values: Array<NodeValue>;
  private cpt: Array<Array<number>>;

  public constructor(input_name: string, input_values: Array<NodeValue>, input_cpt: Array<Array<number>>) {
    this.name = input_name;
    this.values = input_values;
    this.cpt = input_cpt;
  }

  public getStringValues() {
    const returnString: Array<string> = [];
    for (const entry of this.values) {
      returnString.push(entry.getName());
    }
    return returnString;
  }

  public addParent(node: Network_Node) {
    this.parents[node.name] = node;
  }

  public removeParent(node: Network_Node) {
    if (node.name in this.parents) {
      delete this.parents[node.name];
    }
  }

  public setCpt(input_cpt: Array<Array<number>>) {
    this.cpt = input_cpt;
  }

  public getCpt() {
    return this.cpt;
  }

  /**
   * @Override - Function that returns a string that represents the current node as a Json object: with name, values etc
   * @returns Returns a string that represents the current node as Json object
   */
  public getJsonValue(): string {
    // Begin
    let json_string = "{";
    // Name
    json_string = json_string.concat('"name": "' + this.name + '",');
    // Values
    json_string = json_string.concat(this.generateJsonValueString());
    // Parents
    json_string = json_string.concat(this.generateJsonParentsString());
    // CPT
    json_string = json_string.concat(this.generateJsonCPTString());
    // End
    json_string = json_string.concat("}");
    return json_string;
  }

  // --------------------
  // JSON GENERATION STUFF
  // --------------------

  /**
   * @Override - Function that returns a string that represents the
   * dictionary of parents of the current node in Json array format
   * @returns Returns a string that represents the array of parents
   */
  private generateJsonParentsString(): string {
    let json_string = '"parents":[';
    const keys = Object.keys(this.parents);
    for (let i = 0; i < keys.length; i++) {
      json_string = json_string.concat('"' + this.parents[keys[i]].name + '"');
      // If is not the last element i must add a comma to separate the elements
      if (i + 1 < keys.length) {
        json_string = json_string.concat(",");
      }
    }
    json_string = json_string.concat("],");
    return json_string;
  }

  /**
   * Override - Function that returns a string that represents the 2D CPT array of the current node in Json format
   * @returns Returns a string that represents the CPT in json format
   */
  private generateJsonCPTString(): string {
    let json_string = '"cpt":[';
    for (let i = 0; i < this.cpt.length; i++) {
      json_string = json_string.concat("[");
      json_string = json_string.concat(this.cpt[i].toString());
      json_string = json_string.concat("]");
      // If is not the last element i must add a comma to separate the elements
      if (i + 1 < this.cpt.length) {
        json_string = json_string.concat(",");
      }
    }
    json_string = json_string.concat("]");
    return json_string;
  }

  private generateJsonValueString(): string {
    let json_string = '"values": [';
    for (let i = 0; i < this.values.length; i++) {
      json_string = json_string.concat(this.values[i].getJsonValue());
      // If is not the last element i must add a comma to separate the elements
      if (i + 1 < this.values.length) {
        json_string = json_string.concat(",");
      }
    }
    json_string = json_string.concat("],");
    return json_string;
  }
}

export class Network {
  private readonly network: JGraph;
  private node_objects_dictionary: { [name: string]: Network_Node; } = {};
  private node_dictionary: {} = {};

  public constructor(json_string: string = "") {
    this.network = jsbayes.newGraph();

    if (json_string != null) {
      this.buildNetworkFromJson(json_string);
    }
  }

  public addNode(input_name: string, input_values: Array<NodeValue>, input_cpt: Array<Array<number>>) {
    const node = new Network_Node(input_name, input_values, input_cpt);
    this.node_dictionary[input_name] = this.network.addNode(input_name, node.getStringValues());
    this.node_objects_dictionary[input_name] = node;
    if (input_cpt.length > 0) {
      this.setNodeCpt(input_name, input_cpt);
    }
  }

  public removeNode(input_name: string) {
    // TODO
  }

  public createLink(node_name: string, node_parent_name: string) {
    if (this.checkIfNodeExist(node_name)) {
      if (this.checkIfNodeExist(node_parent_name)) {
        this.node_objects_dictionary[node_name].addParent(this.node_objects_dictionary[node_parent_name]);
        this.node_dictionary[node_name].addParent(this.node_dictionary[node_parent_name]);
      } else {
        throw new Error("The node called " + node_parent_name + " can't be found!");
      }
    } else {
      throw new Error("The node called " + node_name + " can't be found!");
    }
  }

  public removeLink(node_name: string, node_parent_name: string) {
    // TODO
  }

  public observe(node_name: string, value: NodeValue) {
    if (this.checkIfNodeExist(node_name)) {
      if (this.node_objects_dictionary[node_name].getStringValues().includes(value.getName())) {
        this.network.observe(node_name, value.getName());
      } else {
        throw new Error("The value is not valid for this node!");
      }
    } else {
      throw new Error("The node called " + node_name + " can't be found!");
    }
  }

  public unobserve(node_name: string) {
    if (this.checkIfNodeExist(node_name)) {
      this.network.unobserve(node_name);
    } else {
      throw new Error("The node called " + node_name + " can't be found!");
    }
  }

  public setNodeCpt(node_name: string, input_cpt: Array<Array<number>>) {
    if (this.checkIfNodeExist(node_name)) {
      this.node_objects_dictionary[node_name].setCpt(input_cpt);
      if (input_cpt.length === 1) {
        this.node_dictionary[node_name].setCpt(input_cpt[0]);
      } else {
        this.node_dictionary[node_name].setCpt(input_cpt);
      }
    } else {
      throw new Error("The node called " + node_name + " can't be found!");
    }
  }

  public sample(samples: number) {
    return this.network.sample(samples);
  }

  /**
   * @Override - Function that returns a string that represents the current network using the json format
   * @returns Returns a string that represents the current network as json
   */
  public getNetworkJson(): string {
    let json_string = '{"nodes": [';
    const keys = Object.keys(this.node_objects_dictionary);
    for (let i = 0; i < keys.length; i++) {
      json_string = json_string.concat(this.node_objects_dictionary[keys[i]].getJsonValue());
      // If is not the last element i must add a comma to separate the elements
      if (i + 1 < keys.length) {
        json_string = json_string.concat(",");
      }
    }
    json_string = json_string.concat("]}");
    return json_string;
  }

  private checkIfNodeExist(node_name: string): boolean {
    return node_name in this.node_objects_dictionary;
  }

  /**
   * @Override - Function that returns a string that represents the current network using the json format
   * @returns Returns a string that represents the current network as json
   */
  private buildNetworkFromJson(json_string: string): void {

    let json_file;
    // Check if Json String is valid
    try {
      json_file = JSON.parse(json_string);
    } catch (e) {
      throw new Error("Bad Json Content! Error:" + e.toString());
    }

    for (const node of (json_file).nodes) {
      const name = node.name;

      // For each node i read his list of possible values
      const obj_values: Array<NodeValue> = [];
      for (const current_value of node.values) {
        if (current_value.type === "single") {
          obj_values.push(new SingleValue(current_value.name, current_value.value));
        } else if (current_value.type === "range") {
          obj_values.push(new RangeValue(current_value.name, current_value.rangeMin, current_value.rangeMax));
        }
      }

      // Add the node to the network
      this.addNode(name, obj_values, []);
    }

    // For each node i read his parents and create a link between them
    for (const node of (json_file).nodes) {
      const name = node.name;
      for (const parent of node.parents) {
        this.createLink(name, parent);
      }
    }

    // For each node i read his CPT table
    for (const node of (json_file).nodes) {
      const name = node.name;
      this.setNodeCpt(name, node.cpt);
    }

  }// end_buildNetworkFromJson
}
