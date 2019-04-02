/*
  File: WriteClient.ts
  Version: 1.0.0
  Type: Typescript module
  Author: Andrea Trevisin
  Email: andre.trevisin@gmail.com
  Date: 26/03/2019
  Desc: Module containing the definition of WriteClient interface
  Changelog:
    Andrea Trevisin, 02/04/19, deleted WriteClientCreator
    Andrea Trevisin, 01/04/19, added WriteClientCreator (experimental)
    Andrea Trevisin, 31/04/19, implemented ConcreteWriteClientFactory
    Andrea Trevisin, 30/04/19, created file and implemented interface WriteClient
*/

import {CalcResult} from "../calculation_result/CalcResult";
import {CalcResultAggregate} from "../calculation_result/CalcResultAggregate";

export default interface WriteClient {
  writeBatchData(batch: CalcResultAggregate , ...options): any;
  writePointData(point: CalcResult, ...options): any;
}
