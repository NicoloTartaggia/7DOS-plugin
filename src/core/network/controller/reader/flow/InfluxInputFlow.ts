import {InputFlow} from "./InputFlow";

export  class InfluxInputFlow implements InputFlow {
  private query: string;

  constructor(query: string) {
    this.query = query;
  }

  public getResult(): string {
    this.query.toString();
    return "InfluxInputFlow-getResult() TODO";
  }
}
