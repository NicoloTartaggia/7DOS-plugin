/*
  File: WriteClientFactory.ts
  Version: 1.0.0
  Type: Typescript module
  Author: Andrea Trevisin
  Email: andre.trevisin@gmail.com
  Date: 30/03/2019
  Desc: Module containing the definition of the factory class
        used to instantiate WriteClient subclasses
  Changelog:
    Andrea Trevisin, 02/04/19, deleted WriteClientCreator
    Andrea Trevisin, 01/04/19, added WriteClientCreator (experimental)
    Andrea Trevisin, 31/04/19, implemented ConcreteWriteClientFactory
    Andrea Trevisin, 30/04/19, created file and implemented interface WriteClient
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
    const address: string = host + ":" + port;
    const login: string = credentials
      ? credentials[0] + ":" + credentials[1] + "@"
      : "";
    const dsn = "http://" + login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn);
    return new InfluxReadClient(address, influx);
  }
}
