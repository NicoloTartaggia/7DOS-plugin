import { InfluxInputFlow } from "../../../../core/net-manager/reader/input-flow/InfluxInputFlow";
import { ConcreteReadClientFactory } from "../../../../core/read-client/ReadClientFactory";
import ReadClient from "../../../../core/read-client/ReadClient";
import { ConcreteWriteClientFactory } from "../../../../core/write-client/write-client";
import { SingleNetWriter } from "../../../../core/net-manager/writer/NetWriter";
import { CalcResult, CalcResultItem, CalcResultAggregate } from "../../../../core/net-manager/result/result";

import {expect} from "chai";

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
    it("Correct query - Result", () => {
        // writing data
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost/", "8086", "prova", ["root", "root"]
        ).then(async function(writeClient){
            const singleWriter: SingleNetWriter = new SingleNetWriter(writeClient);
            let calcArray: Array<CalcResult> = new Array<CalcResult>();
            let itemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
            itemArray.push(new CalcResultItem("field1", 1));
            calcArray.push(new CalcResult("burglary", itemArray));
            let calc: CalcResultAggregate = new CalcResultAggregate(calcArray);
            await singleWriter.write(calc).then(function (){
                expect(calc.createIterator().next().value.getNodeName()).to.equal("burglary");
            })
            .catch(function (e){
                console.log("InfluxInputFlow getResult Correct query ERROR: " + e);
            });
        }).catch(function(e){
            console.log("InfluxInputFlow getResult Correct query ERROR 2: " + e);
        }); 

        const influxInput: InfluxInputFlow = new InfluxInputFlow("prova", "SELECT field1 FROM burglary", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["root", "root"]));
        influxInput.getResult().then(function(result){
            expect(result.toString()).to.not.equal(null);
        }).catch(function(e){
            console.log("InfluxInputFlow getResult Correct query ERROR: " + e)
        });
    });
    it("Incorrect query - Error", () => {
        const influxInput: InfluxInputFlow = new InfluxInputFlow("prova", "SELECT field FROM measurement", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["user", "password"]));
        influxInput.getResult().then(function(){}).catch(function(e){
            expect(e.toString()).to.contain("Error: [7DOS G&B][InfluxReadClient]readField - Query to ");
        });
    });
});
