/**
 * @File ReusableReadClientPool.ts
 * @Type TypeScript file
 * @Desc Contains the ReusableReadClientPool class.
 */
import {ConcreteReadClientFactory, ReadClient} from "../../read-client/read-client";
import {DataSource} from "./reader";

/**
 * @class ReusableReadClientPool
 * @desc Provides a singleton object that manages all of the ReadClient instances, preventing multiple instantiation
 * of identical clients.
 */
export class ReusableReadClientPool {
  /**
   * @desc Static method to obtain the instance of the object.
   * @returns An instance of ReusableReadClientPool.
   */
  public static getInstance () {
    if (this.client_pool_instance === null) {
      this.client_pool_instance = new this();
    }
    return this.client_pool_instance;
  }
  /**
   * @field Singleton instance.
   */
  private static client_pool_instance: ReusableReadClientPool = null;
  /**
   * @field Array of ReadClient objects to be managed.
   */
  private read_clients: Array<ReadClient>;
  /**
   * @desc Private constructor for the object.
   * @returns A new instance of ReusableReadClientPool.
   */
  private constructor () {
    this.read_clients = new Array<ReadClient>();
  }
  /**
   * @desc Checks if the desired client exists, otherwise creates a new one and adds it to the pool.
   * @param dataSource The datasource the client is connected to.
   * @returns A ReadClient object.
   */
  public acquireReusable (dataSource: DataSource): ReadClient {
    if (dataSource == null) {
      throw new Error("invalid datasource parameter");
    }
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
  /**
   * @desc Checks if the desired client exists, and if so removes it from the pool.
   * @param to_remove The client to be removed.
   */
  public releseReusable (to_remove: ReadClient): void {
    if (to_remove == null) {
      throw new Error("invalid to_remove parameter");
    }
    const pos: number = this.read_clients.indexOf(to_remove);
    if (pos >= 0) {
      this.read_clients.splice(pos);
    } else {
      console.log("Can't remove element from array - releseReusable()");
    }
  }

}
