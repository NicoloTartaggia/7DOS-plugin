import {
  InfluxDB,
} from "influx";
import InfluxWriteClient from "./InfluxWriteClient";
import WriteClient from "./WriteClient";

/*
    Come funziona:
    per creare un client è sufficiente invocare il metodo static chooseClient, che in base al tipo fornito invoca
    la factory corretta e ne res
*/
export class WriteClientCreator {
  public static chooseClient(type: string, options): WriteClient {
    let factory: WriteClientFactory;
    switch (type) {
      case "influx":
        factory = new InfluxClientFactory();
        return factory.makeWriteClient(options.url, options.defaultDB, options.credentials);
      default:
        throw new Error("Cannot instance a client of type: " + type);
    }
  }
}

interface WriteClientFactory {
  makeWriteClient(...options): WriteClient;
}

class InfluxClientFactory implements WriteClientFactory {
  /**
   * @param url The URL of the server to which the client wants to connect.
   * @param defaultDB  The name of the default database for the client to write to.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public makeWriteClient(url: string, defaultDB: string, credentials?: [string, string]): InfluxWriteClient {
    const login: string = credentials ?
      credentials[0] + ":" + credentials[1] + "@" :
      "";
    const dsn = "http://" + login + url;
    const influx: InfluxDB = new InfluxDB(dsn + "/" + defaultDB);
    try {
      influx.getDatabaseNames()
        .then((names) => {
          if (!names.includes(defaultDB)) {
            return influx.createDatabase(defaultDB);
          }
        });
    } catch (err) {
      console.log("Creating default database at: " + dsn + " has encountered the following error: " + err);
    }
    return new InfluxWriteClient(dsn, defaultDB, influx);
  }
}
