import {JsonNetParser} from "../../../core/network/factory/JsonNetParser";

import {ConcreteNetworkAdapter} from "../../../core/network/adapter/ConcreteNetworkAdapter";

import {expect} from "chai";

const schemaPath: string = "../../../../example_network/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctJsonString: string = JSON.stringify(require("../../Util_JSON/CorrectNetwork.json"));
const invalidJsonString: string = JSON.stringify(require("../../Util_JSON/InvalidNetwork.json"));
const invertedMinMaxJsonString: string = JSON.stringify(require("../../Util_JSON/InvertedMinMax.json"));
const incorrectTypeJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectType.json"));
const incorrectParentJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectParent.json"));
const DCircularParenthoodJsonString: string = JSON.stringify(require("../../Util_JSON/DCircularParenthood.json"));
const ICircularParenthoodJsonString: string = JSON.stringify(require("../../Util_JSON/ICircularParenthood.json"));
const IncorrectNameJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectName.json"));
const IncorrectCptJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectCpt.json"));
const EmptyCptJsonString: string = JSON.stringify(require("../../Util_JSON/EmptyCpt.json"));
const IncorrectCptRowsJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectCptRows.json"));
const IncorrectCptColumnsJsonString: string = JSON.stringify(require("../../Util_JSON/IncorrectCptColumns.json"));

describe("JsonNetParser - createNet", () => {

  it("Correct network - ConcreteNetworkAdapter", () => {
    const s: ConcreteNetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);
    expect(s.getNodeList().length).to.equal(2);
  });
  it("Null - Error", () => {
    let str: string;
    expect(() => new JsonNetParser().createNet(str, jsonSchemaString)).to.throw(Error, "JSON file content is null...");
  });
  it("Empty JSON - Error", () => {
    let str: string = "";
    expect(() => new JsonNetParser().createNet(str, jsonSchemaString)).to.throw(Error, "Bad Json Content!");
  });
  it("Invalid JSON - Error", () => {
    expect(() => new JsonNetParser().createNet(invalidJsonString, jsonSchemaString)).to.throw(Error, "");
  });
  it("Broken JSON - Error", () => {
    const jsonString = '{"nodes": {[)}}';
    expect(() => new JsonNetParser().createNet(jsonString, jsonSchemaString)).to.throw(Error, "Bad Json Content!");
  });
  it("MinRange > MaxRange - Error", () => {
    expect(() => new JsonNetParser().createNet(invertedMinMaxJsonString, jsonSchemaString)).to.throw(Error, "maxRange is less then minRange");
  });
  it("Incorrect node value type - Error", () => {
    expect(() => new JsonNetParser().createNet(incorrectTypeJsonString, jsonSchemaString)).to.throw(Error, "invalid value parameter");
  });
  it("Non existing node parent - Error", () => {
    expect(() => new JsonNetParser().createNet(incorrectParentJsonString, jsonSchemaString)).to.throw(Error, "Node FakeParent not found in the network!");
  });
  it("Direct circular parenthood - Error", () => {
    expect(() => new JsonNetParser().createNet(DCircularParenthoodJsonString, jsonSchemaString)).to.throw(Error, "Circular parenthood");
  });
  it("Indirect circular parenthood - Error", () => {
    expect(() => new JsonNetParser().createNet(ICircularParenthoodJsonString, jsonSchemaString)).to.throw(Error, "Circular parenthood");
  });
  it("Two nodes with same name - Error", () => {
    expect(() => new JsonNetParser().createNet(IncorrectNameJsonString, jsonSchemaString)).to.throw(Error, "The node Example2 already exist in the network!");
  });
  it("Incorrect cpt probabilities - Error", () => {
    expect(() => new JsonNetParser().createNet(IncorrectCptJsonString, jsonSchemaString)).to.throw(Error);
  });
  it("Empty Cpt - Error", () => {
    expect(() => new JsonNetParser().createNet(EmptyCptJsonString, jsonSchemaString)).to.throw(Error, "Empty cpt");
  });
  it("Incorrect Cpt Rows - Error", () => {
    expect(() => new JsonNetParser().createNet(IncorrectCptRowsJsonString, jsonSchemaString)).to.throw(Error, "Incorrect cpt's number of columns for nodeExample (found:2 expected:1)");
  });
  it("Incorrect Cpt Columns - Error", () => {
    expect(() => new JsonNetParser().createNet(IncorrectCptColumnsJsonString, jsonSchemaString)).to.throw(Error, "Incorrect cpt's number of columns for nodeExample (found:3 expected:2)");
  });
});
