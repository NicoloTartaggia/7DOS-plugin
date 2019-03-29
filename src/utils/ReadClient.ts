import {InfluxDB, IQueryOptions} from "influx";
import {Tags} from "influx/lib/src/results";
import {InfluxClientReader} from "./InfluxClient";

class ConcreteReadClient implements InfluxClientReader {
  /*
      Factory
  */
  public static createReaderClient(host: string, port: string,
                                   credentials?: [string, string]): ConcreteReadClient {
    const address: string = host + ":" + port;
    const login: string = credentials
      ? credentials[0] + ":" + credentials[1] + "@"
      : "";
    const dsn = "http://" + login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn);
    return new ConcreteReadClient(address, influx);
  }

  /*
      Private fields
  */
  private readonly address: string;
  private readonly influx: InfluxDB;

  /*
      Constructor
  */
  private constructor(address: string, influx: InfluxDB) {
    this.address = address;
    this.influx = influx;
  }
  /*
      Methods
  */
  public getAddress(): string { return this.address; }

  public async readField(database: string, query: string):
    Promise<Array<{name: string, tags: Tags, rows: Array<any>}>> {
    const queryOptions: IQueryOptions = {};
    queryOptions.database = database;
    return this.influx.query(query, queryOptions).then((rows) => rows.groups());
  }
}

// Simple test code
const reader: ConcreteReadClient = ConcreteReadClient.createReaderClient("localhost", "8086");
console.log(reader.getAddress());
reader.readField("telegraf", "SHOW FIELD KEYS FROM win_cpu");
const value = reader.readField("telegraf", "SELECT * from win_cpu order by time desc limit 10");
value.then((row) => {
  console.log(JSON.stringify(row));
});
