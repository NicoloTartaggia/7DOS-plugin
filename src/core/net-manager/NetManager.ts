import { NetReader } from "./reader/NetReader";
import {CalcResultAggregate} from "./result/calculation-result/CalcResultAggregate";
import {InputResultAggregate} from "./result/input-result/InputResultAggregate";
import {  NetUpdater } from "./updater/NetUpdater";
import { NetWriter } from "./writer/NetWriter";
/**
 * @class NetManager
 * @desc Mediator for the NetReader, NetUpdater and NetWriter classes.
 */
export class NetManager {
  /**
   * @field Reference to a NetReader object.
   */
  private reader: NetReader;
  /**
   * @field Reference to a NetUpdater object.
   */
  private updater: NetUpdater;
  /**
   * @field Reference to a NetWriter object.
   */
  private writer: NetWriter;

  // TODO aggiungere writer
  public constructor(reader: NetReader, updater: NetUpdater, writer: NetWriter) {
    if (reader == null) {
      throw new Error("invalid reader parameter");
    }
    if (updater == null) {
      throw new Error("invalid updater parameter");
    }
    if (writer == null) {
      throw new Error("invalid writer parameter");
    }
    this.reader = reader;
    this.updater = updater;
    this.writer = writer;
  }

  /**
   * @desc In a controlled environment, in order, reads the status of the system, updates the net accordingly and
   * writes the results.
   */
  public async updateNet(): Promise<void> {
    // TODO aggiungere chiamata ulteriore a writer
    const read_res: InputResultAggregate = await this.reader.read()
      .catch((err) => {
        throw new Error("Error while reading from input datasource. For more details, see error: " + err);
      });
    const update_res: CalcResultAggregate = this.updater.updateNet(read_res);
    await this.writer.write(update_res)
      .catch((err) => {
        throw new Error("Error while writing to output datasource. For more details, see error: " + err);
      });
  }
}
