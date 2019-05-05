import { NetworkAdapter} from "../../core/network/adapter/adapter";
import { JsonNetParser } from "../../core/network/factory/factory";
import { CalcResultAggregate } from "../../core/net-manager/result/calculation-result/calculation-result";
import { NetReader, DataSource } from "../../core/net-manager/reader/reader";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";
import { ConcreteWriteClientFactory } from "../../core/write-client/write-client";
import { SingleNetWriter } from "../../core/net-manager/writer/NetWriter";

import { expect } from "chai";

const schemaPath: string = "../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/CorrectNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);

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

describe("NetReader NetWriter NetUpdater (NetManager:updateNet)", () => {
    it("Defined parameters - No error", async () => {
        const reader: NetReader = new NetReader(network);
        const updater: NetUpdater = new NetUpdater(network);
        let errorFlag: boolean = false;
        let error: any;
        await new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost", "8086", "testDB", ["root", "root"]
        ).then(async function(writeClient){
            const writer: SingleNetWriter = new SingleNetWriter(writeClient);
            reader.connectNode("Example2", new DataSource("http://localhost:8086/", "testDB"), "SELECT Percent_DPC_Time FROM win_cpu");
            await reader.read().then(async function(result){
                const update_res: CalcResultAggregate = updater.updateNet(result);
                await writer.write(update_res).catch((err) => {
                    errorFlag = true;
                    error = err;
                })
            })
            .catch((err) => {
                errorFlag = true;
                error = err;
            });  
        }).catch((err) =>{
            errorFlag = true;
            error = err;
        });
        if(errorFlag) {
            console.log(error);
        }
        expect(errorFlag).to.equal(false);    
    });
});
