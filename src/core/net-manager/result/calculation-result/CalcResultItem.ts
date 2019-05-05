/**
 * @File CalcResultItem.ts
 * @Type TypeScript file
 * @Desc Contains the CalcResultItem class.
 */
/**
 * @class CalcResultItem
 * @desc Contains the result of the recalculation for one state of a node.
 */
export class CalcResultItem {
  /**
   * @field Name of the state.
   */
  private readonly valueName: string;
  /**
   * @field Probability associated to the state.
   */
  private readonly probValue: number;

  public constructor (valueName: string, probValue: number) {
    if (valueName === null || valueName.length === 0) {
      throw new Error("[7DOS G&B][CalcResultItem]constructor - invalid valueName parameter");
    }
    if (probValue === null || probValue < 0 || probValue > 1) {
      throw new Error("[7DOS G&B][CalcResultItem]constructor - invalid probValue parameter");
    }
    this.valueName = valueName;
    this.probValue = probValue;
  }

  /**
   * @returns Returns the name of the state.
   */
  public getValueName (): string {
    return this.valueName;
  }
  /**
   *  @returns The probability associated to the state.
   */
  public getProbValue (): number {
    return this.probValue;
  }
}
