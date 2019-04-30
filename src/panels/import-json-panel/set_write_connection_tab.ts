import {RxHR} from "@akanass/rx-http-request/browser/index.js";

import {coreModule} from "grafana/app/core/core";
import {DashboardModel} from "grafana/app/features/dashboard/model";
import DataSource from "../../core/net-manager/reader/Datasource";
import {ConcreteWriteClientFactory, WriteClientFactory} from "../../core/write-client/WriteClientFactory";
import {JsImportPanel} from "./JsonImportPanel";

export class SetWriteConnection_Ctrl {
  public panel: any;
  public panelCtrl: any;
  public dashboard: DashboardModel;

  private datasources: { [datasource_id: string]: DataSource; } = {};

  // ANGULARJS <select> stuff - save the selected datasource to write
  // @ts-ignore
  private selected_datasource: string;

  // WriteClientFactory field to set the database written in the textbox by the user
  private writeCF: WriteClientFactory;

  // @ts-ignore
  constructor ($scope, private $sce, datasourceSrv, private backendSrv) {
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;
    this.panel = this.panelCtrl.panel;
    this.panel.datasource = this.panel.datasource || null;
    this.panel.targets = this.panel.targets || [{}];
    this.dashboard = this.panelCtrl.dashboard;
    this.selected_datasource = null;
    this.writeCF = new ConcreteWriteClientFactory();
    this.getDatasources();
  }

  // ------------------------------------------------------
  // Get all database structure
  // ------------------------------------------------------

  public loadData () {
    (document.getElementById("load-btn") as HTMLButtonElement).disabled = true;
    // If the field is not empty, let's save the selected datasource in the panel
    if (this.panel.write_datasource_id.length > 0) {
      this.selected_datasource = this.panel.write_datasource_id;
      JsImportPanel.showSuccessMessage("Saved data loaded succesfully!");
    } else {
      JsImportPanel.showSuccessMessage("List of available datasources loaded succesfully!");
    }
  }

  public getDatasources () {
    console.log("[7DOS G&B][SetWriteConnection_Ctrl]getDatasources() - start loading datasources...");
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
              this.datasources[entry.id] = new DataSource(entry.url, entry.database, entry.user,
                entry.password, entry.type, entry.name, entry.id);
              // this.getDatabases(entry.id);
            } else {
              console.log("[7DOS G&B][SetWriteConnection_Ctrl]Ignoring database with name:" + entry.name
                + " because is not an InfluxDB");
            }
          }
        }
      },
      (err) => console.error(err),
    );
  }

  public async createDatabaseToWrite () {
    // if user doesn't provide a specific name
    if (this.panel.write_db_name === null || this.panel.write_db_name.length === 0) {
      this.panel.write_db_name = "7DOS_default_DB";
      JsImportPanel.showErrorMessage("Error with the database name!",
        "You must specify a database name where the plug-in should write");
      throw new Error("[7DOS G&B][SetWriteConnection_Ctrl]createDatabaseToWrite - " +
        "You must specify a database name where the plug-in should write!");
    }
    if (typeof this.datasources[this.selected_datasource] === "undefined") {
      // no datasource set
      JsImportPanel.showErrorMessage("Error with the datasource!",
        "You must select a datasource to write data");
      throw new Error("[7DOS G&B][SetWriteConnection_Ctrl]createDatabaseToWrite - " +
        "You must select a datasource to write data!");
    }
    try {
      const hostname: string = this.datasources[this.selected_datasource].getHost();
      const port: string = this.datasources[this.selected_datasource].getPort();
      console.log("[7DOS G&B][SetWriteConnection_Ctrl]Trying to write result on database: " + this.panel.write_db_name +
        " on URL: " + hostname + port);
      this.panelCtrl.updateNetWriter(await this.writeCF.makeInfluxWriteClient(hostname, port,
        this.panel.write_db_name));
      // Save info
      this.panel.write_datasource_id = this.selected_datasource;
      // Create data
      this.writeCF.makeInfluxWriteClient(hostname, port, this.panel.write_db_name);
    } catch (err) {
      console.error("[7DOS G&B][SetWriteConnection_Ctrl]createDatabaseToWrite - ERROR:" + err.to);
      JsImportPanel.showErrorMessage("Error creating the connection!",
        "An error occurred writing to the selected datasource!");
      return;
    }
    JsImportPanel.showSuccessMessage("Connection with destination datasource created successfully!");
  }

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
