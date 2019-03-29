import {InfluxDB, IQueryOptions} from "influx";
import {Tags} from "influx/lib/src/results";
import ReadClient from "./ReadClient";

export default class InfluxReadClient implements ReadClient {

  /**
   * @param host The network address of the server to which the client must connect.
   * @param port  The port through the server is listening for requests from the client.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public static createReaderClient (host: string, port: string,
                                    credentials?: [string, string]): InfluxReadClient {
    const address: string = host + ":" + port;
    const login: string = credentials
      ? credentials[0] + ":" + credentials[1] + "@"
      : "";
    const dsn = "http://" + login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn);
    return new InfluxReadClient(address, influx);
  }

  /**
   * @field The complete address of the server to which the client makes requests, including the port.
   */
  private readonly address: string;

  /**
   * @field The InfluxDB instance assigned to the client.
   */
  private readonly influx: InfluxDB;

  /**
   * @param address The complete address of the server to which the client makes requests,
   * including the port.
   * @param influx The InfluxDB instance assigned to the client.
   */
  private constructor (address: string, influx: InfluxDB) {
    this.address = address;
    this.influx = influx;
  }

  /**
   * @returns The address of the server the client is connected to.
   */
  public getAddress (): string {
    return this.address;
  }

  /**
   * @param database The database on which the query will be executed.
   * @param query The query to execute.
   * @returns A Promise of nested arrays representing the results of the query.
   */
  public async readField (database: string, query: string):
    Promise<Array<{ name: string, tags: Tags, rows: Array<any> }>> {
    const queryOptions: IQueryOptions = {};
    queryOptions.database = database;
    const tempRes = await this.influx.query(query, queryOptions)
    .then((rows) => rows.groups())
    .catch((err) =>
        console.log("Query to " + this.getAddress()
        + " has encountered the following error: " + err));
    const queryRes: void | Array<{ name: string, tags: Tags, rows: Array<any> }> = tempRes
    ? tempRes
    : null;
    return queryRes;
  }
}
