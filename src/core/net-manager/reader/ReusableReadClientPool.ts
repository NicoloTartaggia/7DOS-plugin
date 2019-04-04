import ReadClient from "../../read-client/ReadClient";
import {ConcreteReadClientFactory} from "../../read-client/ReadClientFactory";
import DataSource from "./Datasource";

export default class ReusableReadClientPool {
  public static getInstance () {
    if (this.client_pool_instance === null) {
      this.client_pool_instance = new this();
    }
    return this.client_pool_instance;
  }

  private static client_pool_instance: ReusableReadClientPool = null;

  private read_clients: Array<ReadClient>;

  private constructor () {
    this.read_clients = new Array<ReadClient>();
  }

  public acquireReusable (dataSource: DataSource): ReadClient {
    let client: ReadClient = null;
    const factory = new ConcreteReadClientFactory();
    if (dataSource.getUsername() != null) {
      client = factory.makeInfluxReadClient(
        dataSource.getHost(), dataSource.getPort(), [dataSource.getUsername(), dataSource.getPassword()]);
    } else {
      client = factory.makeInfluxReadClient(dataSource.getHost(), dataSource.getPort());
    }
    // Check if already exist in the array
    const pos = this.read_clients.indexOf(client);
    if (pos >= 0) {
      return this.read_clients[pos];
    }
    // Add and return the new one
    this.read_clients.push(client);
    return client;
  }

  public releseReusable (to_remove: ReadClient) {
    const pos: number = this.read_clients.indexOf(to_remove);
    if (pos >= 0) {
      this.read_clients.splice(pos);
    } else {
      console.log("Can't remove element from array - releseReusable()");
    }
  }

}
