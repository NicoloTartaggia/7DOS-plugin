import { AbstractValue } from "./Value/AbstractValue";

export class ConcreteNodeAdapter{
  private values: Array<AbstractValue>;
  private node:JNode;

  public getName() {
    return this.node.name;
  }

  public getStates() {
    
  }

  public getValues() {
    return this.values;
  }
}
