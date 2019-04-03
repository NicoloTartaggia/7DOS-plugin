import {ConcreteNetworkFactory} from "../../../core/network/factory/ConcreteNetworkFactory";

import {ConcreteNetworkAdapter} from "../../../core/network/adapter/ConcreteNetworkAdapter";

import {expect} from "chai";

describe("ConcreteNetworkFactory - parseNetwork", () => {
  const jsonSchema = require("../../../core/network/factory/network_structure.schema.json");
  const jsonSchemaString: string = JSON.stringify(jsonSchema);
  it("Correct network - Ok", () => {
    const json = require("../CorrectNetwork.json");
    const jsonString: string = JSON.stringify(json);
    const s: ConcreteNetworkAdapter = new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString);
    expect(s.getNodeList().length).to.equal(2);
  });
  it("Null - Error", () => {
    let str: string;
    expect(() => new ConcreteNetworkFactory().parseNetwork(str, jsonSchemaString)).to.throw(Error, "JSON file content is null...");
  });
  it("Empty JSON - Error", () => {
    let str: string = "";
    expect(() => new ConcreteNetworkFactory().parseNetwork(str, jsonSchemaString)).to.throw(Error, "Bad Json Content!");
  });
  it("Invalid JSON - Error", () => {
    let json = require("../InvalidNetwork.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "");
  });
  it("Broken JSON - Error", () => {
    const jsonString = '{"nodes": {[)}}';
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Bad Json Content!");
  });
  it("MinRange > MaxRange - Error", () => {
    let json = require("../InvertedMinMax.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "maxRange is less then minRange");
  });
  it("Incorrect node value type - Error", () => {
    let json = require("../IncorrectType.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "invalid parameter");
  });
  it("Non existing node parent - Error", () => {
    let json = require("../IncorrectParent.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Node FakeParent not found in the network!");
  });
  it("Direct circular parenthood - Error", () => {
    let json = require("../DCircularParenthood.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Circular parenthood");
  });
  it("Indirect circular parenthood - Error", () => {
    let json = require("../ICircularParenthood.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Circular parenthood");
  });
  it("Two nodes with same name - Error", () => {
    let json = require("../IncorrectName.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "The node Example2 already exist in the network!");
  });
  it("Incorrect cpt probabilities - Error", () => {
    let json = require("../IncorrectCpt.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error);
  });
  it("Empty Cpt - Error", () => {
    let json = require("../EmptyCpt.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Empty cpt");
  });
  it("Incorrect Cpt Rows - Error", () => {
    let json = require("../IncorrectCptRows.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Incorrect cpt's number of rows");
  });
  it("Incorrect Cpt Columns - Error", () => {
    let json = require("../IncorrectCptColumns.json");
    const jsonString = JSON.stringify(json);
    expect(() => new ConcreteNetworkFactory().parseNetwork(jsonString, jsonSchemaString)).to.throw(Error, "Incorrect cpt's number of columns");
  });
});
