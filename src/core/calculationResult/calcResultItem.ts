export class CalcResultItem {
    private valueName: string;
    private probValue: number;
    public constructor(valueName: string, probValue: number) {
        this.valueName = valueName;
        this.probValue = probValue;
    }
    public getValueName(): string {
        return this.valueName;
    }
    public getProbName(): number {
        return this.probValue;
    }

}
