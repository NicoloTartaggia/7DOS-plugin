import { NetworkAdapter } from "../../core/network/adapter/adapter";
import { JsonNetParser } from "../../core/network/factory/factory";
import { NetReader, DataSource } from "../../core/net-manager/reader/reader";
import { NetUpdater } from "../../core/net-manager/updater/NetUpdater";

import { expect } from "chai";

const schemaPath: string = "../../core/network/factory/network_structure.schema.json";
const jsonSchema = require(schemaPath);
const jsonSchemaString: string = JSON.stringify(jsonSchema);

const correctNetworkPath: string = "../Util_JSON/CorrectNetwork.json"
const json = require(correctNetworkPath);
const correctJsonString: string = JSON.stringify(json);

const network: NetworkAdapter = new JsonNetParser().createNet(correctJsonString, jsonSchemaString);

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
    if (!names.includes('testDB')) {
      return influx.createDatabase('testDB');
    }
  })
  await influx.writePoints([
      {
      measurement: 'win_cpu',
      tags: { host: "thishost" },
      fields: { Percent_DPC_Time: 0.060454 },
      }
  ]);
});

describe("NetReader NetUpdater Integration Test", () => {
  it("Defined parameters - No error", async () => {
      let errorFlag: boolean = false;
      let error: any;
      const reader: NetReader = new NetReader(network);
      const updater: NetUpdater = new NetUpdater(network);
      reader.connectNode("Example2", new DataSource("http://localhost:8086/", "testDB"), "SELECT Percent_DPC_Time FROM win_cpu");
      await reader.read().then(function(result){
          updater.updateNet(result);
      })
      .catch((err) => {
          errorFlag = true;
          error = err;
      })
      if(errorFlag) {
          console.log(error);
      }
      return expect(errorFlag).to.equal(false);    
  });
});
