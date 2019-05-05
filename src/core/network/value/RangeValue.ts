/**
 * @File RangeValue.ts
 * @Type TypeScript file
 * @Desc Contains the RangeValue abstract class.
 */
import { AbstractValue } from "./AbstractValue";

class RangeValue extends AbstractValue {
  private readonly minRange: number;
  private readonly maxRange: number;

  constructor(minRange: number, maxRange: number, name: string) {
    if (minRange == null)  {
      throw new Error("[7DOS G&B][RangeValue]constructor - invalid minRange parameter");
    }
    if (maxRange == null) {
      throw new Error("[7DOS G&B][RangeValue]constructor - invalid maxRange parameter");
    }
    if (minRange > maxRange) {
      throw new Error("[7DOS G&B][RangeValue]constructor - maxRange is less then minRange");
    }
    if (name == null || name.length === 0) {
      throw new Error("[7DOS G&B][RangeValue]constructor - invalid name parameter");
    }
    super(name);
    this.minRange = minRange;
    this.maxRange = maxRange;
  }

  public isValueType(value: string): boolean {
    if (value == null || value.length === 0) {
      throw new Error("[7DOS G&B][RangeValue]isValueType - invalid value parameter");
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
