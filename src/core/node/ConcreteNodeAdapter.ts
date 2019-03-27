import { AbstractValue } from "./Value/AbstractValue";

export class ConcreteNodeAdapter{
  private values: Array<AbstractValue>;
  private node:JNode;

  public getName() {
    return this.node.name;
  }

  public getStates() {
    return this.node.values;
  }

  public getValues() {
    return this.values;
  }
}
