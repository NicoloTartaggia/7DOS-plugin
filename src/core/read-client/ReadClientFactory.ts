/**
 * @File ConcreteReadClientFactory.ts
 * @Type TypeScript file
 * @Desc Contains the ConcreteReadClientFactory class.
 */
import {InfluxDB} from "influx";
import {InfluxReadClient, ReadClient} from "./read-client";

/**
 * @desc Abstract factory pattern
 */
export interface ReadClientFactory {
  makeInfluxReadClient (host: string, port: string, credentials?: [string, string]): ReadClient;
}

/**
 * @class Implementation of the ReadClientFactory interface
 * @desc Contains the methods used to create ReadClient objects. Has one method per implementation.
 */
export class ConcreteReadClientFactory implements ReadClientFactory {
  /**
   * @desc Creates a new ReadClient based on Influx.
   * @param host Address of the Influx host.
   * @param port Port on which the host is listening for requests.
   * @param credentials Eventual access credentials.
   */
  public makeInfluxReadClient (host: string, port: string, credentials?: [string, string])
    : InfluxReadClient {
    if (host === null ||  host.length === 0) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid host parameter");
    }
    if (port === null || port.length === 0) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid port parameter");
    }
    if ((credentials != null && (credentials[0] === null
    || credentials[0] === "" || credentials[1] === null))) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid credentials parameter");
    }
    const dsn: URL = new URL(host);
    dsn.port = port;
    if (credentials && credentials[0] != null && credentials[0].length !== 0) {
      dsn.username = credentials[0];
      dsn.password = credentials[1];
    }
    const dsn_string = dsn.toString();
    const influx: InfluxDB = new InfluxDB(dsn_string);
    return new InfluxReadClient(dsn_string, influx);
  }
}
