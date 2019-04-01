import {ConcreteNetworkFactory} from "../../core/network/factory/ConcreteNetworkFactory";

import {ConcreteNetworkAdapter} from "../../core/network/adapter/ConcreteNetworkAdapter";

import {expect} from "chai";

describe("ConcreteNetworkFactory - parseNetwork", () => {
  it("Correct network", () => {
    const json = require("./CorrectNetwork.json");
    const jsonString: string = JSON.stringify(json);
    const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString);
    expect(s.getNodeList().length).to.equal(2);
  });
  it("Null check", () => {
    let str: string;
    expect(() => new ConcreteNetworkFactory().parseNetwork(str)).to.throw(Error, "JSON file content is null...");
  });
  it("Empty JSON", () => {
    let str: string = "";
    //new ConcreteNetworkFactory().parseNetwork(str)
    expect(() => new ConcreteNetworkFactory().parseNetwork(str)).to.throw(Error, "Bad Json Content!");
  });
  it("Invalid JSON", () => {
    let json = require("./InvalidNetwork.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "");
  });
  it("Broken JSON", () => {
    const jsonString = '{"nodes": {[)}}';
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "Bad Json Content!");
  });
  it("Incorrect cpt probabilities", () => {
    let json = require("./IncorrectCpt.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error);
  });
  it("MinRange > MaxRange", () => {
    let json = require("./InvertedMinMax.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(TypeError, "maxRange is less then minRange");
  });
  it("Incorrect node value type", () => {
    let json = require("./IncorrectType.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(TypeError, "invalid parameter");
  });
  it("Non existing node parent", () => {
    let json = require("./IncorrectParent.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "Node FakeParent not found in the network!");
  });
  it("Direct circular parenthood", () => {
    let json = require("./DCircularParenthood.json");
    const jsonString = JSON.stringify(json);
    new ConcreteNetworkFactory().parseNetwork(jsonString);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "Circular parenthood");
  });
  it("Indirect circular parenthood", () => {
    let json = require("./ICircularParenthood.json");
    const jsonString = JSON.stringify(json);
    new ConcreteNetworkFactory().parseNetwork(jsonString);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "Circular parenthood");
  });
  it("Two nodes with same name", () => {
    let json = require("./IncorrectName.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString)).to.throw(Error, "The node Example2 already exist in the network!");
  });
});
