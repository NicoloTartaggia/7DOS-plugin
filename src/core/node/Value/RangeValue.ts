import { AbstractValue } from "./AbstractValue";

class RangeValue extends AbstractValue {
    private minRange: number;
    private maxRange: number;
    private name: string;

    constructor(minRange: number, maxRange: number, name: string) {
        super();
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public isValueType(value: string): boolean {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) {
            return false;
        } else if (numericValue < this.minRange || numericValue > this.maxRange) {
            return false;
        } else {
            return true;
        }
    }
}

export { RangeValue };
