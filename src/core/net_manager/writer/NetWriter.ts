import {CalcResultAggregate} from "core/net_manager/result/calculation-result/CalcResultAggregate";
import {WriteClient} from "../../write-client/write-client";

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
