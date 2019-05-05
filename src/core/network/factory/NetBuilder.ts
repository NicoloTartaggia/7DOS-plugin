import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";
import {AbstractValue} from "../value/AbstractValue";

export interface NetBuilder {
  initNode (node_name: string);

  addNodeValue (node_name: string, value: AbstractValue): void;

  addNode (node_name: string, values_names: Array<string>): void;

  setNodeParent (node_name: string, parent_name: string): void;

  setNodeCpt (node_name: string, cpt: Array<Array<number>>): void;

  build (): ConcreteNetworkAdapter;
}
