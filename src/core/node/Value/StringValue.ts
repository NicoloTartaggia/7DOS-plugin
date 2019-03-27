import { AbstractValue } from "./AbstractValue";


class StringValue extends AbstractValue {
    private value: string;

    constructor(value: string) {
        super();
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

export { StringValue };