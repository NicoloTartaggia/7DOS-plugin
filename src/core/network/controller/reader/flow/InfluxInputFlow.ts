import ReadClient from "../../../../database_client/ReadClient";
import {InputFlow} from "./InputFlow";

export class InfluxInputFlow implements InputFlow {
  private readonly query: string;
  private readonly database_name: string;
  private readonly client: ReadClient;

  constructor (database: string, query: string, client: ReadClient) {
    this.database_name = database;
    this.query = this.checkQuery(query);
    this.client = client;
  }

  public getResult (): string {
    console.log("pre");
    this.client.readField(this.database_name, this.query).then((result) => {
      console.log(result[0].rows[0].Percent_DPC_Time);
      return result[0].rows[0].Percent_DPC_Time;
    });
    return "returnVar";
  }

  private checkQuery (query: string): string {
    if (query.includes("*")) {
      throw new Error("The query cannot have a *, select a single field");
    }
    if (!query.toLowerCase().includes("limit 1")) {
      query = query.concat(" LIMIT 1");
    }

    return query;
  }
}
