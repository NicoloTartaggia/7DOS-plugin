import {PanelCtrl} from 'grafana/app/plugins/sdk';
import {SingleValue, Network} from "./JsonManager";


export class JsImportPanel extends PanelCtrl {
  static templateUrl:string = "panels/import-json-panel/html-structure/template.html";
  static scrollable: boolean = true;
  //Tests strings
  message: string;
  result: string;
  jsonContent: string;
  //Form
  node_name:string;
  observe_value:string;
  samples:number = 1000;
  //loaded network
  LoadedNetwork : Network;
  //Currently loaded json - still not used
  JsBN:JSON;

  constructor($scope, $injector) {
    super($scope, $injector);
  }

  onUpload(net) {
    console.log("On upload");
    try{
      this.LoadedNetwork = new Network(JSON.stringify(net));
    }catch(e){
      this.message="Upload fallito!";
      this.result="Errore nella lettura del JSON, probabilmente non valido...";
      return
    }
    this.message="Upload riuscito con successo!";
    this.result="Rete JSON pronta al calcolo dei sample!";
    this.jsonContent=JSON.stringify(net);
  }

  onSubmit(){
    console.log("onSubmit() called");
    console.log("Node name:"+this.node_name);
    console.log("observe value:"+this.observe_value);
    console.log("Samples:"+this.samples);
    this.message="Calculating...";
    this.LoadedNetwork.observe(this.node_name, new SingleValue(this.observe_value, "0"));
    let sample_promise = this.LoadedNetwork.sample(this.samples);
    let this_ref = this;
    let sample_result = -1;
    sample_promise.then(function (result) {
      sample_result = result / this_ref.samples;
      console.log(sample_result);
      this_ref.result = "Samples calculation done!";
      alert("Sample result:"+result / this_ref.samples)
    });
    this.message="Done!";
    console.log("Out-Done");
  }

  link(scope, element) {
  }
}