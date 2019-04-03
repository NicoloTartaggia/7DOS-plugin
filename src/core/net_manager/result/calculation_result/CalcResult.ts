import {CalcResultItem} from "./CalcResultItem";

export class CalcResult {
  private readonly nodeName: string;
  private readonly items: Array<CalcResultItem>;

  public constructor(nodeName: string, items: Array<CalcResultItem>) {
    if(nodeName==null||items==null){
      throw new Error("invalid parameter");
    }
    for(let item of items){
      if(item===null){
        throw new Error("invalid parameter");
      }
    }
    this.nodeName = nodeName;
    this.items = items;
  }
  public getNodeName(): string {
    return this.nodeName;
  }
  public getValueProbs(): Array<CalcResultItem> {
    let copyProbs:Array<CalcResultItem>=new Array<CalcResultItem>();
    for(let item of this.items){
      copyProbs.push(item);
    }
    return copyProbs;
  }
}
