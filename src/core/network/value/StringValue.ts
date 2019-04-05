import { AbstractValue } from "./AbstractValue";

class StringValue extends AbstractValue {
  private readonly value: string;

  constructor(value: string, name: string) {
    if (value == null ||  value.length === 0) {
      throw new Error("invalid value parameter");
    }
    if (name == null || name.length === 0) {
      throw new Error("invalid name parameter");
    }
    super(name);
    this.value = value;
  }

  public isValueType(value: string): boolean {
    if (value == null || value.length === 0) {
      throw new Error("invalid value parameter");
    }
    if (this.value === value) {
      return true;
    } else {
      return false;
    }
  }
}

export { StringValue };
