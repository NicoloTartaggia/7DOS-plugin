import {ConcreteNetworkAdapter} from "../Adapter/ConcreteNetworkAdapter";

export default interface NetworkFactory {
  parseNetwork(file_content: string): ConcreteNetworkAdapter;
}
