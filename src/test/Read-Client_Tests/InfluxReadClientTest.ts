import InfluxReadClient from "../../core/read-client/InfluxReadClient";
import { ConcreteReadClientFactory } from "../../core/read-client/ReadClientFactory";

import {expect} from "chai";
import {InfluxDB} from "influx";

let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");

describe("InfluxReadClient - createReaderClient", () => {
    it(" TODO ", () => {
        // TODO
        expect(true).to.equal(true);
    });
});

describe("InfluxReadClient - getAddress", () => {
    it(" base call no login - address returned correctly ", () => {
      expect(client.getAddress()).to.equals("http://localhost:8086/");
    });
    it(" base call with login - address returned correctly ", () => {
      let loginClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086",["admin","password"]);
      expect(loginClient.getAddress()).to.equals("http://admin:password@localhost:8086/");
    });
});
describe("InfluxReadClient - readField", () => {
  it("read on influx server- field read correctly", () => {
    let influxclient:InfluxDB=new InfluxDB({
      host: 'localhost',
      port: 8086,
      database:"readTest"
    });
    influxclient.createDatabase("readTest").then(function(){
      influxclient.writePoints([{
        measurement:"cpu",
        tags:{},
        fields:{value:0.64}
      }]).then(function(){
        let result=client.readField("readTest", "select value from cpu");
        result.then(function(value){
          expect(value[0].rows[0].value).to.equal(0.64);
        });
      })
    });
  });
  /*
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
    client.readField(null,":8086").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });
  });
  it("null query - exception thrown",()=>{
    client.readField("http://localhost",null).then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });
  });
  it("database empty string- exception thrown",()=>{
    client.readField("http://localhost","").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });
  });
  it("query empty string- exception thrown",()=>{
    client.readField("","8086").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: invalid parameter");
    });
  });
});
