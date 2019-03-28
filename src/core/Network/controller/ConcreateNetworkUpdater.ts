import { NetworkAdapter } from "core/network/adapter/NetworkAdapter";

export class concreateNetworkUpdater {
    private network: NetworkAdapter;

    public constructor(network: NetworkAdapter) {
        this.network = network;
    }

    public updateNodeStatus(node: string, result: string) {
        this.network.getNodeList.
    }
}
