export class FluxResult {
  private nodeName: string;
  private currentValue: string;

  public constructor(nodeName: string, currentValue: string) {

  }

  public getNodeName(): string {
    return this.nodeName;
  }
  public getCurrentValue(): string {
    return this.currentValue;
  }

}
