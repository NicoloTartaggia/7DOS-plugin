/**
 * @File InfluxReadClient.ts
 * @Type TypeScript file
 * @Desc Contains the InfluxReadClient class.
 */
import {InfluxDB, IQueryOptions} from "influx";
import {Tags} from "influx/lib/src/results";
import {ReadClient} from "./read-client";

export class InfluxReadClient implements ReadClient {

  /**
   * @field The complete dsn of the server to which the client makes requests, including the port.
   */
  private readonly dsn: string;

  /**
   * @field The InfluxDB instance assigned to the client.
   */
  private readonly influx: InfluxDB;

  /**
   * @param dsn The complete dsn of the server to which the client makes requests,
   * including the port.
   * @param influx The InfluxDB instance assigned to the client.
   */
  public constructor (dsn: string, influx: InfluxDB) {
    if (dsn == null || dsn.length === 0) {
      throw new Error("[7DOS G&B][InfluxReadClient]constructor - invalid dsn parameter");
    }
    if (influx == null) {
      throw new Error("[7DOS G&B][InfluxReadClient]constructor - invalid influx parameter");
    }
    this.dsn = dsn;
    this.influx = influx;
  }

  /**
   * @returns The dsn of the server the client is connected to.
   */
  public getAddress (): string {
    return this.dsn;
  }

  /**
   * @param database The database on which the query will be executed.
   * @param query The query to execute.
   * @returns A Promise of nested arrays representing the results of the query.
   */
  public async readField (database: string, query: string):
  Promise<Array<{ name: string, tags: Tags, rows: Array<any> }>> {
    if (database == null || database.length === 0) {
      throw new Error("[7DOS G&B][InfluxReadClient]readField - invalid database parameter");
    }
    if (query == null || query.length === 0) {
      throw new Error("[7DOS G&B][InfluxReadClient]readField - invalid query parameter");
    }
    const queryOptions: IQueryOptions = {};
    queryOptions.database = database;
    const tempRes = await this.influx.query(query, queryOptions)
      .then((rows) => rows.groups())
      .catch((err) => {
        throw new Error("[7DOS G&B][InfluxReadClient]readField - Query to " + this.getAddress()
          + " has encountered the following error: " + err);
      });
    const queryRes: void | Array<{ name: string, tags: Tags, rows: Array<any> }> = tempRes
      ? tempRes
      : null;
    return queryRes;
  }
}
