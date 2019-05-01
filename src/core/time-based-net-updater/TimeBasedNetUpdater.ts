import {NetManager} from "../net-manager/NetManager"
export class TimeBasedNetUpdater{
    private updateFrequency:number;
    private netManager:NetManager;
    private isCalcRunning:boolean;
    
    public constructor(netManager:NetManager){
        this.netManager=netManager;
        this.updateFrequency=5;
        this.isCalcRunning=false;
    }
    public start():void{    
        this.isCalcRunning=true;
        this.runUpdate();
    }
    public stop():void{
        this.isCalcRunning=false;
    }

    public setUpdateFrequency(frequency:number){
        this.updateFrequency=frequency;
    }
    private runUpdate():void {
        this.netManager.updateNet();
        if(this.isCalcRunning){
            setTimeout(function(){this.runUpdate()},this.updateFrequency*1000);
        }
    }
}