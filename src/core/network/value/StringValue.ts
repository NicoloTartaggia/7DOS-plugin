/**
 * @File StringValue.ts
 * @Type TypeScript file
 * @Desc Contains the StringValue abstract class.
 */
import { AbstractValue } from "./AbstractValue";

class StringValue extends AbstractValue {
  private readonly value: string;

  constructor(value: string, name: string) {
    if (value == null ||  value.length === 0) {
      throw new Error("[7DOS G&B][StringValue]constructor - invalid value parameter");
    }
    if (name == null || name.length === 0) {
      throw new Error("[7DOS G&B][StringValue]constructor - invalid name parameter");
    }
    super(name);
    this.value = value;
  }

  public isValueType(value: string): boolean {
    if (value == null || value.length === 0) {
      throw new Error("[7DOS G&B][StringValue]isValueType - invalid value parameter");
    }
    if (this.value === value) {
      return true;
    } else {
      return false;
    }
  }
}

export { StringValue };
