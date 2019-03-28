import { AbstractValue } from "./AbstractValue";

class BoolValue extends AbstractValue {
    private value: boolean;
    private name: string;

    constructor(value: boolean, name: string) {
        super();
        if (value == null || name == null) {
            throw new TypeError("invalid parameter");
        }
        this.value = value;
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public isValueType(value: string): boolean {
        if (value == null) {
            throw new TypeError("invalid parameter");
        }
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
