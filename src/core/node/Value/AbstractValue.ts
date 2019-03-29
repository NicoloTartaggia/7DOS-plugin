abstract class AbstractValue {
    private valueName: string;
    constructor(valueName: string) {
        this.valueName = valueName;
    }
    public abstract isValueType(value: string): boolean;
    public getValueName() {
        return this.valueName;
    }
}

export { AbstractValue };
