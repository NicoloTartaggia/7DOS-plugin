import {AbstractValue} from "./values/AbstractValue";

export interface NodeAdapter {
  getName (): string;

  getStates (): Array<string>;

  getValues (): Array<AbstractValue>;

  findValue (currentValue: string): AbstractValue;
}
