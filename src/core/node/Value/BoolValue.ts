import { AbstractValue } from "./AbstractValue";

class BoolValue extends AbstractValue {
    private value: boolean;
    private name: string;

    constructor(value: boolean, name: string) {
        super();
        this.value = value;
        this.name = name
    }

    public getName() {
        return this.name;
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

export { BoolValue };
