import {SingleNetWriter} from "../../../core/net-manager/writer/NetWriter";
import { WriteClient } from "../../../core/write-client/WriteClient";
import { CalcResultAggregate } from "../../../core/net-manager/result/calculation-result/CalcResultAggregate";
import InfluxWriteClient from "../../../core/write-client/InfluxWriteClient";
import { InfluxDB } from "influx";

import {expect} from "chai";

describe("SingleNetWriter - constructor", () => {
    it("Undefined client - Error", () => {
        let client: WriteClient;
        expect(()=> new SingleNetWriter(client)).to.throw(Error, "invalid parameter");
    });
});

describe("SingleNetWriter - write", () => {
    it("Undefined calcData - Error", () => {
        const idb: InfluxDB = new InfluxDB();
        const client: WriteClient = new InfluxWriteClient("", "", idb);
        const singleWriter: SingleNetWriter = new SingleNetWriter(client);
        let calc: CalcResultAggregate;
        singleWriter.write(calc).then(function (){})
                                .catch(function (e){
                                    expect(<Error> e.toString()).to.equal("Error: invalid parameter");
                                });
    });
});
