import {NodeAdapter} from "core/network/adapter/NodeAdapter";

export class InputResult {
  private node: NodeAdapter;
  private currentValue: string;

  public constructor (nodeName: NodeAdapter, currentValue: string) {
    if (nodeName == null || currentValue == null || currentValue.length === 0) {
      throw new Error("invalid parameter");
    }
    this.currentValue = currentValue;
    this.node = nodeName;
  }

  public getNode (): NodeAdapter {
    return this.node;
  }

  public getCurrentValue (): string {
    return this.currentValue;
  }

}
