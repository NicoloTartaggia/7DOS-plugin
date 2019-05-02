/**
 * @File InputResult.ts
 * @Type TypeScript file
 * @Desc Contains the InputResult class.
 */
import {NodeAdapter} from "../../../network/adapter/adapter";
/**
 * @class InputResult
 * @desc Contains the result of a reading of the value of a node.
 */
export class InputResult {
  /**
   * @field Reference to the node.
   */
  private node: NodeAdapter;
  /**
   * @field Current state of the node.
   */
  private currentValue: string;
/**
 * @param node Reference to the node.
 * @param currentValue Current state of the node.
 */
  public constructor (node: NodeAdapter, currentValue: string) {
    if (node == null) {
      throw new Error("invalid node parameter");
    }
    if (currentValue == null || currentValue.length === 0) {
      throw new Error("invalid currentValue parameter");
    }
    this.currentValue = currentValue;
    this.node = node;
  }
/**
 * @returns The node reference.
 */
  public getNode (): NodeAdapter {
    return this.node;
  }
  /**
   * @returns The node's current state.
   */
  public getCurrentValue (): string {
    return this.currentValue;
  }

}
