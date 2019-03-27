class StringValue {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public isValueType(value: string): boolean {
        if (this.value === value) {
            return true;
        } else {
            return false;
        }
    }
}
