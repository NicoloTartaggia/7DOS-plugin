import {SingleNetWriter} from "../../../core/net-manager/writer/NetWriter";
import { WriteClient } from "../../../core/write-client/WriteClient";
import { CalcResultAggregate } from "../../../core/net-manager/result/calculation-result/CalcResultAggregate";
import InfluxWriteClient from "../../../core/write-client/InfluxWriteClient";
import { CalcResult, CalcResultItem } from "../../../core/net-manager/result/calculation-result/calculation-result";
import { ConcreteWriteClientFactory } from "../../../core/write-client/write-client";

import { InfluxDB } from "influx";
import {expect} from "chai";

describe("SingleNetWriter - constructor", () => {
    it("Undefined client - Error", () => {
        let client: WriteClient;
        expect(()=> new SingleNetWriter(client)).to.throw(Error, "[7DOS G&B][SingleNetWriter]constructor - invalid client parameter");
    });
    it("Defined client - New SingleNetWriter", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost", "8086", "prova", ["root", "root"]
        ).then(function(writeClient){
            const singleWriter: SingleNetWriter = new SingleNetWriter(writeClient);
            expect(singleWriter).to.not.equal(null);
        }).catch(function(e){
            console.log("SingleNetWriter constructor ERROR: " + e);
        });
    });
});

describe("SingleNetWriter - write", () => {
    it("Undefined calcData - Error", () => {
        const idb: InfluxDB = new InfluxDB("http://localhost:8086/prova");
        const client: WriteClient = new InfluxWriteClient("http://localhost", "prova", idb);
        const singleWriter: SingleNetWriter = new SingleNetWriter(client);
        let calc: CalcResultAggregate;
        singleWriter.write(calc).then(function (){})
                                .catch(function (e){
                                    expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][SingleNetWriter]write - invalid calcData parameter");
                                });
    });
    it("Correct calcData - Something", () => {
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
                console.log("SingleNetWriter write ERROR: " + e);
            });
        }).catch(function(e){
            console.log("SingleNetWriter write ERROR 2: " + e);
        }); 
    });
});
