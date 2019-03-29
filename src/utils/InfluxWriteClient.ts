import {
  InfluxDB, IPoint,
} from "influx";
import WriteClient from "./WriteClient";

export default class InfluxWriteClient implements WriteClient {
  /*
    Factory method
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
  /*
      Constructor
  */
  private constructor(address: string, defaultDB: string, influx: InfluxDB) {
    this.address = address;
    this.defaultDB = defaultDB;
    this.influx = influx;
  }
  /*
      Methods
  */
  public getAddress(): string {
    return this.address;
  }
  public getDefaultDB(): string {
    return this.defaultDB;
  }

  // Creates a client with a deafult database based on the currently loaded network
  public async writeBatchData(batch: Array<object>,
                              { database = this.defaultDB }: { database?: string })
    : Promise<void> {
      const batchInfo: {name: string, points: Array<IPoint>} = this.getBatchData(batch);
      try {
        await this.influx.writeMeasurement(
            batchInfo.name,
            batchInfo.points,
        );
      } catch(err) {
        console.log("Writing a batch of data to" + this.getAddress()
        + " has encountered the following error: " + err);
      }
  }

  public async writePointData(point: object,
                        { database = this.defaultDB }: { database?: string })
    : Promise<void> {
    const pointInfo: IPoint = this.getPointData(point);
    try {
      await this.influx.writePoints([
          pointInfo,
      ]);
      } catch(err) {
        console.log("Writing a point of data to" + this.getAddress()
        + " has encountered the following error: " + err);
      }
  }

  private getBatchData(batch: Array<object>): {name: string, points: Array<IPoint>} {
    return {name: "yourname", points: []};
  }
  private getPointData(point: object): IPoint {
    return {measurement: "yourname", fields: {vcpu: 2}};
  }
}
