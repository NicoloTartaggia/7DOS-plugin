import { InputResultAggregate } from "../../../../core/inputReadResult/InputResultAggregate";
import {NodeAdapter} from "../../../../core/node/NodeAdapter";
import { InputResult } from "../../../inputReadResult/InputResult";
import {InputFlow} from "./flux/InputFlow";

export class NetReader {
  private inputFlux: Map<NodeAdapter, InputFlow>;

  public constructor (nodeList: Array<NodeAdapter>) {
    for (const node of nodeList) {
      this.inputFlux.set(node, null);
    }
  }

  public read(): InputResultAggregate {
    // TODO: Funzione di read per un NodeAdapter
  /*
    CICLO

      chiama client read
      mi ritorna il valore
      lo collego

    fine ciclo
*/
    return new InputResultAggregate(new Array<InputResult> (new InputResult(null, "true")));
  }
}
