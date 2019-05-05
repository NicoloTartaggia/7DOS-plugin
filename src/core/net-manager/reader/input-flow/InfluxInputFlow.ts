/**
 * @File InfluxInputFlow.ts
 * @Type TypeScript file
 * @Desc Contains the InfluxInputFlow class, which is used by the NetReader class.
 */
import {ReadClient} from "../../../read-client/read-client";
import {InputFlow} from "./input-flow";

/**
 * @class InfluxInputFlow
 * @desc Influx implementation of the InputFlow interface.
 *       Associates safely a query with a client, and provides methods to read data from said client.
 */
export class InfluxInputFlow implements InputFlow {
  /**
   * @field Text of the query.
   */
  private readonly query: string;
  /**
   * @field Field selected by the query.
   */
  private select_field: string;
  /**
   * @field Name of the database to execute the query on.
   */
  private readonly database_name: string;
  /**
   * @field Client that will execute the query.
   */
  private readonly client: ReadClient;

  /**
   * @desc Constructor for the InfluxInputFlow class.
   * @param database Name of the database to execute the query on.
   * @param query Text of the query.
   * @param client Client that will execute the query.
   */
  constructor (database: string, query: string, client: ReadClient) {
    if (database == null || database.length === 0) {
      throw new Error("[7DOS G&B][InfluxInputFlow]constructor - invalid database parameter");
    }
    if (query == null || query.length === 0) {
      throw new Error("[7DOS G&B][InfluxInputFlow]constructor - invalid query parameter");
    }
    if (client == null) {
      throw new Error("[7DOS G&B][InfluxInputFlow]constructor - invalid client parameter");
    }
    this.query = this.checkQuery(query);
    this.database_name = database;
    this.client = client;
  }
  /**
   * @desc Invokes the client's ReadClient::readField method and returns the most recent value for that query.
   * @returns a Promise of a String value.
   */
  public async getResult (): Promise<string> {
    const result = await this.client.readField(this.database_name, this.query)
      .catch((err) => {
        throw err;
      });
    return result[0].rows[0][this.select_field];
  }
  /**
   * @desc Checks if the query is valid updates the object state accordingly.
   * @param query Text of the query.
   * @returns The original query.
   */
  private checkQuery (query: string): string {
    if (query == null || query.length === 0) {
      throw new Error("[7DOS G&B][InfluxInputFlow]checkQuery - invalid query parameter");
    }
    // Check if query has select *
    if (query.includes("*")) {
      throw new Error("[7DOS G&B][InfluxInputFlow]checkQuery - The query cannot have a *, select a single field");
    }
    // Order desc
    if (!query.toLowerCase().includes("order by time desc")) {
      query = query.concat(" ORDER BY time DESC");
    }
    // Add limit if not already present
    if (!query.toLowerCase().includes("limit 1")) {
      query = query.concat(" LIMIT 1");
    }

    // Get the name of the field to select
    const select = query.substring(
      query.toLowerCase().indexOf("select") + 7,
      query.toLowerCase().indexOf("from"),
    ).trim();
    if (select.includes(",")) {
      throw new Error("[7DOS G&B][InfluxInputFlow]checkQuery - The query cannot select more than one field!");
    }
    this.select_field = select;

    return query;
  }
}
