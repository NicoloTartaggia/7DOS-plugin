import {InfluxDB, IPoint} from "influx";
import {CalcResult} from "../calculation_result/CalcResult";
import WriteClient from "./WriteClient";

export default class InfluxWriteClient implements WriteClient {

  /**
   * @field The datasource name of the server to which the client makes requests.
   */
  private readonly dsn: string;

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
  constructor (dsn: string, defaultDB: string, influx: InfluxDB) {
    this.dsn = dsn;
    this.defaultDB = defaultDB;
    this.influx = influx;
  }

  /**
   * @returns The address of the server the client is connected to.
   */
  public getAddress (): string {
    return this.dsn;
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
    const batchData: Array<IPoint> = this.parseBatchData(batch);
    this.influx.writePoints(
      batchData,
      {
        database,
      },
    ).catch((err) => {
      throw new Error ("Writing a batch of data to" + this.getAddress()
        + " has encountered the following error: " + err);
    });
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
    this.influx.writePoints([
      pointData,
    ], {
      database,
    }).catch((err) => {
      throw new Error ("Writing a point of data to" + this.getAddress()
        + " has encountered the following error: " + err);
    });
  }

  /**
   * @param batch Contains the batch of data to be parsed for writing on Influx.
   * @returns An array of points of data.
   */
  private parseBatchData (batch: Array<CalcResult>): Array<IPoint> {
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
  private parsePointData (point: CalcResult): IPoint {
    const pointRes: IPoint = {
      fields: {},
      // measurement: point.getName(),
    };
    point.getValueProbs().forEach((item) => {
      Object.defineProperty(pointRes, item.getValueName(), {value: item.getProbValue()});
    });
    return pointRes;
  }
}
