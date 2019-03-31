import {InfluxDB, IPoint} from "influx";
import {CalcResult} from "../calculation_result/CalcResult";
import WriteClient from "./WriteClient";

export default class InfluxWriteClient implements WriteClient {

  /**
   * @param host The network address of the server to which the client must connect.
   * @param port  The port through the server is listening for requests from the client.
   * @param defaultDB  The name of the default database for the client to write to.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public static async makeInfluxWriteClient (host: string, port: string, defaultDB: string,
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

  /**
   * @field The complete address of the server to which the client makes requests, including the port.
   */
  private readonly address: string;

  /**
   * @field The default database the client writes to.
   */
  private readonly defaultDB: string;

  /**
   * @field The InfluxDB instance assigned to the client.
   */
  private readonly influx: InfluxDB;

  /**
   * @param address The complete address of the server to which the client makes requests,
   * including the port.
   * @param defaultDB The default database the client writes to.
   * @param influx The InfluxDB instance assigned to the client.
   */
  private constructor (address: string, defaultDB: string, influx: InfluxDB) {
    this.address = address;
    this.defaultDB = defaultDB;
    this.influx = influx;
  }

  /**
   * @returns The address of the server the client is connected to.
   */
  public getAddress (): string {
    return this.address;
  }

  /**
   * @returns The default database the client writes to.
   */
  public getDefaultDB (): string {
    return this.defaultDB;
  }

  /**
   * @param batch The batch of data to be parsed and written to the server.
   * @param database OPTIONAL: the database to write the data to;
   * unless specified, it's the default database for the client.
   */
  public async writeBatchData (batch: Array<CalcResult>,
                               {database = this.defaultDB}: { database?: string })
    : Promise<void> {
    const batchInfo: Array<IPoint> = this.parseBatchData(batch);
    await this.influx.writeMeasurement(
      batchInfo[0].measurement,
      batchInfo,
      {
        database,
      },
    ).catch((err) =>
      console.log("Writing a batch of data to" + this.getAddress()
        + " has encountered the following error: " + err));
  }

  /**
   * @param point The point of data to be parsed and written to the server.
   * @param database OPTIONAL: the database to write the data to;
   * unless specified, it's the default database for the client.
   */
  public async writePointData (point: CalcResult,
                               {database = this.defaultDB}: { database?: string })
    : Promise<void> {
    const pointData: IPoint = this.parsePointData(point);
    await this.influx.writePoints([
      pointData,
    ], {
      database,
    }).catch((err) =>
      console.log("Writing a batch of data to" + this.getAddress()
        + " has encountered the following error: " + err));
  }

  /**
   * @param batch Contains the batch of data to be parsed for writing on Influx.
   * @returns An array of points of data.
   */
  public parseBatchData (batch: Array<CalcResult>): Array<IPoint> {
    const batchRes: Array<IPoint> = new Array<IPoint>();
    batch.forEach((item) => {
      const pointTemp: IPoint = this.parsePointData(item);
      batchRes.push(pointTemp);
    });
    return batchRes;
  }

  /**
   * @param point Contains the batch of data to be parsed for writing on Influx.
   * @returns A point of data.
   */
  public parsePointData (point: CalcResult): IPoint {
    const pointRes: IPoint = {
      fields: {},
      measurement: point.getName(),
    };
    point.getValueProbs().forEach((item) => {
      Object.defineProperty(pointRes, item.getValueName(), {value: item.getProbValue()});
    });
    return pointRes;
  }
}
