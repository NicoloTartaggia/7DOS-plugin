// import { NetReader } from "../../../core/net-manager/reader/NetReader";

import {expect} from "chai";
import {DataSource} from "../../../core/net-manager/reader/Datasource";

const complete: DataSource = new DataSource("http://localhost:8086", "database", "username", "password", "type", "name", 1);

describe("Datasource - constructor", () => {
    it("Empty url - Error", () => {
        expect(() => new DataSource("", "database")).to.throw(Error, "invalid url parameter");
    });
    it("Empty type - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "username", "password", "")).to.throw(Error, "invalid type parameter");
    });
    it("Empty name - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "username", "password", "type", "")).to.throw(Error, "invalid name parameter");
    });
    it("Correct inputs - DataSource", () => {
        expect(() => new DataSource("http://localhost", "database")).to.not.throw(Error);
    });
});

describe("Datasource - copy", () => {
    it("Datasource - New datasource", () => {
        expect(DataSource.copy(new DataSource("http://localhost", "database")).getDatabase()).to.equal("database");
    });
    it("Null datasource - Error", () => {
        let dt: DataSource;
        expect(() => DataSource.copy(dt)).to.throw(Error, "[7DOS G&B][DataSource]copy - invalid datasource parameter");
    });
});

describe("Datasource - clone", () => {
    it("Datasource - New datasource", () => {
        expect(new DataSource("http://localhost", "database").clone().getUrl()).to.equal("http://localhost:");
    });
});

describe("Datasource - getDatabase", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getDatabase()).to.equal("database");
    });
});

describe("Datasource - getGrafanaDatasourceId", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getGrafanaDatasourceId()).to.equal(1);
    });
});

describe("Datasource - getHost", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getHost()).to.equal("http://localhost");
    });
});

describe("Datasource - getName", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getName()).to.equal("name");
    });
});

describe("Datasource - getPassword", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getPassword()).to.equal("password");
    });
});

describe("Datasource - getPort", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getPort()).to.equal("8086");
    });
});

describe("Datasource - getType", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getType()).to.equal("type");
    });
});

describe("Datasource - getUrl", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getUrl()).to.equal("http://localhost:8086");
    });
});

describe("Datasource - getUsername", () => {
    it("Datasource - Correct value", () => {
        expect(complete.getUsername()).to.equal("username");
    });
});

describe("Datasource - cloneWithDB", () => {
    it("Null - Error", () => {
        let empty: string;
        expect(()=>complete.cloneWithDB(empty)).to.throw(Error, "[7DOS G&B][DataSource]cloneWithDB - invalid database_name parameter");
    });
    it("Datasource - Correct value", () => {
        expect(complete.cloneWithDB("database1").getDatabase()).to.equal("database1");
    });
});

describe("Datasource - cloneWithDB", () => {
    it("Datasource - Correct value", () => {
        expect(complete.hasSameHost(new DataSource("http://localhost:8086"))).to.equal(true);
    });
});
