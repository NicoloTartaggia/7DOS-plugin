import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";

export interface NetParser {
  createNet(file_content: string): ConcreteNetworkAdapter;
}
