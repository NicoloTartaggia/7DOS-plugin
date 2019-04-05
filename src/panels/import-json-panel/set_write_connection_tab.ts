import { RxHR } from "@akanass/rx-http-request/browser/index.js";

// import { NodeAdapter } from "core/network/adapter/NodeAdapter";
import { coreModule } from "grafana/app/core/core";
import { DashboardModel } from "grafana/app/features/dashboard/model";
import DataSource from "../../core/net-manager/reader/Datasource";

export class SetWriteConnection_Ctrl {
  public panel: any;
  public panelCtrl: any;
  public dashboard: DashboardModel;

  // private genericModel: any;
  private datasources: { [datasource_id: string]: DataSource; } = {};

  // ANGULARJS <select> stuff - save all the node selections

  // @ts-ignore
  private selected_datasource: string;
  // @ts-ignore
  private database_name: string;

  // @ts-ignore
  constructor($scope, private $sce, datasourceSrv, private backendSrv) {
    console.log("SelectDB_Ctrl - Start constructor");
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.panel.datasource = this.panel.datasource || null;
    this.panel.targets = this.panel.targets || [{}];
    this.dashboard = this.panelCtrl.dashboard;

    // Linking select_ts_tab to panel
    this.panel.ts_tab_control = this.panelCtrl;
    console.log("SelectDB_Ctrl - Object build");
    console.log("SelectDB_Ctrl - Get datasources");
    this.getDatasources();
    this.selected_datasource = null;
  }

  // ------------------------------------------------------
  // Get all database structure
  // ------------------------------------------------------
  public loadData() {
    (document.getElementById("load-btn") as HTMLButtonElement).disabled = true;
  }

  public getDatasources() {
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
              this.datasources[entry.id] = datas;
              // this.getDatabases(entry.id);
            } else {
              console.log("False for:" + entry.name);
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  public createDatabaseToWrite() {
    // if user doesn't provide a specific name
    if (this.database_name === null) {
      this.database_name = "7DOS_default_DB";
    }
  }
  // ------------------------------------------------------
  // Change select
  // ------------------------------------------------------

  // This function, currently does nothing, is just for printing debug stuff when the select change
  /*public select_datasource(id: string) {
    console.log("select_datasource");
    console.log("Received id:" + id);
    for (const key of Object.keys(this.selected_datasource)) {
      const value = this.selected_datasource[key];
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_database(id: string) {
    console.log("select_database");
    for (const key of Object.keys(this.selected_database)) {
      const value = this.selected_database[key].name;
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_table(id: string) {
    console.log("select_table");
    for (const key of Object.keys(this.selected_table)) {
      const value = this.selected_table[key].name;
      console.log(`${key} -> ${value}`);
    }
  }

  // This function, currently does nothing, is just for printing debug stuff when the select change
  public select_field(id: string) {
    console.log("select_field");
    for (const key of Object.keys(this.selected_field)) {
      const value = this.selected_field[key];
      console.log(`${key} -> ${value}`);
    }
  }

  public queryComposer(nodesIndex: number) {
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

  public queryIssuer(query: string) {
    RxHR.get(query).subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          console.log(data.body); // Show the HTML for the Google homepage.
        }
      },
      (err) => console.error(err), // Show error in console
    );
  }*/

}

/** @ngInject */
export function SetWriteConnection_Directive () {
  "use strict";
  return {
    controller: SetWriteConnection_Ctrl,
    restrict: "E",
    scope: true,
    templateUrl: "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_setupInflux.html",
  };
}

coreModule.directive("metricsTab", SetWriteConnection_Directive);
