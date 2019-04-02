import { NetReader } from "./reader/NetReader";
import {  NetUpdater } from "./updater/NetUpdater";
import { NetWriter } from "./writer/NetWriter";

export class NetManager {
  private reader: NetReader;
  private updater: NetUpdater;
  private writer: NetWriter;

  // TODO aggiungere writer
  public constructor(reader: NetReader, updater: NetUpdater, writer: NetWriter) {
    this.reader = reader;
    this.updater = updater;
    this.writer = writer;
  }
  public updateNet() {
    // TODO aggiungere chiamata ulteriore a writer
    this.writer.write(this.updater.updateNet(this.reader.read()));
  }
}
