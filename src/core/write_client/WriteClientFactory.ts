/**
 * @file WriteClientFactory.ts
 * @version 1.0.0
 * @filetype Typescript module
 * @author Andrea Trevisin
 * @date 02/04/2019
 */

import {
  InfluxDB,
} from "influx";
import InfluxWriteClient from "./InfluxWriteClient";
import {WriteClient} from "./WriteClient";

/**
 * @interface WriteClientFactory
 * @description Exposes the factory methods of ConcreteWriteClientFactory.
 */
export interface WriteClientFactory {
  makeInfluxWriteClient(host: string, port: string, defaultDB: string, credentials?: [string, string])
  : Promise<WriteClient>;
}

/**
 * @class ConcreteWriteClientFactory
 * @description Factory class used to instantiate all the different implementations of WriteClient.
 */
export class ConcreteWriteClientFactory implements WriteClientFactory {
  /**
   * @param host The network name of the server to which the client wants to connect.
   * @param port The port the server is listening on.
   * @param defaultDB  The name of the default database for the client to write to.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public async makeInfluxWriteClient(host: string, port: string, defaultDB: string, credentials?: [string, string])
    : Promise<InfluxWriteClient> {
    const address: string = host + ":" + port;
    const login: string = credentials ?
      credentials[0] + ":" + credentials[1] + "@" :
      "";
    const dsn = "http://" + login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn + "/" + defaultDB);
    influx.getDatabaseNames()
      .then((names) => {
        if (!names.includes(defaultDB)) {
          return influx.createDatabase(defaultDB)
            .catch((err) => {
              throw new Error("Creating default database at: " + dsn + " has encountered the following error: " + err);
            });
        }
      })
      .catch((err) => {
        throw new Error("Getting database names at: " + dsn + " has encountered the following error: " + err);
      });
    return new InfluxWriteClient(dsn, defaultDB, influx);
  }
}