import kbn from "grafana/app/core/utils/kbn";

export class AxesEditorCtrl {
  private panel: any;
  private panelCtrl: any;
  private unitFormats: any;
  private logScales: any;
  private xAxisModes: any;
  private xAxisStatOptions: any;
  private xNameSegment: any;

  constructor (private $scope, private $q) {
    this.panelCtrl = $scope.ctrl;
    this.panel = this.panelCtrl.panel;
    this.$scope.ctrl = this;

    this.unitFormats = kbn.getUnitFormats();

    this.logScales = {
      "linear": 1,
      "log (base 10)": 10,
      "log (base 1024)": 1024,
      "log (base 2)": 2,
      "log (base 32)": 32,
    };

    this.xAxisModes = {
      Histogram: "histogram",
      Series: "series",
      Time: "time",
      // 'Data field': 'field',
    };

    this.xAxisStatOptions = [
      {text: "Avg", value: "avg"},
      {text: "Min", value: "min"},
      {text: "Max", value: "max"},
      {text: "Total", value: "total"},
      {text: "Count", value: "count"},
      {text: "Current", value: "current"},
    ];

    if (this.panel.xaxis.mode === "custom") {
      if (!this.panel.xaxis.name) {
        this.panel.xaxis.name = "specify field";
      }
    }
  }

  public setUnitFormat (axis, subItem) {
    axis.format = subItem.value;
    this.panelCtrl.render();
  }

  public render () {
    this.panelCtrl.render();
  }

  public xAxisModeChanged () {
    this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode();
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  public xAxisValueChanged () {
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  public getDataFieldNames (onlyNumbers) {
    const props = this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList, onlyNumbers);
    const items = props.map((prop) => {
      return {text: prop, value: prop};
    });

    return this.$q.when(items);
  }
}

export function axesEditorComponent () {
  "use strict";
  return {
    controller: AxesEditorCtrl,
    restrict: "E",
    scope: true,
    templateUrl: "public/plugins/graph-panel-template-panel/partials/axes_editor.html",
  };
}
