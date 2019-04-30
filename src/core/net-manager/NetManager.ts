import { NetReader } from "./reader/NetReader";
import {CalcResultAggregate} from "./result/calculation-result/CalcResultAggregate";
import {InputResultAggregate} from "./result/input-result/InputResultAggregate";
import {  NetUpdater } from "./updater/NetUpdater";
import { NetWriter } from "./writer/NetWriter";

export class NetManager {
  private reader: NetReader;
  private updater: NetUpdater;
  private writer: NetWriter;

  // TODO aggiungere writer
  public constructor(reader: NetReader, updater: NetUpdater, writer: NetWriter) {
    if (reader == null) {
      throw new Error("[7DOS G&B][NetManager]constructor - invalid reader parameter");
    }
    if (updater == null) {
      throw new Error("[7DOS G&B][NetManager]constructor - invalid updater parameter");
    }
    if (writer == null) {
      throw new Error("[7DOS G&B][NetManager]constructor - invalid writer parameter");
    }
    this.reader = reader;
    this.updater = updater;
    this.writer = writer;
  }
  public async updateNet(): Promise<void> {
    // TODO aggiungere chiamata ulteriore a writer
    const read_res: InputResultAggregate = await this.reader.read()
      .catch((err) => {
        throw new Error("[7DOS G&B][NetManager]updateNet - Error while reading from input datasource. " +
          "For more details, see error: " + err);
      });
    const update_res: CalcResultAggregate = this.updater.updateNet(read_res);
    await this.writer.write(update_res)
      .catch((err) => {
        throw new Error("[7DOS G&B][NetManager]updateNet - Error while writing to output datasource. " +
          "For more details, see error: " + err);
      });
  }
}
