import {ConcreateNetworkAdapter} from "../Adapter/ConcreteNetworkAdapter";

export default interface NetworkFactory {
  parseNetwork(file_content: string): ConcreateNetworkAdapter;
}
