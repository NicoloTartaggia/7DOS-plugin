// import { NetReader } from "../../../core/net-manager/reader/NetReader";

import ReusableReadClientPool from "../../../core/net-manager/reader/ReusableReadClientPool";
import DataSource from "../../../core/net-manager/reader/Datasource";
import ReadClient from "../../../core/read-client/ReadClient";

import {expect} from "chai";

describe("ReusableReadClientPool - acquireReusable", () => {
    it("Undefined datasource - Error", () => {
        let datasource: DataSource;
        expect(() => ReusableReadClientPool.getInstance().acquireReusable(datasource)).to.throw(Error, "invalid parameter");
    });
    it("Defined datasource - ReadClient", () => {
        let datasource: DataSource = new DataSource("http://localhost:8086/");
        let JSONstr: string = JSON.stringify(ReusableReadClientPool.getInstance().acquireReusable(datasource));
        expect(JSONstr.includes("http://localhost")).to.equal(true);
    });
});

describe("ReusableReadClientPool - releseReusable", () => {
    it("Undefined to_remove - Error", () => {
        let to_remove: ReadClient;
        expect(() => ReusableReadClientPool.getInstance().releseReusable(to_remove)).to.throw(Error, "invalid parameter");
    });
});