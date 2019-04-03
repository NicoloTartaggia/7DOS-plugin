import { AbstractValue } from "./AbstractValue";

class StringValue extends AbstractValue {
  private readonly value: string;

  constructor(value: string, name: string) {
    if (value == null || name == null) {
      throw new Error("invalid parameter");
    }
    super(name);
    this.value = value;
  }

  public isValueType(value: string): boolean {
    if (value == null) {
      throw new Error("invalid parameter");
    }
    if (this.value === value) {
      return true;
    } else {
      return false;
    }
  }
}

export { StringValue };
