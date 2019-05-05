/**
 * @File NodeAdapter.ts
 * @Type TypeScript file
 * @Desc Contains the NodeAdapter iterface declaration.
 */
import {AbstractValue} from "../value/value";

export interface NodeAdapter {
  getName (): string;

  getStates (): Array<string>;

  getValues (): Array<AbstractValue>;

  findValue (currentValue: string): AbstractValue;
}
