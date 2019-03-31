import {InputFlux} from "./InputFlux";

export  class InfluxInputFlux implements InputFlux {
  private query: string;

  constructor(query: string) {
    this.query = query;
  }

  public getResult(): string {
    this.query.toString();
    return "InfluxInputFlux-getResult() TODO";
  }
}
