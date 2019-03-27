import "./graph";
import "./legend";
import "./series_overrides_ctrl";
import "./thresholds_form";
// import { JsImportPanel } from "src/panel/import-json-panel/JsImportPanel";    //

import config from "grafana/app/core/config";
import {alertTab, MetricsPanelCtrl} from "grafana/app/plugins/sdk";
import _ from "lodash";
import {axesEditorComponent} from "./axes_editor";
import {DataProcessor} from "./data_processor";
import template from "./template";

class GraphCtrl extends MetricsPanelCtrl {
  public static template = template;

  public hiddenSeries: any = {};
  public seriesList: any = [];
  public dataList: any = [];
  public annotations: any = [];
  public alertState: any;

  public panel_path: any;

  public annotationsPromise: any;
  public dataWarning: any;
  public colors: any = [];
  public subTabIndex: number;
  public processor: DataProcessor;

  public panelDefaults = {
    // series color overrides
    aliasColors: {},
    // show hide bars
    bars: false,
    // length of a dash
    dashLength: 10,
    // show/hide dashed line
    dashes: false,
    datasource: null,
    // fill factor
    fill: 1,
    // legend options
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true, // disable/enable legend
      total: false,
      values: false, // disable/enable legend values
    },
    // show/hide lines
    lines: true,
    // line width in pixels
    linewidth: 1,
    // how null points should be handled
    nullPointMode: "null",
    // stack percentage mode
    percentage: false,
    // point radius in pixels
    pointradius: 5,
    // show hide points
    points: false,
    // sets client side (flot) or native graphite png renderer (png)
    renderer: "flot",
    // other style overrides
    seriesOverrides: [],
    // length of space between two dashes
    spaceLength: 10,
    // enable/disable stacking
    stack: false,
    // staircase line mode
    steppedLine: false,
    // metric queries
    targets: [{}],
    thresholds: [],
    // time overrides
    timeFrom: null,
    timeShift: null,
    // tooltip options
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    xaxis: {
      buckets: null,
      mode: "time",
      name: null,
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        label: null,
        logBase: 1,
        max: null,
        min: null,
        show: true,
      },
      {
        format: "short",
        label: null,
        logBase: 1,
        max: null,
        min: null,
        show: true,
      },
    ],
  };

  /** @ngInject */
  constructor ($scope, $injector, private annotationsSrv) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip);
    _.defaults(this.panel.legend, this.panelDefaults.legend);
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis);

    this.processor = new DataProcessor(this.panel);

    this.events.on("render", this.onRender.bind(this));
    this.events.on("data-received", this.onDataReceived.bind(this));
    this.events.on("data-error", this.onDataError.bind(this));
    this.events.on("data-snapshot-load", this.onDataSnapshotLoad.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    this.events.on("init-panel-actions", this.onInitPanelActions.bind(this));
  }

  public onInitEditMode () {
    this.addEditorTab("Axes", axesEditorComponent, 2);
    this.addEditorTab("Legend", "public/plugins/graph-panel-template-panel/partials/tab_legend.html", 3);
    this.addEditorTab("Display", "public/plugins/graph-panel-template-panel/partials/tab_display.html", 4);

    if (config.alertingEnabled) {
      this.addEditorTab("Alert", alertTab, 5);
    }

    this.subTabIndex = 0;
  }

  public onInitPanelActions (actions) {
    actions.push({text: "Export CSV", click: "ctrl.exportCsv()"});
    actions.push({text: "Toggle legend", click: "ctrl.toggleLegend()"});
  }

  public issueQueries (datasource) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range,
    });
    return super.issueQueries(datasource);
  }

  public zoomOut (evt) {
    this.publishAppEvent("zoom-out", 2);
  }

  public onDataSnapshotLoad (snapshotData) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range,
    });
    this.onDataReceived(snapshotData);
  }

  public onDataError (err) {
    this.seriesList = [];
    this.annotations = [];
    this.render([]);
  }

  public onDataReceived (dataList) {
    this.dataList = dataList;
    this.seriesList = this.processor.getSeriesList({
      dataList,
      range: this.range,
    });

    this.dataWarning = null;
    const datapointsCount = this.seriesList.reduce((prev, series) => {
      return prev + series.datapoints.length;
    }, 0);

    if (datapointsCount === 0) {
      this.dataWarning = {
        tip: "No datapoints returned from data query",
        title: "No data points",
      };
    } else {
      for (const series of this.seriesList) {
        if (series.isOutsideRange) {
          this.dataWarning = {
            tip: "Can be caused by timezone mismatch or missing time filter in query",
            title: "Data points outside time range",
          };
          break;
        }
      }
    }

    this.annotationsPromise.then(
      (result) => {
        this.loading = false;
        this.alertState = result.alertState;
        this.annotations = result.annotations;
        this.render(this.seriesList);
      },
      () => {
        this.loading = false;
        this.render(this.seriesList);
      },
    );
  }

  public onRender () {
    if (!this.seriesList) {
      return;
    }

    for (const series of this.seriesList) {
      series.applySeriesOverrides(this.panel.seriesOverrides);

      if (series.unit) {
        this.panel.yaxes[series.yaxis - 1].format = series.unit;
      }
    }
  }

  public changeSeriesColor (series, color) {
    series.color = color;
    this.panel.aliasColors[series.alias] = series.color;
    this.render();
  }

  public toggleSeries (serie, event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (this.hiddenSeries[serie.alias]) {
        delete this.hiddenSeries[serie.alias];
      } else {
        this.hiddenSeries[serie.alias] = true;
      }
    } else {
      this.toggleSeriesExclusiveMode(serie);
    }
    this.render();
  }

  public toggleSeriesExclusiveMode (serie) {
    const hidden = this.hiddenSeries;

    if (hidden[serie.alias]) {
      delete hidden[serie.alias];
    }

    // check if every other series is hidden
    const alreadyExclusive = _.every(this.seriesList, (value) => {
      if (value.alias === serie.alias) {
        return true;
      }

      return hidden[value.alias];
    });

    if (alreadyExclusive) {
      // remove all hidden series
      _.each(this.seriesList, (value) => {
        delete this.hiddenSeries[value.alias];
      });
    } else {
      // hide all but this serie
      _.each(this.seriesList, (value) => {
        if (value.alias === serie.alias) {
          return;
        }

        this.hiddenSeries[value.alias] = true;
      });
    }
  }

  public toggleAxis (info) {
    let override = _.find(this.panel.seriesOverrides, {alias: info.alias});
    if (!override) {
      override = {alias: info.alias};
      this.panel.seriesOverrides.push(override);
    }
    // info.yaxis = override.yaxis = info.yaxis === 2 ? 1 : 2;
    this.render();
  }

  public addSeriesOverride (override) {
    this.panel.seriesOverrides.push(override || {});
  }

  public removeSeriesOverride (override) {
    this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override);
    this.render();
  }

  public toggleLegend () {
    this.panel.legend.show = !this.panel.legend.show;
    this.refresh();
  }

  public legendValuesOptionChanged () {
    const legend = this.panel.legend;
    legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
    this.render();
  }

  public exportCsv () {
    const scope = this.$scope.$new(true);
    scope.seriesList = this.seriesList;
    this.publishAppEvent("show-modal", {
      modalClass: "modal--narrow",
      scope,
      templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
    });
  }

  get panelPath () {
    if (this.panel_path === undefined) {
      this.panel_path = "/public/plugins/" + this.pluginId + "/";
    }
    return this.panel_path;
  }
}

export {GraphCtrl, GraphCtrl as PanelCtrl};
