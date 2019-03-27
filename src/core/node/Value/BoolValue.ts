class BoolValue {
    private value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    public isValueType(value: string): boolean {
        const boolValue = value.toLowerCase();
        if (boolValue !== "true" && boolValue !== "false") {
            return false;
        } else if (boolValue === "true" && this.value) {
            return true;
        } else if (boolValue === "false" && !this.value) {
            return true;
        } else {
            return false;
        }
    }
}