/**
 * @File AbstractValue.ts
 * @Type TypeScript file
 * @Desc Contains the AbstractValue abstract class.
 */
/**
 * @class AbstractValue
 * @desc Generalized value for the nodes' states.
 */
export abstract class AbstractValue {
  private readonly valueName: string;

  protected constructor(valueName: string) {
    this.valueName = valueName;
  }
  /**
   * @desc Abstract method, reimplemented by subclasses to check if the value is compatible with its type.
   * @param value The value to be checked.
   * @returns True if the value is compatible with the AbstractValue subclass, false if not.
   */
  public abstract isValueType(value: string): boolean;
  /**
   * @returns the type of the value.
   */
  public getValueName() {
    return this.valueName;
  }
}
