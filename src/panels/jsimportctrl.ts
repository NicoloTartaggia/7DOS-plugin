import { PanelCtrl } from 'grafana/app/plugins/sdk';
import * as _ from 'lodash';
import {diagramEditor} from './properties';



const panelDefaults = {
  JsBaesianNetwork: null ,
  content: 'graph LR\n' +
  'A[Square Rect] -- Link text --> B((Circle))\n' +
  'A --> C(Round Rect)\n' +
  'B --> D{Rhombus}\n' +
  'C --> D\n' 
};
export class JsImportCtrl extends PanelCtrl {
  static templateUrl:string = "panels/partials/module.html";
  static scrollable: boolean = true;
  textJson: string;
  time: string;
  JsBN:JSON;
  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);

    this.textJson="Inserire una rete in formato json valida";
    this.time="time";

    this.events.on('render', this.importJs.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onInitEditMode() {
		this.addEditorTab('Diagram', diagramEditor, 2);
	}

  importJs(){
    try{
      let obj = JSON.parse(this.panel.JsBaesianNetwork);	//parsing del JSON
      this.JsBN=obj;
      this.textJson="struttura valida";
    }catch(e) {
      this.textJson="struttura non valida";
      this.JsBN=JSON.parse("{}");
    }
  }

  link(scope, element) {
  }
}