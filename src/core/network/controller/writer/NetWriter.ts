import {CalcResultAggregate} from "core/result/calculation_result/CalcResultAggregate";
import {WriteClient} from "../../../write_client/write-client-module";

export interface NetWriter {
  write(data: CalcResultAggregate): Promise<void>;
}

export class SingleNetWriter implements NetWriter {
  private client: WriteClient;

  public constructor(client: WriteClient) {
    this.client = client;
  }

  public async write(calcData: CalcResultAggregate): Promise<void> {
    await this.client.writeBatchData(calcData);
  }
}
