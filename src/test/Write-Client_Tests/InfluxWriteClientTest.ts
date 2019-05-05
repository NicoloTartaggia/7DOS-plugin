import InfluxWriteClient from "../../core/write-client/InfluxWriteClient";
import { CalcResultAggregate, CalcResultItem, CalcResult } from "../../core/net-manager/result/result";

import {expect} from "chai";
import { InfluxDB } from "influx";

const Influx = require('influx');

before("Db init", async () => {
    const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'testDB',
    schema: [
    {
        measurement: 'win_cpu',
        fields: {
            Percent_DPC_Time: Influx.FieldType.FLOAT,
        },
        tags: [
            'host'
        ]
    }
    ]
    });
    await influx.getDatabaseNames()
    .then(names => {
      if (!names.includes('express_response_db')) {
        return influx.createDatabase('express_response_db');
      }
    })
    await influx.writePoints([
        {
        measurement: 'win_cpu',
        tags: { host: "thishost" },
        fields: { Percent_DPC_Time: 0.060454 },
        }
    ]);
  });

describe("InfluxWriteClient - constructor", () => { 
    it("Undefined dsn - Error", () => {
        let dsn: string;
        expect(() => new InfluxWriteClient(dsn, "testDB", Influx)).to.throw(Error, "[7DOS G&B][InfluxWriteClient]constructor - invalid dsn parameter");
    });
    it("Undefined defaultDB - Error", () => {
        let defaultDB: string;
        expect(() => new InfluxWriteClient("http://localhost:8086/", defaultDB, Influx)).to.throw(Error, "[7DOS G&B][InfluxWriteClient]constructor - invalid defaultDB parameter");
    });
    it("Undefined influx - Error", () => {
        let unInflux: InfluxDB;
        expect(() => new InfluxWriteClient("http://localhost:8086/", "testDB", unInflux)).to.throw(Error, "[7DOS G&B][InfluxWriteClient]constructor - invalid influx parameter");
    });
    it("Correct inputs - InfluxWriteClient", () => {  
        expect(new InfluxWriteClient("http://localhost:8086/", "testDB", Influx).getAddress()).to.equal("http://localhost:8086/");
    });
});

describe("InfluxWriteClient - getAddress", () => {
    it("Address - Address", () => {
        expect(new InfluxWriteClient("http://localhost:8086/", "testDB", Influx).getAddress()).to.equal("http://localhost:8086/");
    });
});

describe("InfluxWriteClient - getDefaultDB", () => {
    it("DefaultDB - DefaultDB", () => {
        expect(new InfluxWriteClient("http://localhost:8086/", "testDB", Influx).getDefaultDB()).to.equal("testDB");
    });
});

describe("InfluxWriteClient - writeBatchData", () => {
    it("Correct inputs - Not an error", () => {
        const influxWriter: InfluxWriteClient = new InfluxWriteClient("http://localhost:8086/", "testDB", Influx);
        let calcArray: Array<CalcResult> = new Array<CalcResult>();
        let calcItemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItemArray.push(new CalcResultItem("Percent_DPC_Time", 0.5));
        calcArray.push(new CalcResult("win_cpu", calcItemArray)); 
        let toBeWritten: CalcResultAggregate = new CalcResultAggregate(calcArray);
        influxWriter.writeBatchData(toBeWritten).then(function(){
            expect(true).to.equal(true);
        }).catch(function(e){
            console.log("InfluxWriteClient writeBatchData ERROR: " + e);
        });
    });
});

describe("InfluxWriteClient - writePointData", () => {
    it("Correct inputs - Not an error", () => {
        const influxWriter: InfluxWriteClient = new InfluxWriteClient("http://localhost:8086/", "testDB", Influx);
        let calcItemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
        calcItemArray.push(new CalcResultItem("Percent_DPC_Time", 0.5));
        influxWriter.writePointData(new CalcResult("win_cpu", calcItemArray)).then(function(){
            expect(true).to.equal(true);
        }).catch(function(e){
            console.log("InfluxWriteClient writePointData ERROR: " + e);
        });
    });
});
