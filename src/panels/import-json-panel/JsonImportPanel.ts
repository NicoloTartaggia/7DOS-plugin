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

import jsbayesviz = require("better-jsbayes-viz");

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

  // Panel output string
  public message: string;

  // Form
  public node_name: string;
  public observe_value: string;
  public samples: number = 1000;
  public loaded_network: NetworkAdapter;
  public netManager: NetManager;
  public netReader: NetReader;
  public netUpdater: NetUpdater;
  public netWriter: NetWriter;
  public nextTickPromise: any;
  public panelDefaults = {
    draw_area_id: "",
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

    this.events.on("panel-teardown", this.stop.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    // Generate an unique id for the <svg> element
    this.generate_draw_area_id();
    // Load data
    if (this.panel.jsonContent !== "") {
      this.message = "";
      this.onTextBoxRefresh();
    } else {
      this.message = "Open 'edit' window to configure panel with a Bayesian network";
    }
    /*if (this.panel.is_calc_running) {
      // TODO FINISH THIS - TO AUTO RESTART WE MUST RI-CREATE THE OBJECTS
      this.start();
    }*/
    console.log("[7DOS G&B][JsImportPanel]Panel Constructor() done");
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
    console.log("[7DOS G&B][JsImportPanel]onUpload() called");
    try {
      this.loaded_network = new ConcreteNetworkFactory().parseNetwork(JSON.stringify(net));
      console.log("[7DOS G&B][JsImportPanel]onUpload() loaded nodes:" + this.loaded_network.getNodeList().length);
    } catch (e) {
      this.message = "Upload failed!";
      JsImportPanel.showErrorMessage("JSON load failed!",
        "Unable to load JSON! Error:" + e.toString());
      throw new Error("[7DOS G&B][JsImportPanel]onUpload() - Error parsing the JSON:" + e.toString());
    }
    this.message = "";
    this.panel.jsonContent = JSON.stringify(net, null, "\t");
    this.events.emit("data-received", null);
    this.netUpdater = new NetUpdater(this.loaded_network);
    this.netReader = new NetReader(this.loaded_network);
    this.netWriter = new SingleNetWriter(await new ConcreteWriteClientFactory()
      .makeInfluxWriteClient("http://localhost", "8086", "myDB"));
    this.netManager = new NetManager(this.netReader, this.netUpdater, this.netWriter);
    // Show success message
    this.draw_network();
    JsImportPanel.showSuccessMessage("Bayesian network loaded successfully!");
  }

  public async updateNetWriter (write_client: WriteClient) {
    console.log("[7DOS G&B][JsImportPanel]updateNetWriter() - Updating net writer");
    this.netWriter = new SingleNetWriter(write_client);
    this.netManager = new NetManager(this.netReader, this.netUpdater, this.netWriter);
    console.log("[7DOS G&B][JsImportPanel]updateNetWriter() - done");
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
  // Network draw
  // ------------------------------------------------------

  public draw_network () {
    console.log("[7DOS G&B][JsImportPanel]draw_network()");
    if (document.getElementById(this.panel.draw_area_id) == null) {
      console.log("[7DOS G&B][JsImportPanel]draw_network(): Element is null - waiting 0.1s");
      this.nextTickPromise = this.$timeout(this.draw_network.bind(this), 0.1 * 1000);
    }
    // Clear current draw
    this.clear_current_draw();

    const g = this.loaded_network.getJgraphCopy();
    g.reinit();
    g.sample(10000);

    const graph: VGraph = jsbayesviz.fromGraph(g, this.panel.draw_area_id);
    const options: DrawOptions = {graph: undefined, height: undefined, id: "", samples: 0, width: undefined};
    options.id = "#" + this.panel.draw_area_id;
    options.width = 2000;
    options.height = 1000;
    options.graph = graph;
    options.samples = 1000;

    console.log("[7DOS G&B][JsImportPanel]draw_network() - calling jsbayesviz.draw()");
    jsbayesviz.draw(options);
    console.log("[7DOS G&B][JsImportPanel]draw_network() - done");
  }

  public clear_current_draw () {
    const ogg = (document.getElementById(this.panel.draw_area_id) as HTMLObjectElement);
    if (ogg != null) {
      // If the element exist, clear it, removing all its children
      console.log("[7DOS G&B][JsImportPanel]clear_current_draw() - starting");
      while (ogg.childElementCount > 0) {
        ogg.removeChild(ogg.lastChild);
      }
      console.log("[7DOS G&B][JsImportPanel]clear_current_draw() - done");
    }
  }

  // ------------------------------------------------------
  // Continuous update functions
  // ------------------------------------------------------

  public runUpdate () {
    this.$timeout.cancel(this.nextTickPromise);

    this.netManager.updateNet().catch((err) => {
      JsImportPanel.showErrorMessage("Error during network update",
        "An error occurred during network update, check you have saved " +
        "all the connections with read and write datasources. For more details, check the console.");
      console.error("[7DOS G&B][JsImportPanel]runUpdate() - updateNet() ERROR:" + err.toString());
    });

    if (this.panel.is_calc_running) {
      this.nextTickPromise = this.$timeout(this.runUpdate.bind(this), this.panel.secondToRefresh * 1000);
    } else {
      JsImportPanel.showSuccessMessage("Manual network update done!");
    }
  }

  public setSecond () {
    if (Number.isNaN(this.panel.secondToRefresh)) {
      this.panel.secondToRefresh = 5;
    }
    if (this.panel.secondToRefresh <= 0) {
      this.panel.secondToRefresh = 1;
    }
  }

  public start () {
    this.panel.is_calc_running = true;
    this.runUpdate();
    JsImportPanel.showSuccessMessage("Successfully started the monitoring!");
  }

  public stop () {
    this.panel.is_calc_running = false;
    this.$timeout.cancel(this.nextTickPromise);
    JsImportPanel.showSuccessMessage("Successfully stopped the monitoring!");
  }

  public link (scope, element) {
  }

  private generate_draw_area_id (): void {
    if (this.panel.draw_area_id === "") {
      let text = "";
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (let i = 0; i < 5; i++) {
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      // Generate a random id made of 5 random chars and the panel id
      this.panel.draw_area_id = text + this.panel.id.toString();
    }
  }
}
