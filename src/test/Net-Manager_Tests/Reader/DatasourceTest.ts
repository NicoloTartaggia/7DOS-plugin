// import { NetReader } from "../../../core/net-manager/reader/NetReader";

import {expect} from "chai";
import DataSource from "../../../core/net-manager/reader/Datasource";

describe("Datasource - constructor", () => {
    it("Empty url - Error", () => {
        expect(() => new DataSource("", "database")).to.throw(Error, "Invalid url");
    });
    /*
    it("Empty database - Error", () => {
        expect(() => new DataSource("http://localhost", "")).to.throw(Error, "invalid parameter");
    });
    it("Empty username - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "")).to.throw(Error, "invalid parameter");
    });
    it("Empty password - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "username", "")).to.throw(Error, "invalid parameter");
    });
    */
    it("Empty type - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "username", "password", "")).to.throw(Error, "Invalid type");
    });
    it("Empty name - Error", () => {
        expect(() => new DataSource("http://localhost", "database", "username", "password", "type", "")).to.throw(Error, "Invalid name");
    });
});
