import { InfluxInputFlow } from "../../../../core/net-manager/reader/input-flow/InfluxInputFlow";
import { ConcreteReadClientFactory } from "../../../../core/read-client/ReadClientFactory";
import { ReadClient } from "../../../../core/read-client/read-client";

import {expect} from "chai";

before("Db init", async () => {
    const Influx = require('influx');
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
      if (!names.includes('testDB')) {
        return influx.createDatabase('testDB');
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

describe("InfluxInputFlow - constructor", () => {
    it("Undefined database - Error", () => {
        let db: string;
        expect(()=> 
            new InfluxInputFlow(db, "query", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "[7DOS G&B][InfluxInputFlow]constructor - invalid database parameter");
    });
    it("Undefined query - Error", () => {
        let query: string;
        expect(()=> 
            new InfluxInputFlow("db", query, 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "[7DOS G&B][InfluxInputFlow]constructor - invalid query parameter");
    });
    it("Undefined client - Error", () => {
        let readClient: ReadClient;
        expect(()=> 
            new InfluxInputFlow("db", "query", readClient)
        ).to.throw(Error, "[7DOS G&B][InfluxInputFlow]constructor - invalid client parameter");
    });
    it("Empty database - Error", () => {
        expect(()=> 
            new InfluxInputFlow("", "query", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "[7DOS G&B][InfluxInputFlow]constructor - invalid database parameter");
    });
    it("Empty query - Error", () => {
        expect(()=> 
            new InfluxInputFlow("db", "", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "[7DOS G&B][InfluxInputFlow]constructor - invalid query parameter");
    });
    it("Correct inputs - InfluxInputFlow", () => {
        expect(()=> 
            new InfluxInputFlow("db", "query", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.not.throw(Error);
    });
});

describe("InfluxInputFlow - getResult", () => {
    it("Correct query - Result", async () => {
        // writing data
        let res: any;
        let errorFlag: boolean = false;
        let error: boolean;
        const influxInput: InfluxInputFlow = new InfluxInputFlow("testDB", "SELECT Percent_DPC_Time FROM win_cpu", 
        new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["root", "root"]));
        await influxInput.getResult().then(function(result){
            res = result;
        }).catch((e) => {
            errorFlag = true;
            error = e;
        });
        if(errorFlag) {
            console.log(error);
        }
        expect(res.toString()).to.not.equal(null);
    });
    it("Incorrect query - Error", async () => {
        let error: any;
        const influxInput: InfluxInputFlow = new InfluxInputFlow("testDB", "SELECT field FROM measurement", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["user", "password"]));
        await influxInput.getResult()
        .catch(function(e){
            error = e;
        });
        expect(error.toString()).to.contain("Error: [7DOS G&B][InfluxReadClient]readField - Query to");
    });
});
