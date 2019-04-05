// import { NetReader } from "../../../core/net-manager/reader/NetReader";

import {expect} from "chai";
import DataSource from "../../../core/net-manager/reader/Datasource";

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
