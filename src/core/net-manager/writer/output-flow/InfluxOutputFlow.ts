import {OutputFlow} from "./OutputFlux";

export default class InfluxOutputFlow implements OutputFlow {
  public writeResult(result: string): boolean {
    console.log("InfluxOutputFlux-writeResult() TODO");
    return false;
  }
}
