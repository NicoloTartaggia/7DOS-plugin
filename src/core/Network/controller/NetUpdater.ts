import { NetworkAdapter } from "core/network/adapter/NetworkAdapter";
import { NetReader } from "./reader/NetReader";

export class concreteNetworkUpdater {
    private network: NetworkAdapter;
    private reader: NetReader;
    public constructor(network: NetworkAdapter) {
        this.network = network;
        this.reader = new NetReader(this.network.getNodeList());
    }

    public updateNet() {

        

        // TODO
        console.log(this.network);
        // this.network.getNodeList.
    }
}
