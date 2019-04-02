/*
  File: ReadClientFactory.ts
  Version: 1.0.0
  Type: Typescript module
  Author: Andrea Trevisin
  Email: andre.trevisin@gmail.com
  Date: 30/03/2019
  Desc: Module containing the definition of the factory class
        used to instantiate ReadClient subclasses
  Changelog:
    Andrea Trevisin, 02/04/19, deleted ReadClientCreator
    Andrea Trevisin, 01/04/19, added ReadClientCreator (experimental)
    Andrea Trevisin, 31/04/19, implemented ConcreteReadClientFactory
    Andrea Trevisin, 30/04/19, created file and implemented interface ReadClient
*/

import {
  InfluxDB,
} from "influx";
import InfluxReadClient from "./InfluxReadClient";
import ReadClient from "./ReadClient";

export interface ReadClientFactory {
  makeInfluxReadClient(url: string, defaultDB: string, credentials?: [string, string]): ReadClient;
}

export class ConcreteReadClientFactory implements ReadClientFactory {
  /**
   * @param host The network address of the server to which the client must connect.
   * @param port  The port through the server is listening for requests from the client.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxReadClient.
   */
  public makeInfluxReadClient (host: string, port: string,
                               credentials?: [string, string]): InfluxReadClient {
    const address: string = host + ":" + port;
    const login: string = credentials
      ? credentials[0] + ":" + credentials[1] + "@"
      : "";
    const dsn = "http://" + login + address + "/";
    const influx: InfluxDB = new InfluxDB(dsn);
    return new InfluxReadClient(address, influx);
  }
}
