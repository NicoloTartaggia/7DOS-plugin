import InfluxReadClient from "../../core/read-client/InfluxReadClient";
import { ConcreteReadClientFactory } from "../../core/read-client/ReadClientFactory";

import {expect} from "chai";
import {InfluxDB} from "influx";

let client:InfluxReadClient=new ConcreteReadClientFactory().makeInfluxReadClient("http://localhost","8086");

describe("InfluxReadClient - createReaderClient", () => {
  const influx: InfluxDB = new InfluxDB();  
  it("Undefined dsn - Error", () => {
    let dsn: string;
    expect(() => new InfluxReadClient(dsn, influx)).to.throw(Error, "[7DOS G&B][InfluxReadClient]constructor - invalid dsn parameter");
  });
  it("Empty dsn - Error", () => {
    expect(() => new InfluxReadClient("", influx)).to.throw(Error, "[7DOS G&B][InfluxReadClient]constructor - invalid dsn parameter");
  });
  it("Undefined influx - Error", () => {
    expect(() => new InfluxReadClient("http://localhost:8086/prova", null)).to.throw(Error, "[7DOS G&B][InfluxReadClient]constructor - invalid influx parameter");
  });
  it("Correct inputs - InfluxReadClient", () => {
    expect(() => new InfluxReadClient("http://localhost:8086/prova", influx)).to.not.throw(Error);
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
  it("Undefined database - Error",()=>{
    client.readField(null,"SHOW MEASUREMENTS").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][InfluxReadClient]readField - invalid database parameter");
    });
  });
  it("Undefined query - Error",()=>{
    client.readField("http://localhost",null).then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][InfluxReadClient]readField - invalid query parameter");
    });
  });
  it("Empty database - Error",()=>{
    client.readField("", "SHOW MEASUREMENTS").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][InfluxReadClient]readField - invalid database parameter");
    });
  });
  it("Empty query - Error",()=>{
    client.readField("http://localhost","").then(function(){})
    .catch(function(e){
      expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][InfluxReadClient]readField - invalid query parameter");
    });
  });
});
