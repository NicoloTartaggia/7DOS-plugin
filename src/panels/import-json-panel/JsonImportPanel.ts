import {metricsTabDirective} from "./metrics_tab";

import {PanelCtrl} from "grafana/app/plugins/sdk";

import _ from "lodash";
import {NetworkAdapter} from "../../core/network/adapter/NetworkAdapter";
import { NetManager } from "../../core/network/controller/NetManager";
import { NetReader } from "../../core/network/controller/reader/NetReader";
import { NetUpdater } from "../../core/network/controller/updater/NetUpdater";
import { NetWriter } from "../../core/network/controller/writer/Netwriter";
import {ConcreteNetworkFactory} from "../../core/network/factory/ConcreteNetworkFactory";

export class JsImportPanel extends PanelCtrl {
  public static templateUrl: string = "panels/import-json-panel/partials/panelTemplate.html";
  public static scrollable: boolean = true;

  // Test metric panel
  public scope: any;
  public datasource: any;
  public $q: any;
  public $timeout: any;
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
  public panelDefaults = {
    jsonContent: "",
  };

  constructor ($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);

    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
  }

  public onInitEditMode () {
    this.addEditorTab("JSON-Import-or-edit",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_importEditJson.html",
      1);
    this.addEditorTab("Graphic-Network-Editor",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_GraphicEditor.html",
      2);
    this.addEditorTab("Network-Connection-to-Grafana", metricsTabDirective, 3);
    this.addEditorTab("Setup-Results-Influx",
      "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_setupInflux.html",
      4);
    this.events.emit("data-received", null);

  }

  public onUpload (net) {
    console.log("On upload");
    try {
      this.loaded_network = new ConcreteNetworkFactory().parseNetwork(JSON.stringify(net));
    } catch (e) {
      this.message = "Upload fallito!";
      this.result = "Errore nella lettura del JSON, probabilmente non valido...";
      return;
    }
    this.message = "Upload riuscito con successo!";
    this.result = "Rete pronta!";
    this.panel.jsonContent = JSON.stringify(net, null, "\t");
    this.events.emit("data-received", null);
    this.netUpdater = new NetUpdater(this.loaded_network);
    this.netReader = new NetReader(this.loaded_network);
    this.netWriter = new NetWriter();

    this.netManager = new NetManager(this.netReader, this.netUpdater, this.netWriter);
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

  public link (scope, element) {
  }
}
