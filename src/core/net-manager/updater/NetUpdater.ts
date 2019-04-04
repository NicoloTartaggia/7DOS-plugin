import {NetworkAdapter} from "../../network/adapter/NetworkAdapter";
import { CalcResult } from "../result/calculation-result/CalcResult";
import { CalcResultAggregate } from "../result/calculation-result/CalcResultAggregate";
import { CalcResultItem } from "../result/calculation-result/CalcResultItem";
import { InputResult } from "../result/input-result/InputResult";
import { InputResultAggregate } from "../result/input-result/InputResultAggregate";

export class NetUpdater {
  private readonly network: NetworkAdapter;

  public constructor (network: NetworkAdapter) {// TODO rimettere il NetworkAdapter
    if (network == null) {
      throw new Error("invalid parameter");
    }
    this.network = network;
  }

  public updateNet (fluxResults: InputResultAggregate): CalcResultAggregate {
    if (fluxResults == null || fluxResults.collection.length === 0) {
      throw new Error("invalid parameter");
    }
    const iterator: IterableIterator<InputResult> = fluxResults.buildIterator();
    let currentIt: IteratorResult<InputResult> = iterator.next();

    // ciclo che itera tutti i InputResult e fissa gli observe
    while (!currentIt.done) {
      this.network.observeNode(
        currentIt.value.getNode().getName(),
        currentIt.value.getNode().findValue(
          currentIt.value.getCurrentValue()).getValueName());
      currentIt = iterator.next();
    }

    // TODO: Poter definire qunti sample fare
    this.network.sampleNetwork(10000);

    /*
      ciclo che prende tutte le probs, crea i CalcResultItem per ogni stato del nodo
      e crea l'effettivo calcResult del nodo
     */
    const arrayCalcResult = new Array<CalcResult>();

    for (const node of this.network.getNodeList()) {
      const name: string = node.getName();
      const probs: Array<number> = this.network.getNodeProbs(name);
      const arrayCalcResultItem = new Array<CalcResultItem>();
      const statesNode = node.getStates();
      for (let i = 0; i < statesNode.length; i++) {
        arrayCalcResultItem.push(new CalcResultItem(statesNode[i], probs[i]));
      }
      arrayCalcResult.push(new CalcResult(name, arrayCalcResultItem));
    }
    return new CalcResultAggregate(arrayCalcResult);
  }
}
