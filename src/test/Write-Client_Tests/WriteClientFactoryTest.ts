import {ConcreteWriteClientFactory} from "../../core/write-client/WriteClientFactory";
//import InfluxWriteClient from "../../core/write-client/InfluxWriteClient";

import {expect} from "chai";

describe("WriteClientFactory - chooseClient", () => {
    it("Undefined host - Error ", () => {
        let host: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            host, "something", "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: invalid parameter");
        });
    });
    it("Undefined port - Error ", () => {
        let port: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", port, "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: invalid parameter");
        });
    });
    it("Undefined defaultDB - Error ", () => {
        let defaultDB: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", "something else", defaultDB, ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: invalid parameter");
        });
    });
    it("All defined - New InfluxWriteClient", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost", "8086", "prova"
        ).then(function(writeClient){
            expect(writeClient.getAddress()).to.equal("http://localhost:8086/");
            expect(writeClient.getDefaultDB()).to.equal("prova");
        }).catch(function(e){
            console.log(e);
        });
    });
});
