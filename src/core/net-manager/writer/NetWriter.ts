import {CalcResultAggregate} from "core/net-manager/result/calculation-result/CalcResultAggregate";
import {WriteClient} from "../../write-client/write-client";

export interface NetWriter {
  write(data: CalcResultAggregate): Promise<void>;
}

export class SingleNetWriter implements NetWriter {
  private client: WriteClient;

  public constructor(client: WriteClient) {
    if (client == null) {
      throw new Error("invalid parameter");
    }
    this.client = client;
  }

  public async write(calcData: CalcResultAggregate): Promise<void> {
    if (calcData == null) {
      throw new Error("invalid parameter");
    }
    await this.client.writeBatchData(calcData);
  }
}
