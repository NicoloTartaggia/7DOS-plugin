import {ReusableReadClientPool} from "../../../core/net-manager/reader/ReusableReadClientPool";
import {DataSource} from "../../../core/net-manager/reader/Datasource";
import {ReadClient} from "../../../core/read-client/ReadClient";

import {expect} from "chai";

before("Db init", async () => {
    const Influx = require('influx');
    const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'testDB',
    schema: [
    {
        measurement: 'win_cpu',
        fields: {
            Percent_DPC_Time: Influx.FieldType.FLOAT,
        },
        tags: [
            'host'
        ]
    }
    ]
    });
    await influx.getDatabaseNames()
    .then(names => {
      if (!names.includes('express_response_db')) {
        return influx.createDatabase('express_response_db');
      }
    })
});

describe("ReusableReadClientPool - acquireReusable", () => {
    it("Undefined datasource - Error", () => {
        let datasource: DataSource;
        expect(() => ReusableReadClientPool.getInstance().acquireReusable(datasource)).to.throw(Error, "invalid datasource parameter");
    });
    it("Defined datasource - ReadClient", () => {
        let datasource: DataSource = new DataSource("http://localhost:8086/", "testDB");
        let JSONstr: string = JSON.stringify(ReusableReadClientPool.getInstance().acquireReusable(datasource));
        expect(JSONstr.includes("http://localhost")).to.equal(true);
    });
});

describe("ReusableReadClientPool - releseReusable", () => {
    it("Undefined to_remove - Error", () => {
        let to_remove: ReadClient;
        expect(() => ReusableReadClientPool.getInstance().releseReusable(to_remove)).to.throw(Error, "invalid to_remove parameter");
    });
});
