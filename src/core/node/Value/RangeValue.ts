import { AbstractValue } from "./AbstractValue";

class RangeValue extends AbstractValue {
    private minRange: number;
    private maxRange: number;
    private name: string;

    constructor(minRange: number, maxRange: number, name: string) {
        super();
        if (minRange == null || maxRange == null || name == null) {
            throw new TypeError("invalid parameter");
        } else if (minRange > maxRange) {
            throw new TypeError("maxRange is less then minRange");
        }
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public isValueType(value: string): boolean {
        if (value == null) {
            throw new TypeError("invalid parameter");
        }
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
