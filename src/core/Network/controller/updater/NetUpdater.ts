import {NetworkAdapter} from "../../Adapter/NetworkAdapter";
import {NetReader} from "../reader/NetReader";

export class ConcreteNetworkUpdater {
  private readonly network: NetworkAdapter;
  private reader: NetReader;

  public constructor (network: NetworkAdapter) {
    this.network = network;
    this.reader = new NetReader(this.network.getNodeList());
    this.reader.toString();
  }

  public updateNet () {
    // TODO
    console.log(this.network);
    // this.network.getNodeList.
  }
}
