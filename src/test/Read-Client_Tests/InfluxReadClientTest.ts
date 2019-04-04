// import InfluxReadClient from "../../core/read-client/InfluxReadClient";
// import { ConcreteReadClientFactory } from "../../core/read-client/ReadClientFactory";

import {expect} from "chai";

describe("InfluxReadClient - createReaderClient", () => {
    it(" TODO ", () => {
        // TODO
        expect(true).to.equal(true);
    });
});

describe("InfluxReadClient - getAddress", () => {
    it(" TODO ", () => {
        // TODO
        expect(true).to.equal(true);
    });
});

describe("InfluxReadClient - readField", () => {
  it("read on influx server- field read correctly", () => {
    // TODO FIX USING PRE-TEST
    /*let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
    let result=client.readField("readTest", "select * from cpu");
    result.then(function(value){
      expect(value[0].rows[0].value).to.equal(0.64);
    },
    function(value){
      throw new Error("Influx error");
    });
  });
  it("null database - exception thrown",()=>{
    let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
    client.readField(null,":8086").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });
  });
  it("null query - exception thrown",()=>{
    let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
    client.readField("http://localhost",null).then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });*/
  });
});
