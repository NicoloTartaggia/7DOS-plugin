import { CalcResult } from "core/calculation_result/CalcResult";
import { CalcResultItem } from "core/calculation_result/CalcResultItem";
import { CalcResults } from "core/calculation_result/CalcResults";
import { FluxResult } from "core/fluxReadResult/FluxResult";
import { FluxResults } from "core/fluxReadResult/FluxResults";
import {NetworkAdapter} from "../../adapter/NetworkAdapter";

export class NetUpdater {
  private readonly network: NetworkAdapter;

  public constructor (network: NetworkAdapter) {
    this.network = network;
  }

  public updateNet (fluxResults: FluxResults): CalcResults {
    // TODO
    const iterator: IterableIterator<FluxResult> = fluxResults.buildIterator();
    iterator.next();
    this.network.getNodeList();
    // TODO ciclo che itera tutti i FluxResult e fissa gli observe
    return  new CalcResults(
      new Array<CalcResult>(
        new CalcResult("test", new Array<CalcResultItem>(
          new CalcResultItem("valueTest", 0.2)))));
  }
}
