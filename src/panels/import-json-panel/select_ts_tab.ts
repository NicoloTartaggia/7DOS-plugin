import {RxHR} from "@akanass/rx-http-request/browser/index.js";

import {NodeAdapter} from "core/network/adapter/NodeAdapter";
import {coreModule} from "grafana/app/core/core";
import {DashboardModel} from "grafana/app/features/dashboard/model";
import DataSource from "../../core/net-manager/reader/Datasource";

class Script_Found_Database {
  public name: string;
  public tables: { [table_name: string]: Script_Found_Table; } = {};
}

class Script_Found_Table {
  public name: string;
  public fields: Array<string> = [];
}

class Saved_Connecton {
  public nodename: string;
  public datasource: DataSource;
  public table: string;
  public field: string;

  public setTableField (query: string) {
    this.field = query.substring(
      query.toLowerCase().indexOf("select") + 7,
      query.toLowerCase().indexOf("from"),
    ).trim();
    this.table = query.substring(
      query.toLowerCase().indexOf("from") + 5,
    ).trim();
    console.log("Select:" + this.field + " Table:" + this.table);
  }
}

export class SelectDB_Ctrl {
  public panel: any;
  public panelCtrl: any;
  public dashboard: DashboardModel;

  // Private class stuff - do not touch
  private nodes: Array<NodeAdapter>;
  // private genericModel: any;
  private datasources: { [datasource_id: string]: DataSource; } = {};
  private databases: { [datasource_id: string]: { [database_name: string]: Script_Found_Database; } } = {};

  // ANGULARJS <select> stuff - save all the node selections
  // Every dictionary associate the node with a part of the query (url-db-table-field)
  private selected_datasource: { [node_id: string]: string; } = {};
  private selected_database: { [node_id: string]: Script_Found_Database; } = {};
  private selected_table: { [node_id: string]: Script_Found_Table; } = {};
  private selected_field: { [node_id: string]: string; } = {};

  // @ts-ignore
  constructor ($scope, private $sce, datasourceSrv, private backendSrv) {
    console.log("SelectDB_Ctrl - Start constructor");
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.panel.datasource = this.panel.datasource || null;
    this.panel.targets = this.panel.targets || [{}];
    this.dashboard = this.panelCtrl.dashboard;
    // Linking select_ts_tab to panel
    console.log("SelectDB_Ctrl - Object build");
    console.log("SelectDB_Ctrl - Get datasources");
    this.getDatasources();
    this.refreshNetwork();
  }

  // ------------------------------------------------------
  // Get all database structure
  // ------------------------------------------------------

  // The button "query" calls this method when clicked. The nodes of network loaded are displayed
  // on this tab. After that it's possible to associate a datasource.
  public refreshNetwork () {
    if (this.panelCtrl.loaded_network !== undefined) {
      this.nodes = this.panelCtrl.loaded_network.getNodeList();
    }
  }

  public getQuery (nodesIndex: number): ([string, DataSource]) {
    const nodeName: string = this.nodes[nodesIndex].getName(); // ^ used only here

    const datasource: DataSource = this.datasources[this.selected_datasource[nodeName]];
    if (datasource !== undefined && datasource !== null) {
      // Create a clone of the selected datasource with the specified database name
      const database: string = this.selected_database[nodeName].name;
      const return_datasource = datasource.cloneWithDB(database);
      const table: string = this.selected_table[nodeName].name;
      const field: string = this.selected_field[nodeName];
      const query: string = "SELECT " + field + " FROM " + table;
      return ([query, return_datasource]);
    }
    return ([null, null]);
  }

  public connectNodes () {
    console.log("connectNodes() - output:");
    console.log(this.panel.save_datasources);
    for (let i = 0; i < this.nodes.length; i++) {
      const [query, datasource] = this.getQuery(i);
      if (datasource !== null) {
        this.panelCtrl.netReader.connectNode(this.nodes[i].getName(), datasource, query);
        const saved_to_add: Saved_Connecton = new Saved_Connecton();
        saved_to_add.nodename = this.nodes[i].getName();
        saved_to_add.datasource = datasource;
        saved_to_add.setTableField(query);
        // Add to array
        let indexof = -1;
        for (let k = 0; k < this.panel.save_datasources.length; k++) {
          if (this.panel.save_datasources[k].nodename === saved_to_add.nodename) {
            indexof = k;
          }
        }
        console.log("END:" + indexof);
        if (indexof === -1) {
          this.panel.save_datasources.push(saved_to_add);
        } else {
          this.panel.save_datasources[i] = saved_to_add;
        }
      }
    }
  }

  public loadData () {
    console.log("loaddata()");
    console.log(this.panel.save_datasources);
    for (const element of this.panel.save_datasources) {
      const c_datasource: DataSource = DataSource.copy(element.datasource as DataSource);
      console.log(c_datasource);
      const datasourceId: string = c_datasource.getGrafanaDatasourceId().toString();
      this.selected_datasource[element.nodename] = datasourceId;
      const db: Script_Found_Database = this.getDatabaseObjFromName(datasourceId, c_datasource.getDatabase());
      const otherDB: Script_Found_Database = this.databases[2].telegraf;
      this.selected_database[element.nodename] = db;
      console.log("DB:");
      console.log(db);
      console.log("Other DB:");
      console.log(otherDB);
      console.log(db === otherDB);
      console.log(db === this.selected_database[element.nodename]);
      const tb: Script_Found_Table = this.getTableObjFromName(db, element.table);
      this.selected_table[element.nodename] = tb;
      this.selected_field[element.nodename] = element.field;
    }
    (document.getElementById("load-btn") as HTMLButtonElement).disabled = true;
  }

