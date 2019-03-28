import { NetworkAdapter } from "core/network/adapter/NetworkAdapter";

export class concreteNetworkUpdater {
    private network: NetworkAdapter;

    public constructor(network: NetworkAdapter) {
        this.network = network;
    }

    public updateNodeStatus(node: string, result: string) {
        // TODO
        console.log(this.network);
        // this.network.getNodeList.
    }
}
