import {InputFlux} from "./InputFlux";

export  class InfluxInputFlux implements InputFlux {
    private query: string;

    public getResult(): string {
        this.query.toString();
        return "test";
    }
}
