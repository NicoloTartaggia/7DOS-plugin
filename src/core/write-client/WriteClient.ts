/**
 * @File WriteClient.ts
 * @Type TypeScript file
 * @Desc Contains the WriteClient interface declaration.
 */
import {CalcResult, CalcResultAggregate} from "../net-manager/result/calculation-result/calculation-result";

export interface WriteClient {
  writeBatchData(batch: CalcResultAggregate , ...options): any;
  writePointData(point: CalcResult, ...options): any;
}
