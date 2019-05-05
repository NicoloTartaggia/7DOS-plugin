/**
 * @File NetWriter.ts
 * @Type TypeScript file
 * @Desc Contains the NetWriter class.
 */
import {WriteClient} from "../../write-client/write-client";
import {CalcResultAggregate} from "../result/calculation-result/calculation-result";

export interface NetWriter {
  write(data: CalcResultAggregate): Promise<void>;
}
/**
 * @class SingleNetWriter
 * @description Requests a single client to write the result of the calculations of a bayesian network
 * to its default database.
 */
export class SingleNetWriter implements NetWriter {
  private client: WriteClient;

  public constructor(client: WriteClient) {
    if (client == null) {
      throw new Error("[7DOS G&B][SingleNetWriter]constructor - invalid client parameter");
    }
    this.client = client;
  }
  /**
   * @desc Requests the object's client to write a batch of data.
   * @param calcData The data to be written.
   */
  public async write(calcData: CalcResultAggregate): Promise<void> {
    if (calcData == null) {
      throw new Error("[7DOS G&B][SingleNetWriter]write - invalid calcData parameter");
    }
    await this.client.writeBatchData(calcData);
  }
}
