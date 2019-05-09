import appEvents from "grafana/app/core/app_events";
import {PanelCtrl} from "grafana/app/plugins/sdk";
import {WriteClient} from "../../core/write-client/WriteClient";
import {SelectDB_Directive} from "./select_ts_tab";
import {SetWriteConnection_Directive} from "./set_write_connection_tab";

import _ from "lodash";
import {NetManager} from "../../core/net-manager/NetManager";
import {NetReader} from "../../core/net-manager/reader/NetReader";
import {NetUpdater} from "../../core/net-manager/updater/NetUpdater";
import {NetWriter, SingleNetWriter} from "../../core/net-manager/writer/NetWriter";
import {NetworkAdapter} from "../../core/network/adapter/NetworkAdapter";

import {JsonNetParser} from "../../core/network/factory/JsonNetParser";

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
  public monitoring_message: string;

  // Saved data
  public saved_read_connections: boolean = false;
  public saved_write_connections: boolean = false;

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
    graph_connected_to_network: false,
    jsonContent: "",
    save_datasources: [],
    secondToRefresh: 5,
    write_datasource_id: "",
    write_db_name: "7DOS_default_DB",
  };

  // Is the monitoring running
  private is_calc_running: boolean = false;

  // Saved original graph without observe
  private saved_original_graph: JGraph = null;

  private readonly json_schema_string = '{"$schema":"http://json-schema.org/schema#","type":"object",' +
    '"properties":{"nodes":{"title":"List of Bayesian Network nodes","description":"This is the array ' +
    'that contains all the nodes of the Bayesian Network with all their details.","default":[],"type":' +
    '"array","items":{"type":"object","properties":{"name":{"title":"Name of the node in the Network",' +
    '"type":"string","minLength":1},"values":{"title":"List of values of the node","description":' +
    '"This is the array that contains all the possible values that the node can consider.","type":' +
    '"array","minItems":2,"uniqueItems":true,"items":{"type":"object","properties":{"name":{"title":' +
    '"Name of the value","type":"string","minLength":1},"type":{"title":"Type of the value","type":' +
    '"string","enum":["string","range","boolean"]},"value":{"oneOf":[{"title":"Actual value","type":' +
    '"string","minLength":1},{"title":"Actual value","type":"boolean"}]},"rangeMin":{"title":' +
    '"Minimum value of the range","type":"number","minimum":0},"rangeMax":{"oneOf":[{"title":' +
    '"Maximum value of the range","type":"number","minimum":0},{"title":"Infinite max value",' +
    '"type":"string","enum":["+inf","-inf"]}]}},"required":["name","type"],"oneOf":[{"required":' +
    '["value"]},{"required":["rangeMin","rangeMax"]}],"dependencies":{"rangeMin":["rangeMax"],' +
    '"rangeMax":["rangeMin"]},"additionalProperties":false}},"parents":{"title":' +
    '"List of parents of the node","description":"This is the array that contains all ' +
    'the parents of the current node.","type":"array","default":[],"uniqueItems":true,"items":' +
    '{"title":"Name of the parent node","type":"string","minLength":1}},"cpt":{"title":' +
    '"CPT table of the current node (2D array)","description":"This is the 2D array that ' +
    'contains the Conditional Probability Tables of the current node.","type":"array","default":' +
    '[],"items":{"type":"array","minItems":2,"items":{"type":"number","minimum":0,"maximum"' +
    ':1}}}},"additionalProperties":false,"required":["name","values","parents","cpt"]}}},' +
    '"additionalProperties":false,"required":["nodes"]}';

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
    this.monitoring_message = "Monitoring not active";
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

  // Called only on import button click, if the import doesn't throw errors, it reset the saved data
  public async upload_button_click (net) {
    await this.onUpload(net);
    console.log("[7DOS G&B][JsImportPanel]Sucesfully loaded a new network in the panel, clearing saved data...");
    if (this.panel.save_datasources.length > 0 || this.panel.write_datasource_id !== "") {
      JsImportPanel.showErrorMessage("Warning",
        "Previously saved data has been removed because a new network was imported...");
    }
    this.is_calc_running = false;
    this.panel.save_datasources = [];
    this.panel.secondToRefresh = 5;
    this.panel.write_datasource_id = "";
    this.panel.write_db_name = "7DOS_default_DB";
    console.log("[7DOS G&B][JsImportPanel]Sucesfully reset saved data to default values!");
  }

  // Called on import button click but also to re-load a saved network
  public async onUpload (net) {
    console.log("[7DOS G&B][JsImportPanel]onUpload() called");
    try {
      this.loaded_network = new JsonNetParser().createNet(JSON.stringify(net), this.json_schema_string);
      console.log("[7DOS G&B][JsImportPanel]onUpload() loaded nodes:" + this.loaded_network.getNodeList().length);
    } catch (e) {
      this.message = "Upload failed!";
      JsImportPanel.showErrorMessage("JSON load failed!",
        "Unable to load JSON network! Check the console for more information...");
      throw new Error("[7DOS G&B][JsImportPanel]onUpload() - Error parsing the JSON:" + e.toString());
    }
    this.message = "";
    this.panel.jsonContent = JSON.stringify(net, null, "\t");
    this.events.emit("data-received", null);
    this.netUpdater = new NetUpdater(this.loaded_network);
    this.netReader = new NetReader(this.loaded_network);
    // Reset saved connection booleans
    this.saved_read_connections = false;
    this.saved_write_connections = false;
    // Show success message
    this.saved_original_graph = this.loaded_network.getJgraphCopy();
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

    let g: JGraph;
    if (!this.is_calc_running || !this.panel.graph_connected_to_network) {
      g = this.saved_original_graph; // Use the original graph without observe
    } else {
      g = this.loaded_network.getJgraphCopy(); // Use the real graph with real observe
    }
    g.reinit().then(() => {
      g.sample(10000).then(() => {
        const graph: VGraph = jsbayesviz.fromGraph(g, this.panel.draw_area_id);
        const options: DrawOptions = {
          canBeObserved: true, graph: undefined,
          height: undefined, id: "", samples: 0, width: undefined,
        };
        options.id = "#" + this.panel.draw_area_id;
        options.width = 2000;
        options.height = 1000;
        options.graph = graph;
        options.samples = 1000;
        options.canBeObserved = !this.panel.graph_connected_to_network;

        console.log("[7DOS G&B][JsImportPanel]draw_network() - calling jsbayesviz.draw()");
        jsbayesviz.draw(options);
        console.log("[7DOS G&B][JsImportPanel]draw_network() - done");
      });
    });
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

  // Called on view ng-change
  public setSecond () {
    if (Number.isNaN(this.panel.secondToRefresh)) {
      this.panel.secondToRefresh = 5;
    }
    if (this.panel.secondToRefresh <= 0) {
      this.panel.secondToRefresh = 5;
    }
  }

  public start () {
    if (!this.is_calc_running) {
      if (!this.saved_read_connections) {
        console.log("[7DOS G&B][JsImportPanel]No read connections found... Can't start the monitoring");
        JsImportPanel.showErrorMessage("No read connections found",
          "Before starting the monitoring first connect your nodes to a datasource!");
        return;
      }
      if (!this.saved_write_connections) {
        console.log("[7DOS G&B][JsImportPanel]No write connections found... Can't start the monitoring");
        JsImportPanel.showErrorMessage("No write connections found",
          "Before starting the monitoring first set the write datasource!");
        return;
      }
      this.is_calc_running = true;
      this.monitoring_message = "Monitoring running!";
      this.runUpdate();
      JsImportPanel.showSuccessMessage("Successfully started the monitoring!");
      console.log("[7DOS G&B][JsImportPanel]start() - Successfully started the monitoring");
    } else {
      // Output message commented - it is not necessary to view
      // JsImportPanel.showErrorMessage("Warning", "The monitoring is already running!");
      console.error("[7DOS G&B][JsImportPanel]start() - The monitoring is already running!");
    }
  }

  public stop () {
    if (this.is_calc_running) {
      this.is_calc_running = false;
      this.monitoring_message = "Monitoring not active";
      this.$timeout.cancel(this.nextTickPromise);
      JsImportPanel.showSuccessMessage("Successfully stopped the monitoring!");
      console.log("[7DOS G&B][JsImportPanel]stop() - Successfully stopped the monitoring");
    } else {
      // Output message commented - it is not necessary to view and may appear when the user close the dashboard
      // JsImportPanel.showErrorMessage("Warning", "The monitoring is not running!");
      console.error("[7DOS G&B][JsImportPanel]stop() - The monitoring is not running!");
    }
  }

  public runUpdate () {
    this.$timeout.cancel(this.nextTickPromise);

    this.netManager.updateNet().catch((err) => {
      JsImportPanel.showErrorMessage("Error during network update",
        "An error occurred during network update. For more details, check the console.");
      console.error("[7DOS G&B][JsImportPanel]runUpdate() - updateNet() ERROR:" + err.toString());
    }).then(() => {
      if (this.panel.graph_connected_to_network) {
        // If the graph should not be updated skip the draw()
        this.draw_network();
      }
    });

    if (this.is_calc_running) {
      this.nextTickPromise = this.$timeout(this.runUpdate.bind(this), this.panel.secondToRefresh * 1000);
    } else {
      JsImportPanel.showSuccessMessage("Manual network update done!");
    }
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
