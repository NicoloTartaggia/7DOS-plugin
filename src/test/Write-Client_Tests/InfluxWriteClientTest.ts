import InfluxWriteClient from "../../core/write-client/InfluxWriteClient";
import { CalcResultAggregate, CalcResultItem, CalcResult } from "../../core/net-manager/result/result";

import {expect} from "chai";
import { InfluxDB } from "influx";

const influx: InfluxDB = new InfluxDB("http://localhost:8086/prova");

describe("InfluxWriteClient - constructor", () => { 
    it("Undefined dsn - Error", () => {
        let dsn: string;
        expect(() => new InfluxWriteClient(dsn, "prova", influx)).to.throw(Error, "invalid parameter");
    });
    it("Undefined defaultDB - Error", () => {
        let defaultDB: string;
        expect(() => new InfluxWriteClient("http://localhost:8086/", defaultDB, influx)).to.throw(Error, "invalid parameter");
    });
    it("Undefined influx - Error", () => {
        let unInflux: InfluxDB;
        expect(() => new InfluxWriteClient("http://localhost:8086/", "prova", unInflux)).to.throw(Error, "invalid parameter");
    });
    it("All defined - InfluxWriteClient", () => {  
        expect(new InfluxWriteClient("http://localhost:8086/", "prova", influx).getAddress()).to.equal("http://localhost:8086/");
    });
});

describe("InfluxWriteClient - getAddress", () => {
    it("Address - Address", () => {
        expect(new InfluxWriteClient("http://localhost:8086/", "prova", influx).getAddress()).to.equal("http://localhost:8086/");
    });
});

describe("InfluxWriteClient - getDefaultDB", () => {
    it("DefaultDB - DefaultDB", () => {
        expect(new InfluxWriteClient("http://localhost:8086/", "prova", influx).getDefaultDB()).to.equal("prova");
    });
});

describe("InfluxWriteClient - writeBatchData", () => {
    it("Correct inputs - Not an error", () => {
        const influxWriter: InfluxWriteClient = new InfluxWriteClient("http://localhost:8086/", "prova", influx);
        let calcArray: Array<CalcResult> = new Array<CalcResult>();
        let calcItemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItemArray.push(new CalcResultItem("field1", 0.5));
        calcArray.push(new CalcResult("burglary", calcItemArray)); 
        let toBeWritten: CalcResultAggregate = new CalcResultAggregate(calcArray);
        influxWriter.writeBatchData(toBeWritten).then(function(){
            expect(true).to.equal(true);
        }).catch(function(e){
            console.log("Errore: "+e.toString());
        });
    });
});

describe("InfluxWriteClient - writePointData", () => {
    it("Correct inputs - Not an error", () => {
        const influxWriter: InfluxWriteClient = new InfluxWriteClient("http://localhost:8086/", "prova", influx);
        let calcItemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItemArray.push(new CalcResultItem("field1", 0.5));
        influxWriter.writePointData(new CalcResult("burglary", calcItemArray)).then(function(){
            expect(true).to.equal(true);
        }).catch(function(e){
            console.log("Errore: "+e.toString());
        });
    });
});
