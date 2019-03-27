import { AbstractValue } from "./AbstractValue";

class StringValue extends AbstractValue {
    private value: string;
    private name: string;

    constructor(value: string, name: string) {
        super();
        this.value = value;
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public isValueType(value: string): boolean {
        if (this.value === value) {
            return true;
        } else {
            return false;
        }
    }
}

export { StringValue };
