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
    const address: string = host + ":" + port;
    let login: string = "";
    if (credentials[1]) {
      login = credentials
        ? credentials[0] + ":" + credentials[1] + "@"
        : "";
    }
    // TODO address is already "http://localhost:8086" login must be appended
    const dsn = login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn);
    return new InfluxReadClient(address, influx);
  }
}
