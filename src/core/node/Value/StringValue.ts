import { AbstractValue } from "./AbstractValue";

class StringValue extends AbstractValue {
    private value: string;

    constructor(value: string, name: string) { 
        if (value == null || name == null) {
            throw new TypeError("invalid parameter");
        }
        super(name);
        this.value = value;
    }

    public isValueType(value: string): boolean {
        if (value == null) {
            throw new TypeError("invalid parameter");
        }
        if (this.value === value) {
            return true;
        } else {
            return false;
        }
    }
}

export { StringValue };
