import {expect} from "chai";
import {ConcreteReadClientFactory} from "../../core/read-client/ReadClientFactory";
let factory=new ConcreteReadClientFactory();
describe("ConcreteReadClientFactory - makeInfluxReadClient", () => {
  it("Base call with no login - Error not thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086")).not.to.throw(Error);
  });
  it("Base call with login - Error not thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["admin","pswd"])).not.to.throw(Error);
  });
  it("Host null - Error",()=>{
    expect(()=>factory.makeInfluxReadClient(null,"8086")).to.throw(Error, "invalid host parameter");
  });
  it("Host empty string- Error",()=>{
    expect(()=>factory.makeInfluxReadClient("","8086")).to.throw(Error, "invalid host parameter");
  });
  it("Port null - Error",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost",null)).to.throw(Error, "invalid port parameter");
  });
  it("Port empty string - Error",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","")).to.throw(Error, "invalid port parameter");
  });
  it("Password not null but username null- Error",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",[null,"pswd"])).to.throw(Error, "invalid credentials parameter");
  });
  it("Username empty string- Error",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["","pswd"])).to.throw(Error, "invalid credentials parameter");
  });
  it("Username not null but password null- Error",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["admin",null])).to.throw(Error, "invalid credentials parameter");
  });
});
