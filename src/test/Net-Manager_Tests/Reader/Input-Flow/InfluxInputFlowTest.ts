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
        ).to.throw(Error, "invalid parameter");
    });
    it("Undefined query - Error", () => {
        let query: string;
        expect(()=> 
            new InfluxInputFlow("db", query, 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "invalid parameter");
    });
    it("Undefined database - Error", () => {
        let readClient: ReadClient;
        expect(()=> 
            new InfluxInputFlow("db", "query", readClient)
        ).to.throw(Error, "invalid parameter");
    });
    it("Empty database - Error", () => {
        expect(()=> 
            new InfluxInputFlow("", "query", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "invalid parameter");
    });
    it("Empty query - Error", () => {
        expect(()=> 
            new InfluxInputFlow("db", "", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "9957", ["user", "password"]))
        ).to.throw(Error, "invalid parameter");
    });
});

describe("InfluxInputFlow - getResult", () => {
    it("Correct query - Result", () => {

        // writing data
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost/", "8086", "prova", ["root", "root"]
        ).then(function(writeClient){
            const singleWriter: SingleNetWriter = new SingleNetWriter(writeClient);
            let calcArray: Array<CalcResult> = new Array<CalcResult>();
            let itemArray: Array<CalcResultItem> = new Array<CalcResultItem>();
            itemArray.push(new CalcResultItem("field1", 1));
            calcArray.push(new CalcResult("burglary", itemArray));
            let calc: CalcResultAggregate = new CalcResultAggregate(calcArray);
            singleWriter.write(calc).then(function (){
                expect(calc.createIterator().next().value.getNodeName()).to.equal("burglary");
            })
            .catch(function (e){
                console.log(e);
            });
        }).catch(function(e){
            console.log(e);
        }); 

        const influxInput: InfluxInputFlow = new InfluxInputFlow("prova", "SELECT field1 FROM burglary ORDER BY time DESC", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["root", "root"]));
        influxInput.getResult().then(function(result){
            expect(result.toString()).to.equal("1");
        }).catch(function(e){
            console.log("errore");
            console.log(e);
            expect(e.toString()).to.contain("Error: Query");
        });
    });
    it("Incorrect query - Error", () => {
        const influxInput: InfluxInputFlow = new InfluxInputFlow("prova", "SELECT field FROM measurement", 
            new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost", "8086", ["user", "password"]));
        influxInput.getResult().then(function(){}).catch(function(e){
            expect(e.toString()).to.contain("Error: Query");
        });
    });
});
