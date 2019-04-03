export class CalcResultItem {
  private readonly valueName: string;
  private readonly probValue: number;

  public constructor(valueName: string, probValue: number) {
    if(valueName===null||probValue===null || probValue<0 || probValue>1){
      throw new Error("invalid parameter");
    }
    this.valueName = valueName;
    this.probValue = probValue;
  }
  public getValueName(): string {
    return this.valueName;
  }
  public getProbValue(): number {
    return this.probValue;
  }

}
