import { CalcResult } from "../../../../core/calculation_result/CalcResult";
import { CalcResultItem } from "../../../../core/calculation_result/CalcResultItem";
import { CalcResultAggregate } from "../../../calculation_result/CalcResultAggregate";
import { InputResult } from "../../../inputReadResult/InputResult";
import { InputResultAggregate } from "../../../inputReadResult/InputResultAggregate";
import {NetworkAdapter} from "../../adapter/NetworkAdapter";

export class NetUpdater {
  private readonly network: NetworkAdapter;

  public constructor (network: NetworkAdapter) {// TODO rimettere il NetworkAdapter
    this.network = network;
  }

  public updateNet (fluxResults: InputResultAggregate): CalcResultAggregate {
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

    /*
      ciclo che prende tutte le probs, crea i CalcResultItem per ogni stato del nodo
      e crea l'effettivo calcResult del nodo
     */
    const arrayCalcResult = new Array<CalcResult>();
    for (const node of this.network.getNodeList()) {
      const probs: Array<number> = this.network.getNodeProbs(node.getName());
      const arrayCalcResultItem = new Array<CalcResultItem>();
      const statesNode = node.getStates();
      for (let i = 0; i < statesNode.length; i++) {
        arrayCalcResultItem.push(new CalcResultItem(statesNode[i], probs[i]));
      }
      arrayCalcResult.push(new CalcResult(node.getName(), arrayCalcResultItem));
    }
    return  new CalcResultAggregate(arrayCalcResult);
  }
}
