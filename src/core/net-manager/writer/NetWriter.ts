import {WriteClient} from "../../write-client/write-client";
import {CalcResultAggregate} from "../result/calculation-result/calculation-result";

export interface NetWriter {
  write(data: CalcResultAggregate): Promise<void>;
}

export class SingleNetWriter implements NetWriter {
  private client: WriteClient;

  public constructor(client: WriteClient) {
    if (client == null) {
      throw new Error("[7DOS G&B][SingleNetWriter]constructor - invalid client parameter");
    }
    this.client = client;
  }

  public async write(calcData: CalcResultAggregate): Promise<void> {
    if (calcData == null) {
      throw new Error("[7DOS G&B][SingleNetWriter]write - invalid calcData parameter");
    }
    await this.client.writeBatchData(calcData);
  }
}
