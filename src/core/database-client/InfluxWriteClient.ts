import {InfluxDB, IPoint} from "influx";
import WriteClient from "./WriteClient";

export default class InfluxWriteClient implements WriteClient {
  /**
   * @param host The network address of the server to which the client must connect.
   * @param port  The port through the server is listening for requests from the client.
   * @param defaultDB  The name of the default database for the client to write to.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public static async makeInfluxWriteClient(host: string, port: string, defaultDB: string,
                                            credentials?: [string, string])
  : Promise<InfluxWriteClient> {
    const address: string = host + ":" + port;
    const login: string = credentials ?
      credentials[0] + ":" + credentials[1] + "@" :
      "";
    const dsn = "http://" + login + address + "/" + defaultDB;
    const influx: InfluxDB = new InfluxDB(dsn);
    await influx.getDatabaseNames()
      .then((names) => {
        if (!names.includes(defaultDB)) {
          return influx.createDatabase(defaultDB);
        }
      })
      .then(() => console.log("Database " + defaultDB + " created successfully."))
      .catch(() => console.log("Couldn't create database. Check your connection!"));
    return new InfluxWriteClient(address, defaultDB, influx);
  }
  /*
      Private fields
  */
  private readonly address: string;
  private readonly defaultDB: string;
  private readonly influx: InfluxDB;
  /**
   * @param address The complete address of the server to which the client makes requests,
   * including the port.
   * @param defaultDB The default database the client writes to.
   * @param influx The InfluxDB instance assigned to the client.
   */
  private constructor(address: string, defaultDB: string, influx: InfluxDB) {
    this.address = address;
    this.defaultDB = defaultDB;
    this.influx = influx;
  }
/**
 * @returns The address of the server the client is connected to.
 */
  public getAddress(): string {
    return this.address;
  }
/**
 * @returns The default database the client writes to.
 */
  public getDefaultDB(): string {
    return this.defaultDB;
  }

  /**
   * @param batch The batch of data to be parsed and written to the server.
   * @param database OPTIONAL: the database to write the data to;
   * unless specified, it's the default database for the client.
   */
  public async writeBatchData(batch: Array<object>,
                              { database = this.defaultDB }: { database?: string })
    : Promise<void> {
      const batchInfo: Array<IPoint> = this.parseBatchData(batch);
      try {
        await this.influx.writeMeasurement(
            batchInfo[0].measurement,
            batchInfo,
            {
              database,
            },
        );
      } catch (err) {
        console.log("Writing a batch of data to" + this.getAddress()
        + " has encountered the following error: " + err);
    }
  }
  /**
   * @param point The point of data to be parsed and written to the server.
   * @param database OPTIONAL: the database to write the data to;
   * unless specified, it's the default database for the client.
   */
  public async writePointData(point: object,
                              { database = this.defaultDB }: { database?: string })
    : Promise<void> {
    const pointInfo: IPoint = this.parsePointData(point);
    try {
      await this.influx.writePoints([
        pointInfo,
      ], {
        database,
      });
      } catch (err) {
        console.log("Writing a point of data to" + this.getAddress()
        + " has encountered the following error: " + err);
    }
  }
/**
 * @param batch Contains the batch of data to be parsed for writing on Influx.
 * @returns An array of points of data.
 */
  public parseBatchData(batch: Array<object>): Array<IPoint> {
    return new Array<IPoint>();
  }
/**
 * @param batch Contains the batch of data to be parsed for writing on Influx.
 * @returns A point of data.
 */
  public parsePointData(point: object): IPoint {
    return {measurement: "yourname", fields: {vcpu: 2}};
  }
}
