import {expect} from "chai";
import {ConcreteReadClientFactory} from "../../core/read-client/ReadClientFactory";
let factory=new ConcreteReadClientFactory();
describe("ConcreteReadClientFactory - makeInfluxReadClient", () => {
  it("base call with no login - error not thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086")).not.to.throw(Error, "invalid parameter");
  });
  it("base call with login - error not thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["admin","pswd"])).not.to.throw(Error, "invalid parameter");
  });
  it("host null - exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient(null,"8086")).to.throw(Error, "invalid parameter");
  });
  it("host empty string- exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("","8086")).to.throw(Error, "invalid parameter");
  });
  it("port null - exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost",null)).to.throw(Error, "invalid parameter");
  });
  it("port empty string - exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","")).to.throw(Error, "invalid parameter");
  });
  it("password not null but username null- exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",[null,"pswd"])).to.throw(Error, "invalid parameter");
  });
  it("username empty string- exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["","pswd"])).to.throw(Error, "invalid parameter");
  });
  it("username not null but password null- exception thrown",()=>{
    expect(()=>factory.makeInfluxReadClient("http://localhost","8086",["admin",null])).to.throw(Error, "invalid parameter");
  });
});
