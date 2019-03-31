import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";

export default interface NetworkFactory {
  parseNetwork(file_content: string): ConcreteNetworkAdapter;
}
