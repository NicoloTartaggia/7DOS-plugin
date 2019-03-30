import {OutputFlux} from "./OutputFlux";

export default class InfluxOutputFlux implements OutputFlux {
  public writeResult(result: string): boolean {
    console.log("InfluxOutputFlux-writeResult() TODO");
    return false;
  }
}
