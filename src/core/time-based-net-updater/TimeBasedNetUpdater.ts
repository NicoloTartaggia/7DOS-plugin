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
        if(!this.isCalcRunning){
            this.isCalcRunning=true;
            this.runUpdate(this);
        }
    }
    public stop():void{
        this.isCalcRunning=false;
    }

    public setUpdateFrequency(frequency:number){
        this.updateFrequency=frequency;
    }

    public singleUpdate(){
        this.netManager.updateNet();
    }
    private runUpdate(that:TimeBasedNetUpdater):void {
        if(that.isCalcRunning){
            that.netManager.updateNet();
            setTimeout(that.runUpdate,that.updateFrequency*1000,that);
        }
    }
}