  public getDatasources () {
    this.datasources = {};

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const hostUrl = protocol + "//" + hostname + ":" + port;

    RxHR.get(hostUrl + "/api/datasources").subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          const datasources = JSON.parse(data.body);
          for (const entry of datasources) {
            if (entry.type === "influxdb") {
              const datas = new DataSource(entry.url, entry.database, entry.user,
                entry.password, entry.type, entry.name, entry.id);
              console.log("datas.name: " + datas.getName());
              this.datasources[entry.id] = datas;
              this.getDatabases(entry.id);
            } else {
              console.log("False for:" + entry.name);
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  public getDatabases (datasource_id: string) {
    // http://localhost:8086/query?q=SHOW DATABASES
    RxHR.get(this.datasources[datasource_id].getUrl() + "/query?q=SHOW DATABASES").subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          const databases = JSON.parse(data.body);
          console.log("getDatabases request done - executing for");
          for (const entry of databases.results[0].series[0].values) {
            if (!entry[0].startsWith("_")) { // Internal database?
              const databaseOBJ = new Script_Found_Database();
              databaseOBJ.name = entry[0];
              const dict = this.databases[datasource_id];
              if (typeof dict === "undefined") {
                this.databases[datasource_id] = {};
              }
              this.databases[datasource_id][databaseOBJ.name] = databaseOBJ;
              this.getTables(datasource_id, databaseOBJ);
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  /**/
  public getTables (datasource_id: string, databaseOBJ: Script_Found_Database) {
    // http://localhost:8086/query?db=telegraf&q=SHOW MEASUREMENTS
    RxHR.get(this.datasources[datasource_id].getUrl() +
      "/query?db=" + databaseOBJ.name + "&q=SHOW MEASUREMENTS").subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          const databases = JSON.parse(data.body);
          if (typeof databases.results[0].series !== "undefined") {
            for (const entry of databases.results[0].series[0].values) {
              const tableOBJ = new Script_Found_Table();
              tableOBJ.name = entry[0];
              databaseOBJ.tables[tableOBJ.name] = tableOBJ;
              this.getTableFields(datasource_id, databaseOBJ, tableOBJ);
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  public getTableFields (datasource_id: string, databaseOBJ: Script_Found_Database, tableOBJ: Script_Found_Table) {
    // http://localhost:8086/query?db=telegraf&q=SHOW FIELD KEYS FROM win_cpu
    RxHR.get(this.datasources[datasource_id].getUrl() +
      "/query?db=" + databaseOBJ.name + "&q=SHOW FIELD KEYS FROM " + tableOBJ.name).subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          const databases = JSON.parse(data.body);
          if (typeof databases.results[0].series !== "undefined") {
            for (const entry of databases.results[0].series[0].values) {
              tableOBJ.fields.push(entry[0]);
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  // ------------------------------------------------------
  // Change select
  // ------------------------------------------------------

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_datasource (id: string) {
    console.log("select_datasource");
    console.log("Received id:" + id);
    for (const key of Object.keys(this.selected_datasource)) {
      const value = this.selected_datasource[key];
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_database (id: string) {
    console.log("select_database");
    for (const key of Object.keys(this.selected_database)) {
      const value = this.selected_database[key].name;
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_table (id: string) {
    console.log("select_table");
    for (const key of Object.keys(this.selected_table)) {
      const value = this.selected_table[key].name;
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_field (id: string) {
    console.log("select_field");
    for (const key of Object.keys(this.selected_field)) {
      const value = this.selected_field[key];
      console.log(`${key} -> ${value}`);
    }
  }

  public queryComposer (nodesIndex: number) {
    const nI = 0;   // used for tests, to be replaced with parameter nodesIndex
    const nodeName = this.nodes[nI].getName(); // ^ used only here

    const datasource = this.datasources[this.selected_datasource[nodeName]];
    const url = datasource.getUrl();
    const database = datasource.getDatabase();
    const table = this.selected_table[nodeName].name;
    const field = this.selected_field[nodeName];
    const query = url + "/query?db=" + database + "&q=SELECT " + field + " FROM " + table;
    console.log(query);
    this.queryIssuer(query);
  }

  public queryIssuer (query: string) {
    RxHR.get(query).subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          console.log(data.body); // Show the HTML for the Google homepage.
        }
      },
      (err) => console.error(err), // Show error in console
    );
  }

  private getDatabaseObjFromName (datasourceId: string, databasename: string) {
    return this.databases[datasourceId][databasename];
  }

  private getTableObjFromName (database: Script_Found_Database, tableName: string) {
    return database.tables[tableName];
  }

}

/** @ngInject */
export function SelectDB_Directive () {
  "use strict";
  return {
    controller: SelectDB_Ctrl,
    restrict: "E",
    scope: true,
    templateUrl: "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_SelectDb_Node.html",
  };
}

coreModule.directive("metricsTab", SelectDB_Directive);
