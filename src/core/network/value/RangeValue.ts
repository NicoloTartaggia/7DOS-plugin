import { AbstractValue } from "./AbstractValue";

class RangeValue extends AbstractValue {
  private readonly minRange: number;
  private readonly maxRange: number;

  constructor(minRange: number, maxRange: number, name: string) {
    if (minRange == null || maxRange == null || name == null) {
      throw new Error("invalid parameter");
    } else if (minRange > maxRange) {
      throw new Error("maxRange is less then minRange");
    }
    super(name);
    this.minRange = minRange;
    this.maxRange = maxRange;
  }

  public isValueType(value: string): boolean {
    if (value == null) {
      throw new Error("invalid parameter");
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
