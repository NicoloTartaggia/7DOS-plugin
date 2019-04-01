import { NetReader } from "./reader/NetReader";
import {  NetUpdater } from "./updater/NetUpdater";

export class NetManager {
  private reader: NetReader;
  private updater: NetUpdater;
  // TODO aggiungere writer
  public constructor() {
  }
  public updateNet() {
    // TODO aggiungere chiamata ulteriore a writer
    this.updater.updateNet(this.reader.read());
  }
}
