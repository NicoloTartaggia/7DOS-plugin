import appEvents from "grafana/app/core/app_events";
import {PanelCtrl} from "grafana/app/plugins/sdk";
import {ConcreteWriteClientFactory} from "../../core/write-client/WriteClientFactory";
import {SelectDB_Ctrl, SelectDB_Directive} from "./select_ts_tab";
import {SetWriteConnection_Ctrl, SetWriteConnection_Directive} from "./set_write_connection_tab";

import _ from "lodash";
import {NetManager} from "../../core/net-manager/NetManager";
import {NetReader} from "../../core/net-manager/reader/NetReader";
import {NetUpdater} from "../../core/net-manager/updater/NetUpdater";
import {NetWriter, SingleNetWriter} from "../../core/net-manager/writer/NetWriter";
import {NetworkAdapter} from "../../core/network/adapter/NetworkAdapter";
import {ConcreteNetworkFactory} from "../../core/network/factory/ConcreteNetworkFactory";

export class JsImportPanel extends PanelCtrl {
  public static templateUrl: string = "panels/import-json-panel/partials/panelTemplate.html";
  public static scrollable: boolean = true;

  // Test metric panel
  public scope: any;
  public datasource: any;
  public $q: any;
  public contextSrv: any;
  public datasourceSrv: any;
  public timeSrv: any;
  public templateSrv: any;
  public timing: any;
  public range: any;
  public interval: any;
  public intervalMs: any;
  public resolution: any;
  public timeInfo: any;
  public skipDataOnInit: boolean;
  public dataStream: any;
  public dataSubscription: any;
  public dataList: any;
  public nextRefId: string;

  // Tests strings
  public message: string;
  public result: string;

  // Form
  public node_name: string;
  public observe_value: string;
  public samples: number = 1000;
  public loaded_network: NetworkAdapter;
  public netManager: NetManager;
  public netReader: NetReader;
  public netUpdater: NetUpdater;
  public netWriter: NetWriter;

  public ts_tab_control: SelectDB_Ctrl;
  public write_connection_control: SetWriteConnection_Ctrl;

  public secondToRefresh: number;
  public nextTickPromise: any;
  public doRefresh: boolean;
  public panelDefaults = {
    jsonContent: "",
    secondToRefresh: 5,
  };

  constructor ($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);
    this.secondToRefresh = 5;
    this.doRefresh = false;

    this.events.on("panel-teardown", this.stop.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    console.log("On constructor");
    if (this.panel.jsonContent !== "") {
      this.onTextBoxRefresh();
    }

  }

  public onInitEditMode () {
    this.addEditorTab("JSON-Import-or-edit",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_importEditJson.html",
      1);
    this.addEditorTab("Network-Connection-to-Grafana", SelectDB_Directive, 2);
    this.addEditorTab("Network-Calculation-SetUp",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/network_Calculation_SetUp.html",
      3);
    this.addEditorTab("Setup-Results-Influx", SetWriteConnection_Directive, 4);
    this.events.emit("data-received", null);

  }

  public async onUpload (net) {
    console.log("On upload");
    try {
      this.loaded_network = new ConcreteNetworkFactory().parseNetwork(JSON.stringify(net));
      console.log(this.loaded_network.getNodeList().length);
    } catch (e) {
      this.message = "Upload failed!";
      this.result = "Impossible to read JSON, probably not valid... Error:" + e.toString();
      return;
    }
    this.message = "Upload succeeded!";
    this.result = "Network ready!";
    this.panel.jsonContent = JSON.stringify(net, null, "\t");
    this.events.emit("data-received", null);
    this.netUpdater = new NetUpdater(this.loaded_network);
    this.netReader = new NetReader(this.loaded_network);
    this.netWriter = new SingleNetWriter(await new ConcreteWriteClientFactory()
      .makeInfluxWriteClient("http://localhost", "8086", "myDB"));
    this.netManager = new NetManager(this.netReader, this.netUpdater, this.netWriter);
    this.ts_tab_control.refreshNetwork();
    this.write_connection_control.createDatabaseToWrite();
  }

  public onSubmit () { // Currently not used
    console.log("onSubmit() called");
    /*console.log("Node name:" + this.node_name);
    console.log("observe value:" + this.observe_value);
    console.log("Samples:" + this.samples);
    this.message = "Calculating...";
    this.loaded_network.observe(this.node_name, new SingleValue(this.observe_value, "0"));
    const sample_promise = this.loaded_network.sample(this.samples);
    const this_ref = this;
    let sample_result = -1;
    sample_promise.then(function (result) {
      sample_result = result / this_ref.samples;
      console.log(sample_result);
      this_ref.result = "Samples calculation done!";
      alert("Sample result:" + result / this_ref.samples);
    });
    this.message = "Done!";
    console.log("Out-Done");*/
  }

  public downloadNetwork (filename, id) {
    const element = document.createElement("a");
    const text = (document.getElementById(id) as HTMLInputElement).value;
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public runUpdate() {
    this.$timeout.cancel(this.nextTickPromise);

    this.netManager.updateNet();
    if (this.doRefresh) {
      this.nextTickPromise = this.$timeout(this.runUpdate.bind(this), this.secondToRefresh * 1000);
    }

    console.log("aggiornato");
  }

  public setSecond() {
    this.secondToRefresh = Number(this.panel.secondToRefresh);
    if (Number.isNaN(this.secondToRefresh)) {
      this.secondToRefresh = 5;
      this.panel.secondToRefresh = 5;
    }
    if (this.secondToRefresh === 0) {
      this.secondToRefresh = 1;
      this.panel.secondToRefresh = 1;
    }
  }

  public start() {
    this.doRefresh = true;
    this.runUpdate();
  }
  public stop() {
    this.doRefresh = false;
    this.$timeout.cancel(this.nextTickPromise);
  }
  public showError (error_title: string, error_message: string) {
    // The error type can be alert-error or alert-warning, it basically just change box the icon
    // Example: appEvents.emit("alert-warning", ["Validation failed", "An error occurred doing something..."]);
    appEvents.emit("alert-error", [error_title, error_message]);
  }

  public onTextBoxRefresh() {
    this.onUpload(JSON.parse(this.panel.jsonContent));
  }

  public link (scope, element) {
  }
}
