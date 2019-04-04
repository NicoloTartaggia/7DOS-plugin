// import InfluxReadClient from "../../core/read-client/InfluxReadClient";
// import { ConcreteReadClientFactory } from "../../core/read-client/ReadClientFactory";

import {expect} from "chai";
//import {InfluxDB} from "influx";
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
/*
  before(function(){
    this.timeout(10000);
    let client:InfluxDB=new InfluxDB({
      host: 'localhost',
      port: 8086,
      database:"readTest"
    });
    return new Promise((resolve) => {
      client.createDatabase("readTest").then(function(){
        client.writePoints([{
          measurement:"cpu",
          tags:{},
          fields:{value:0.64}
        }]);
      });
      resolve();
    }); 
  });
  it("read on influx server- field read correctly", () => {
      return new Promise((resolve) => {
        let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
        let result=client.readField("readTest", "select value from cpu");
        result.then(function(value){
          expect(value[0].rows[0].value).to.equal(0.64);
        });
        resolve();
      });
  });
  after(function(){
    return new Promise((resolve) => {
      let client:InfluxDB=new InfluxDB({
        host: 'localhost',
        port: 8086,
      });
      client.dropDatabase("readTest");
      resolve();
    });
  });
  */
  it("null database - exception thrown",()=>{
    /*
    let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
    client.readField(null,":8086").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });*/
  });
  it("null query - exception thrown",()=>{
    /*
    let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");
    client.readField("http://localhost",null).then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });*/
  });
});
