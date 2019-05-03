import {NetManager} from "../net-manager/NetManager";

export class TimeBasedNetUpdater {
  private updateFrequency: number;
  private netManager: NetManager;
  private isCalcRunning: boolean;

  public constructor(netManager: NetManager) {
    if (netManager == null) {
      throw new Error("[7DOS G&B][TimeBasedNetUpdater]constructor - invalid netManager parameter");
    }
    this.netManager = netManager;
    this.updateFrequency = 5;
    this.isCalcRunning = false;
  }

  public start(): void {
    if (!this.isCalcRunning) {
      this.isCalcRunning = true;
      this.runUpdate(this);
    }
  }

  public stop(): void {
    console.log(this.isCalcRunning);
    this.isCalcRunning = false;
  }

  public setUpdateFrequency(frequency: number): void {
    this.updateFrequency = frequency;
  }

  public singleUpdate(): void {
    this.netManager.updateNet();
  }

  private runUpdate(that: TimeBasedNetUpdater): void {
    if (that.isCalcRunning) {
      that.netManager.updateNet();
      setTimeout(that.runUpdate, that.updateFrequency * 1000, that);
    }
  }
}
