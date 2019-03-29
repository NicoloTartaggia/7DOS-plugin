import { AbstractValue } from "./Value/AbstractValue";

export class ConcreteNodeAdapter {
  private values: Array<AbstractValue>;
  private node: JNode;

  constructor(node: JNode, values: Array<AbstractValue>) {
    if (node == null || values == null) {
      throw new TypeError("invalid parameter");
    }
    this.node = node;
    this.values = values;
  }

  public getName(): string {
    return this.node.name;
  }

  public getStates(): Array<string> {
// tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.node.values); // deep copy of array
  }

  public getValues(): Array<AbstractValue> {
// tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.values);
  }

  public findValue(currentValue: string): AbstractValue {
    this.values.forEach((element) => {
      if (element.isValueType(currentValue)) {
        return element;
      }
    });
    return null;
  }
}
