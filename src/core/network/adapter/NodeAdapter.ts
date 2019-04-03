import {AbstractValue} from "../value/value-module";

export interface NodeAdapter {
  getName (): string;

  getStates (): Array<string>;

  getValues (): Array<AbstractValue>;

  findValue (currentValue: string): AbstractValue;
}
