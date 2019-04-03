import {AbstractValue} from "../value/value-module";
import {NodeAdapter} from "./NodeAdapter";

export class ConcreteNodeAdapter implements NodeAdapter {
  private readonly values: Array<AbstractValue>;
  private node: JNode;

  constructor (node: JNode, values: Array<AbstractValue>) {
    if (node == null || values == null) {
      throw new Error("invalid parameter");
    }
    this.node = node;
    this.values = values;
  }

  public getName (): string {
    return this.node.name;
  }

  public getStates (): Array<string> {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.node.values); // deep copy of array
  }

  public getValues (): Array<AbstractValue> {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign([], this.values);
  }

  public findValue (currentValue: string): AbstractValue {
    if (currentValue == null) {
      throw new Error("invalid parameter");
    }

    for (const element of this.values) {
      try {
        if (element.isValueType(currentValue)) {
          return element;
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
    return null;
  }
}
