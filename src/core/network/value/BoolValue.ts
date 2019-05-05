/**
 * @File RangeValue.ts
 * @Type TypeScript file
 * @Desc Contains the RangeValue abstract class.
 */
import { AbstractValue } from "./AbstractValue";

class BoolValue extends AbstractValue {
  private readonly value: boolean;

  constructor(value: boolean, name: string) {
    if (name == null || name.length === 0) {
      throw new Error("[7DOS G&B][BoolValue]constructor - invalid name parameter");
    }
    if (value == null) {
      throw new Error("[7DOS G&B][BoolValue]constructor - invalid value parameter");
    }
    super(name);
    this.value = value;
  }

  public isValueType(value: string): boolean {
    if (value == null || value.length === 0) {
      throw new Error("[7DOS G&B][BoolValue]isValueType - invalid value parameter");
    }
    const boolValue = value.toString().toLowerCase();
    if (boolValue !== "true" && boolValue !== "false") {
      return false;
    } else if (boolValue === "true" && this.value) {
      return true;
    } else if (boolValue === "false" && !this.value) {
      return true;
    } else {
      return false;
    }
  }
}

export { BoolValue };
