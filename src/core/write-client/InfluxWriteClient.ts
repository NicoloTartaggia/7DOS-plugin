import {InfluxDB, IPoint} from "influx";
import {CalcResult} from "../net-manager/result/calculation-result/CalcResult";
import {CalcResultAggregate} from "../net-manager/result/calculation-result/CalcResultAggregate";
import {WriteClient} from "./WriteClient";

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
    if (dsn == null || defaultDB == null || influx == null) {
      throw new Error("invalid parameter");
    }
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
  public async writeBatchData (batch: CalcResultAggregate,
                               database: string = this.defaultDB)
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
                               database: string = this.defaultDB)
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
  private parseBatchData (batch: CalcResultAggregate): Array<IPoint> {
    const batchRes: Array<IPoint> = new Array<IPoint>();
    const iterator: IterableIterator<CalcResult> = batch.createIterator();
    for (const item of iterator) {
      const pointTemp: IPoint = this.parsePointData(item);
      batchRes.push(pointTemp);
    }
    return batchRes;
  }

  /**
   * @param point Contains the batch of data to be parsed for writing on Influx.
   * @returns A point of data.
   */
  private parsePointData (point: CalcResult): IPoint {
    const pointRes: IPoint = {
      fields: {},
      measurement: point.getNodeName(),
    };
    point.getValueProbs().forEach((item) => {
      const field: string = item.getValueName();
      pointRes.fields[field] = item.getProbValue();
    });
    return pointRes;
  }
}
