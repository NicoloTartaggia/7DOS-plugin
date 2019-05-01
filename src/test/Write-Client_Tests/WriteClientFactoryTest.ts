import {ConcreteWriteClientFactory} from "../../core/write-client/WriteClientFactory";

import {expect} from "chai";

describe("WriteClientFactory - makeInfluxWriteClient", () => {
    it("Undefined host - Error ", () => {
        let host: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            host, "something", "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid host parameter");
        });
    });
    it("Undefined port - Error ", () => {
        let port: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", port, "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid port parameter");
        });
    });
    it("Undefined defaultDB - Error ", () => {
        let defaultDB: string;
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", "something else", defaultDB, ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid defaultDB parameter");
        });
    });
    it("Empty host - Error ", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "", "something", "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid host parameter");
        });
    });
    it("Empty port - Error ", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", "", "something else", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid port parameter");
        });
    });
    it("Empty defaultDB - Error ", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "something", "something else", "", ["admin", "password"]
        ).then(function(){}).catch(function(e){
            expect(<Error> e.toString()).to.equal("Error: [7DOS G&B][ConcreteWriteClientFactory]makeInfluxWriteClient - invalid defaultDB parameter");
        });
    });
    it("Correct inputs - New InfluxWriteClient", () => {
        new ConcreteWriteClientFactory().makeInfluxWriteClient(
            "http://localhost", "8086", "prova"
        ).then(function(writeClient){
            expect(writeClient.getAddress()).to.equal("http://localhost:8086/");
            expect(writeClient.getDefaultDB()).to.equal("prova");
        }).catch(function(e){
            console.log("WriteClientFactory makeInfluxWriteClient All defined ERROR: " + e);
        });
    });
});
