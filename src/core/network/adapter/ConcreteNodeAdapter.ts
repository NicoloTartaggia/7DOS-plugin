/**
 * @File ConcreteNodeAdapter.ts
 * @Type TypeScript file
 * @Desc Contains the ConcreteNodeAdapter class.
 */
import {AbstractValue} from "../value/value";
import {NodeAdapter} from "./adapter";

/**
 * @class ConcreteNodeAdapter
 * @desc Adapter pattern implementation for the JNode interface provided by JsBayes.
 */
export class ConcreteNodeAdapter implements NodeAdapter {
  private readonly values: Array<AbstractValue>;
  private node: JNode;

  constructor (node: JNode, values: Array<AbstractValue>) {
    if (node == null) {
      throw new Error("invalid node parameter");
    }
    if (values == null || values.length === 0) {
      throw new Error("invalid values parameter");
    }
    this.node = node;
    this.values = values;
  }
  /**
   * @Override - Function that fixes a specific values (state) for a node in the network
   */
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
    if (currentValue == null || currentValue.length === 0) {
      throw new Error("invalid currentValue parameter");
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
