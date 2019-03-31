import {AbstractValue} from "./Value/AbstractValue";

export interface NodeAdapter {
  getName (): string;

  getStates (): Array<string>;

  getValues (): Array<AbstractValue>;

  findValue (currentValue: string): AbstractValue;
}
