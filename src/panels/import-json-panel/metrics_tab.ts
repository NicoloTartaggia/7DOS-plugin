// Libraries
import { RxHR } from "@akanass/rx-http-request/browser/index.js";
import _ from "lodash";
// import Remarkable = require("remarkable");

// Services & utils
import config from "grafana/app/core/config";
// import {coreModule} from "grafana/app/core/core";

// Types
import {coreModule} from "grafana/app/core/core";
import { DashboardModel } from "grafana/app/features/dashboard/model";

export class MetricsTabCtrl {
  public dsName: string;
  public panel: any;
  public panelCtrl: any;
  public datasources: Array<any>;
  public datasourceInstance: any;
  public nextRefId: string;
  public dashboard: DashboardModel;
  public panelDsValue: any;
  public addQueryDropdown: any;
  public queryTroubleshooterOpen: boolean;
  public helpOpen: boolean;
  public optionsOpen: boolean;
  public hasQueryHelp: boolean;
  public helpHtml: string;
  public queryOptions: any;

  /** @ngInject */
  constructor($scope, private $sce, datasourceSrv, private backendSrv) {
    this.panelCtrl = $scope.ctrl;
    $scope.ctrl = this;

    this.panel = this.panelCtrl.panel;
    this.panel.datasource = this.panel.datasource || null;
    this.panel.targets = this.panel.targets || [{}];

    this.dashboard = this.panelCtrl.dashboard;
    this.datasources = datasourceSrv.getMetricSources();
    this.panelDsValue = this.panelCtrl.panel.datasource;

    for (const ds of this.datasources) {
      if (ds.value === this.panelDsValue) {
        this.datasourceInstance = ds;
      }
    }

    this.addQueryDropdown = { text: "Add Query", value: null, fake: true };

    // update next ref id
    this.panelCtrl.nextRefId = this.dashboard.getNextQueryLetter(this.panel);
    this.updateDatasourceOptions();
  }

  public updateDatasourceOptions() {
    if (this.datasourceInstance) {
      this.hasQueryHelp = this.datasourceInstance.meta.hasQueryHelp;
      this.queryOptions = this.datasourceInstance.meta.queryOptions;
    }
  }

  public getOptions(includeBuiltin) {
    return Promise.resolve(
      this.datasources
        .filter((value) => {
          return includeBuiltin || !value.meta.builtIn;
        })
        .map((ds) => {
          return { value: ds.value, text: ds.name, datasource: ds };
        }),
    );
  }

  public datasourceChanged(option) {
    if (!option) {
      return;
    }

    this.setDatasource(option.datasource);
    this.updateDatasourceOptions();
  }

  public setDatasource(datasource) {
    // switching to mixed
    if (datasource.meta.mixed) {
      _.each(this.panel.targets, (target) => {
        target.datasource = this.panel.datasource;
        if (!target.datasource) {
          target.datasource = config.defaultDatasource;
        }
      });
    } else if (this.datasourceInstance && this.datasourceInstance.meta.mixed) {
      _.each(this.panel.targets, (target) => {
        delete target.datasource;
      });
    }

    this.datasourceInstance = datasource;
    this.panel.datasource = datasource.value;
    this.panel.refresh();
  }

  public addMixedQuery(option) {
    if (!option) {
      return;
    }

    this.panelCtrl.addQuery({
      datasource: option.datasource.name,
      isNew: true,
    });
    this.addQueryDropdown = { text: "Add Query", value: null, fake: true };
  }

  public addQuery() {
    this.panelCtrl.addQuery({ isNew: true });
  }

  public toggleHelp() {
    this.optionsOpen = false;
    this.queryTroubleshooterOpen = false;
    this.helpOpen = !this.helpOpen;

    this.backendSrv.get(`/api/plugins/${this.datasourceInstance.meta.id}/markdown/query_help`).then((res) => {
      // const md = new Remarkable();
      // this.helpHtml = this.$sce.trustAsHtml(md.render(res));
      this.helpHtml = this.$sce.trustAsHtml(res);

    });
  }

  public toggleOptions() {
    this.helpOpen = false;
    this.queryTroubleshooterOpen = false;
    this.optionsOpen = !this.optionsOpen;
  }

  public toggleQueryTroubleshooter() {
    this.helpOpen = false;
    this.optionsOpen = false;
    this.queryTroubleshooterOpen = !this.queryTroubleshooterOpen;
  }

  public getUrl() {
    console.log("Pre request");
    console.log(this.datasourceInstance);
    const datasourceName = this.datasourceInstance.name;
    let datasourceURL = "";
    RxHR.get("http://localhost:3000/api/datasources/name/" + datasourceName).subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          console.log(data.body);
          datasourceURL = JSON.parse(data.body).url;
          console.log("Nome: " + datasourceName + " url: " + datasourceURL);
        }
        return datasourceURL;
      },
      (err) => console.error(err),
    );
  }

  public async queryMaker() {
    const datasourceURL = await this.getUrl();
    RxHR.get(datasourceURL + "/query?db=telegraf&q=SELECT * FROM \"win_cpu\"").subscribe(
      (data) => {
        if (data.response.statusCode === 200) {
          console.log(data.body); // Show the HTML for the Google homepage.
        }
      },
      (err) => console.error(err), // Show error in console
    );
  }

  public datasourceTest() {
    this.queryMaker();
  }

}

/** @ngInject */
export function metricsTabDirective () {
  "use strict";
  return {
    controller: MetricsTabCtrl,
    restrict: "E",
    scope: true,
    templateUrl: "public/plugins/app-jsbayes/panels/import-json-panel/partials/optionTab_ConnectNetwork.html",
  };
}

coreModule.directive("metricsTab", metricsTabDirective);
