import { NetworkAdapter } from "../../core/network/adapter/adapter";
import { JsonNetParser } from "../../core/network/factory/factory";
import { CalcResultAggregate } from "../../core/net-manager/result/calculation-result/calculation-result";
import { NetReader } from "../../core/net-manager/reader/reader";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";

import { expect } from "chai";
import { InputResultAggregate } from "../../core/net-manager/result/result";
import { AbstractValue, StringValue } from "../../core/network/value/value";
import jsbayes = require("jsbayes");

const schemaPath: string = "../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/TestNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);

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

describe("NetReader NetUpdater Integration Test", () => {
    it("Defined parameters - No error", () => {
        let errorFlag: boolean = false;
        let error: any;
        const reader: NetReader = new NetReader(network);
        const updater: NetUpdater = new NetUpdater(network);
        reader.read().then(function(result){
            const read_res: InputResultAggregate = result;
            const update_res: CalcResultAggregate = updater.updateNet(read_res);
            expect(update_res.createIterator().next().value.getNodeName()).to.equal("n1");
        })
        .catch((err) => {
            errorFlag = true;
            error = err;
        })
        if(errorFlag) {
            console.log("NR-NU Errore: " + error);
        }
        return expect(errorFlag).to.equal(false);    
    });
});
