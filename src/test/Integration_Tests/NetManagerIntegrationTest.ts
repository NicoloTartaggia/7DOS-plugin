import { NetworkAdapter, NodeAdapter, ConcreteNodeAdapter } from "../../core/network/adapter/adapter";
import { ConcreteNetworkFactory } from "../../core/network/factory/factory";
import { InputResultAggregate, InputResult } from "../../core/net-manager/result/input-result/input-result";
import { CalcResultAggregate } from "../../core/net-manager/result/calculation-result/calculation-result";
import { NetReader } from "../../core/net-manager/reader/reader";
import { AbstractValue, StringValue } from "../../core/network/value/value";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";
import { ConcreteWriteClientFactory } from "../../core/write-client/write-client";
import { SingleNetWriter } from "../../core/net-manager/writer/NetWriter";

import jsbayes = require("jsbayes");
import { expect } from "chai";

const schemaPath: string = "../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/TestNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(correctJsonString, jsonSchemaString);

network.observeNode("n1", "value1");
const arrayValue: Array<AbstractValue> = new Array<AbstractValue>();
arrayValue.push(new StringValue("0", "value1"));
arrayValue.push(new StringValue("1", "value2"));
arrayValue.push(new StringValue("2", "value3"));

var g = jsbayes.newGraph();
var n1 = g.addNode('n1', ['0', '1', '2']);
var n2 = g.addNode('n2', ['0', '1', '2']);
n2.addParent(n1);

n1.cpt = [0.1, 0.8, 0.1]; //note 3 float value
n2.cpt = [ 
 [0.2, 0.2, 0.6], //[ P(n2=0|n1=0), P(n2=1|n1=0), P(n2=2|n1=0) ]
 [0.6, 0.2, 0.2], //[ P(n2=0|n1=1), P(n2=1|n1=1), P(n2=2|n1=1) ]
 [0.2, 0.6, 0.2]  //[ P(n2=0|n1=2), P(n2=1|n1=2), P(n2=2|n1=2) ]
];
g.observe("n1", "0");
g.sample(10000);

const nodeAdapter: NodeAdapter = new ConcreteNodeAdapter(n1, arrayValue);
const arrayResult: Array<InputResult> = new Array<InputResult>();
arrayResult.push(new InputResult(nodeAdapter, "0"));

describe("NetReader NetWriter NetUpdater (NetManager:updateNet)", () => {
    it("Undefined network_ref - Error", async () => {
        const reader: NetReader = new NetReader(network);
        const updater: NetUpdater = new NetUpdater(network);
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost", "8086", "prova", ["root", "root"]
        ).then(async function(writeClient){
            const writer: SingleNetWriter = new SingleNetWriter(writeClient);
            let error: boolean = false;
            // NetManager:updateNet's code
            const read_res: InputResultAggregate = await reader.read()
            .catch((err) => {
                error=true;
                throw new Error("Error while reading from input datasource. For more details, see error: " + err);
            });
            const update_res: CalcResultAggregate = updater.updateNet(read_res);
            await writer.write(update_res)
                .catch((err) => {
                    error=true;
                    throw new Error("Error while writing to output datasource. For more details, see error: " + err);
                }); 
            expect(error).to.equal(false);      
        }).catch(function(e){
            console.log("SingleNetWriter constructor ERROR: " + e);
        });

    });
});

