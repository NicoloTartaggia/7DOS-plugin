import { AbstractValue } from "./Value/AbstractValue";

export class ConcreteNodeAdapter {
  private values: Array<AbstractValue>;
  private node: JNode;

  constructor(node: JNode, values: Array<AbstractValue>) {
      this.node = node;
      this.values = values;
  }

  public getName(): string {
    return this.node.name;
  }

  public getStates(): Array<string> {
    return this.node.values;
  }

  public getValues(): Array<AbstractValue> {
    return this.values;
  }
}
