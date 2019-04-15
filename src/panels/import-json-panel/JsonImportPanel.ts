import appEvents from "grafana/app/core/app_events";
import {PanelCtrl} from "grafana/app/plugins/sdk";
import {WriteClient} from "../../core/write-client/WriteClient";
import {ConcreteWriteClientFactory} from "../../core/write-client/WriteClientFactory";
import {SelectDB_Directive} from "./select_ts_tab";
import {SetWriteConnection_Directive} from "./set_write_connection_tab";

import _ from "lodash";
import {NetManager} from "../../core/net-manager/NetManager";
import {NetReader} from "../../core/net-manager/reader/NetReader";
import {NetUpdater} from "../../core/net-manager/updater/NetUpdater";
import {NetWriter, SingleNetWriter} from "../../core/net-manager/writer/NetWriter";
import {NetworkAdapter} from "../../core/network/adapter/NetworkAdapter";
import {ConcreteNetworkFactory} from "../../core/network/factory/ConcreteNetworkFactory";

import jsbayes from "jsbayes";
import jsbayesviz = require("jsbayes-viz");

export class JsImportPanel extends PanelCtrl {
  public static templateUrl: string = "panels/import-json-panel/partials/panelTemplate.html";
  public static scrollable: boolean = true;

  public static showErrorMessage (error_title: string, error_message: string) {
    // The error type can be alert-error or alert-warning, it basically just change box the icon
    // Example: appEvents.emit("alert-warning", ["Validation failed", "An error occurred doing something..."]);
    appEvents.emit("alert-error", [error_title, error_message]);
  }

  public static showSuccessMessage (success_message: string, success_title: string = "Success") {
    appEvents.emit("alert-success", [success_title, success_message]);
  }

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

  public secondToRefresh: number;
  public nextTickPromise: any;
  public panelDefaults = {
    is_calc_running: false,
    jsonContent: "",
    save_datasources: [],
    secondToRefresh: 5,
    write_datasource_id: "",
    write_db_name: "7DOS_default_DB",
  };

  constructor ($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);
    this.secondToRefresh = 5;

    this.events.on("panel-teardown", this.stop.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    console.log("On constructor");
    if (this.panel.jsonContent !== "") {
      this.onTextBoxRefresh();
    }
    /*if (this.panel.is_calc_running) {
      // TODO FINISH THIS - TO AUTO RESTART WE MUST RI-CREATE THE OBJECTS
      this.start();
    }*/

    this.nextTickPromise = this.$timeout(this.late_draw.bind(this), 10 * 1000);
    console.log("time set");
  }

  public late_draw() {
    console.log("called");
    const g = jsbayes.newGraph();
    const n1 = g.addNode("n1", ["true", "false"]);
    const n2 = g.addNode("n2", ["true", "false"]);
    const n3 = g.addNode("n3", ["true", "false"]);

    n2.addParent(n1);
    n3.addParent(n2);
    g.reinit();
    g.sample(10000);

    const graph: VGraph = jsbayesviz.fromGraph(g);
    console.log(graph);
    const options: DrawOptions = {graph: undefined, height: undefined, id: "", samples: 0, width: undefined};
    options.id = "bbn";
    options.width = 800;
    options.height = 800;
    options.graph = graph;
    options.samples = 1000;
    console.log(options);

    console.log("Pre-draw");
    const obj = (document.getElementById("bbn") as HTMLObjectElement);
    console.log(obj);
    console.log("ready?");
    console.log("this log");
    console.log(document.getElementById("bbn"));
    jsbayesviz.draw(options);
  }

  public onInitEditMode () {
    this.addEditorTab("Manage network",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_importEditJson.html",
      1);
    this.addEditorTab("Connect nodes", SelectDB_Directive, 2);
    this.addEditorTab("Destination datasource", SetWriteConnection_Directive, 3);
    this.addEditorTab("Manage monitoring",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/network_Calculation_SetUp.html",
      4);

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
    // Show success message
    JsImportPanel.showSuccessMessage("Bayesian network loaded successfully!");
  }

  public async updateNetWriter (write_client: WriteClient) {
    console.log("updateNetWriter() - Updating net writer");
    this.netWriter = new SingleNetWriter(write_client);
    this.netManager = new NetManager(this.netReader, this.netUpdater, this.netWriter);
    console.log("updateNetWriter() - done");
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

  public onTextBoxRefresh () {
    this.onUpload(JSON.parse(this.panel.jsonContent));
  }

  // ------------------------------------------------------
  // Continuous update functions
  // ------------------------------------------------------

  public runUpdate () {
    this.$timeout.cancel(this.nextTickPromise);

    this.netManager.updateNet();
    if (this.panel.is_calc_running) {
      this.nextTickPromise = this.$timeout(this.runUpdate.bind(this), this.secondToRefresh * 1000);
    }

    console.log("aggiornato");
  }

  public setSecond () {
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

  public start () {
    this.panel.is_calc_running = true;
    this.runUpdate();
  }

  public stop () {
    this.panel.is_calc_running = false;
    this.$timeout.cancel(this.nextTickPromise);
  }

  public link (scope, element) {
  }
}
