import { AbstractValue } from "./AbstractValue";

class RangeValue extends AbstractValue {
  private readonly minRange: number;
  private readonly maxRange: number;

  constructor(minRange: number, maxRange: number, name: string) {
    if (minRange == null)  {
      throw new Error("invalid minRange parameter");
    }
    if (maxRange == null) {
      throw new Error("invalid maxRange parameter");
    }
    if (minRange > maxRange) {
      throw new Error("maxRange is less then minRange");
    }
    if (name == null || name.length === 0) {
      throw new Error("invalid name parameter");
    }
    super(name);
    this.minRange = minRange;
    this.maxRange = maxRange;
  }

  public isValueType(value: string): boolean {
    if (value == null || value.length === 0) {
      throw new Error("invalid value parameter");
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return false;
    } else if (numericValue < this.minRange || numericValue > this.maxRange) {
      return false;
    } else {
      return true;
    }
  }
}

export { RangeValue };
