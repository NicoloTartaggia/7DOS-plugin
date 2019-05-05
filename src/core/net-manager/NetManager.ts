/**
 * @File NetManager.ts
 * @Type TypeScript file
 * @Desc Contains the NetManager class.
 */
import {NetReader} from "./reader/reader";
import {CalcResultAggregate} from "./result/calculation-result/calculation-result";
import {InputResultAggregate} from "./result/input-result/input-result";
import {NetUpdater} from "./updater/NetUpdater";
import {NetWriter} from "./writer/NetWriter";
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

  /**
   * @desc In a controlled environment, in order, reads the status of the system, updates the net accordingly and
   * writes the results.
   */
  public async updateNet(): Promise<void> {
    // TODO aggiungere chiamata ulteriore a writer
    const read_res: InputResultAggregate = await this.reader.read()
      .catch((err) => {
        throw new Error("[7DOS G&B][NetManager]updateNet - Error while reading from input datasource. " +
          "For more details, see error: " + err);
      });
    let update_res: CalcResultAggregate;
    try {
      update_res = this.updater.updateNet(read_res);
    } catch (e) {
      throw new Error("[7DOS G&B][NetManager]updateNet - Error while updating the network data. " +
        "For more details, see error: " + e.toString());
    }
    await this.writer.write(update_res)
      .catch((err) => {
        throw new Error("[7DOS G&B][NetManager]updateNet - Error while writing to output datasource. " +
          "For more details, see error: " + err);
      });
  }
}
