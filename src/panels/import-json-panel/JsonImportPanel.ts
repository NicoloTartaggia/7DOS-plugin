import {RxHR} from "@akanass/rx-http-request/browser/index.js";
import {MetricsPanelCtrl} from "grafana/app/plugins/sdk";

import _ = require("lodash");

import {Network, SingleValue} from "./JsonManager";
import { metricsTabDirective } from "./metrics_tab";

export class JsImportPanel extends MetricsPanelCtrl {
  public static templateUrl: string = "panels/import-json-panel/partials/panelTemplate.html";
  public static scrollable: boolean = true;

  public panelDefaults = {
    jsonContent: "",
  };
  // Tests strings
  public message: string;
  public result: string;

  // Form
  public node_name: string;
  public observe_value: string;
  public samples: number = 1000;
  // loaded network
  public loaded_network: Network;

  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
  }

  public onInitEditMode() {

    const test = [this.editorTabs[0]];
    this.editorTabs = test;
    this.addEditorTab("JSON-Import-or-edit",
      "public/plugins/jsbayes-app/panels/import-json-panel/partials/optionTab_importEditJson.html",
      1);
    this.addEditorTab("Graphic-Network-Editor",
      "public/plugins/jsbayes-app/panels/import-json-panel/partials/optionTab_GraphicEditor.html",
      2);
    this.addEditorTab("Network-Connection-to-Grafana",
    metricsTabDirective, 3);

  }

  public onUpload(net) {
    console.log("On upload");
    try {
      this.loaded_network = new Network(JSON.stringify(net));
    } catch (e) {
      this.message = "Upload fallito!";
      this.result = "Errore nella lettura del JSON, probabilmente non valido...";
      return;
    }
    this.message = "Upload riuscito con successo!";
    this.result = "Rete pronta!";
    this.panel.jsonContent = JSON.stringify(net);
    this.events.emit("data-received", null);

  }

  public onSubmit() { // Currently not used
    console.log("onSubmit() called");
    console.log("Node name:" + this.node_name);
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
    console.log("Out-Done");
  }

  public downloadNetwork(filename, id) {
    const element = document.createElement("a");
    const text = (document.getElementById(id) as HTMLInputElement).value;
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public datasourceTest() {
    console.log("Pre request");
    RxHR.get("http://localhost:8086/query?db=telegraf&q=SELECT * FROM \"win_cpu\"").subscribe(
      (data) => {

        if (data.response.statusCode === 200) {
          console.log(data.body); // Show the HTML for the Google homepage.
        }
      },
      (err) => console.error(err), // Show error in console
    );
  }

  public link(scope, element) {
  }
}
