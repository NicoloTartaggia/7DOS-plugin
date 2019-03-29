import {ConcreteNetworkFactory} from "../../core/network/Factory/ConcreteNetworkFactory";

import {ConcreteNetworkAdapter} from "../../core/network/Adapter/ConcreteNetworkAdapter";

import {expect} from "chai";

describe("ConcreteNetworkFactory", () => {
  it("Simple ConcreteNetworkFactory build test", () => {
    const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork('{"nodes":[{"name":"Example","values":[{"name":"Example of string value","type":"string","value":"Value1?"},{"name":"Another example of string value","type":"string","value":"Value2?"}],"parents":["Example2"],"cpt":[[0.2,0.8],[0.8,0.2]]},{"name":"Example2","values":[{"name":"False","type":"boolean","value":false},{"name":"True","type":"boolean","value":true}],"parents":[],"cpt":[[0.8,0.2]]},{"name":"Example3","values":[{"name":"Low Range","type":"range","rangeMin":0,"rangeMax":10},{"name":"Normal Range","type":"range","rangeMin":11,"rangeMax":80},{"name":"Alert Range","type":"range","rangeMin":81,"rangeMax":100}],"parents":[],"cpt":[[0.81,0.2]]}]}');
    expect(s.getNodeList().length).to.equal(3);
  });
});
