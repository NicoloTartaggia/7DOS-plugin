/*
  File: ReadClientFactory.ts
  Version: 1.0.0
  Type: Typescript module
  Author: Michele Roverato
  Email: andre.trevisin@gmail.com
  Date: 30/03/2019
  Desc: Module containing the definition of the factory class
        used to instantiate ReadClient subclasses
  Changelog:
    Andrea Trevisin, 02/04/19, deleted ReadClientCreator
    Andrea Trevisin, 01/04/19, added ReadClientCreator (experimental)
    Michele Roverato, 31/04/19, implemented ConcreteReadClientFactory
    Michele Roverato, 30/04/19, created file and implemented interface ReadClient
*/

import {
  InfluxDB,
} from "influx";
import InfluxReadClient from "./InfluxReadClient";
import ReadClient from "./ReadClient";

export default interface ReadClientFactory {
  makeInfluxReadClient (host: string, port: string, credentials?: [string, string]): ReadClient;
}

export class ConcreteReadClientFactory implements ReadClientFactory {
  public makeInfluxReadClient (host: string, port: string, credentials?: [string, string])
    : InfluxReadClient {
    if (host === null ||  host.length === 0) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid host parameter");
    }
    if (port === null || port.length === 0) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid port parameter");
    }
    if ((credentials != null && (credentials[0] === null
    || credentials[0] === "" || credentials[1] === null))) {
      throw new Error("[7DOS G&B][ConcreteReadClientFactory]makeInfluxReadClient - invalid credentials parameter");
    }
    const dsn: URL = new URL(host);
    dsn.port = port;
    if (credentials && credentials[0] != null && credentials[0].length !== 0) {
      dsn.username = credentials[0];
      dsn.password = credentials[1];
    }
    const dsn_string = dsn.toString();
    const influx: InfluxDB = new InfluxDB(dsn_string);
    return new InfluxReadClient(dsn_string, influx);
  }
}
