abstract class AbstractValue {
  private readonly valueName: string;

  protected constructor(valueName: string) {
    this.valueName = valueName;
  }
  public abstract isValueType(value: string): boolean;
  public getValueName() {
    return this.valueName;
  }
}

export { AbstractValue };
