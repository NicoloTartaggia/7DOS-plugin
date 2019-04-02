import {InputFlow} from "./InputFlow";

export  class InfluxInputFlux implements InputFlow {
  private query: string;

  constructor(query: string) {
    this.query = query;
  }

  public getResult(): string {
    this.query.toString();
    return "InfluxInputFlux-getResult() TODO";
  }
}
