import { NetUpdater } from "../../../../core/net_manager/updater/NetUpdater";

import {expect} from "chai";
import { NetworkAdapter } from "../../../../core/network/adapter/NetworkAdapter";
import { ConcreteNetworkFactory } from "../../../../core/network/factory/ConcreteNetworkFactory";
import { InputResult } from "../../../../core/net_manager/result/input_result/InputResult";
import { InputResultAggregate } from "../../../../core/net_manager/result/input_result/InputResultAggregate";
import { AbstractValue } from "../../../../core/network/value/AbstractValue";
import { StringValue } from "../../../../core/network/value/StringValue";
import { NodeAdapter } from "../../../../core/network/adapter/NodeAdapter";
import { ConcreteNodeAdapter } from "../../../../core/network/adapter/ConcreteNodeAdapter";

import jsbayes = require("jsbayes");
import { CalcResult } from "core/net_manager/result/calculation_result/CalcResult";

describe("NetUpdater - constructor", () => {
  it("Undefined network - Error", () => {
    let network: NetworkAdapter;
    expect(() => new NetUpdater(network)).to.throw(Error, "invalid parameter");
  });
});

describe("NetUpdater - updateNet", () => {
  const jsonSchema = require("../../../../core/network/factory/network_structure.schema.json");
  const jsonSchemaString: string = JSON.stringify(jsonSchema);
  it("Correct InputResultAggregate - Correct probValues", () => {
    const json = require("../../TestNetwork.json");
    const jsonString: string = JSON.stringify(json);

    const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
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
    const results: InputResultAggregate =  new InputResultAggregate(arrayResult);
    const networkUpdater: NetUpdater = new NetUpdater(network);
    let it: IterableIterator<CalcResult> = networkUpdater.updateNet(results).createIterator();
    let currIt=it.next();
    let probs: Array<number> = new Array<number>();
    while(!currIt.done) {
      for (let prob of currIt.value.getValueProbs()) {
        probs.push(prob.getProbValue());
      }
      currIt=it.next();
    }
    expect(probs[3]).to.be.at.least(0.18);
    expect(probs[3]).to.be.at.most(0.22);
    expect(probs[4]).to.be.at.least(0.18);
    expect(probs[4]).to.be.at.most(0.22);
    expect(probs[5]).to.be.at.least(0.58);
    expect(probs[5]).to.be.at.most(0.62);
  });
  it("Undefined InputResultAggregate - Error", () => {
    const json = require("../../TestNetwork.json");
    const jsonString: string = JSON.stringify(json);

    const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
    let results: InputResultAggregate;
    const networkUpdater: NetUpdater = new NetUpdater(network);
    expect(()=> networkUpdater.updateNet(results)).to.throw(Error, "invalid parameter");
  });
  it("Empty InputResultAggregate - Error", () => {
    const json = require("../../TestNetwork.json");
    const jsonString: string = JSON.stringify(json);

    const network: NetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
    const arrayResult: Array<InputResult> = new Array<InputResult>();
    let results: InputResultAggregate = new InputResultAggregate(arrayResult);
    const networkUpdater: NetUpdater = new NetUpdater(network);
    expect(()=> networkUpdater.updateNet(results)).to.throw(Error, "invalid parameter");
  });
});

