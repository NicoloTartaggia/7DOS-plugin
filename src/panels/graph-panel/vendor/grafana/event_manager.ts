import { MetricsPanelCtrl } from "grafana/app/plugins/sdk";
import { AnnotationEvent } from "./event";

import _ from "lodash";
import moment from "moment";
import tinycolor from "tinycolor2";

import {
  ALERTING_COLOR,
  DEFAULT_ANNOTATION_COLOR,
  NO_DATA_COLOR,
  OK_COLOR,
  REGION_FILL_ALPHA,
} from "./colors";

export class EventManager {
  public event: AnnotationEvent;
  public editorOpen: boolean;

  constructor(private panelCtrl: MetricsPanelCtrl) { }

  public editorClosed() {
    this.event = null;
    this.editorOpen = false;
    this.panelCtrl.render();
  }

  public editorOpened() {
    this.editorOpen = true;
  }

  public updateTime(range) {
    if (!this.event) {
      this.event = new AnnotationEvent();
      this.event.dashboardId = this.panelCtrl.dashboard.id;
      this.event.panelId = this.panelCtrl.panel.id;
    }

    // update time
    this.event.time = moment(range.from);
    this.event.isRegion = false;
    if (range.to) {
      this.event.timeEnd = moment(range.to);
      this.event.isRegion = true;
    }

    this.panelCtrl.render();
  }

  public editEvent(event, elem?) {
    this.event = event;
    this.panelCtrl.render();
  }

  public addFlotEvents(annotations, flotOptions) {
    if (!this.event && annotations.length === 0) {
      return;
    }

    const types = {
      $__alerting: {
        color: ALERTING_COLOR,
        markerSize: 5,
        position: "BOTTOM",
      },
      $__editing: {
        color: DEFAULT_ANNOTATION_COLOR,
        markerSize: 5,
        position: "BOTTOM",
      },
      $__no_data: {
        color: NO_DATA_COLOR,
        markerSize: 5,
        position: "BOTTOM",
      },
      $__ok: {
        color: OK_COLOR,
        markerSize: 5,
        position: "BOTTOM",
      },
    };

    if (this.event) {
      if (this.event.isRegion) {
        annotations = [
          {
            editModel: this.event,
            eventType: "$__editing",
            isRegion: true,
            min: this.event.time.valueOf(),
            text: this.event.text,
            timeEnd: this.event.timeEnd.valueOf(),
          },
        ];
      } else {
        annotations = [
          {
            editModel: this.event,
            eventType: "$__editing",
            min: this.event.time.valueOf(),
            text: this.event.text,
          },
        ];
      }
    } else {
      // annotations from query
      for (const item of annotations) {
        // add properties used by jquery flot events
        item.min = item.time;
        item.max = item.time;
        item.eventType = item.source.name;

        if (item.newState) {
          item.eventType = "$__" + item.newState;
          continue;
        }

        if (!types[item.source.name]) {
          types[item.source.name] = {
            color: item.source.iconColor,
            markerSize: 5,
            position: "BOTTOM",
          };
        }
      }
    }

    const regions = getRegions(annotations);
    addRegionMarking(regions, flotOptions);

    const eventSectionHeight = 20;
    const eventSectionMargin = 7;
    flotOptions.grid.eventSectionHeight = eventSectionMargin;
    flotOptions.xaxis.eventSectionHeight = eventSectionHeight;

    flotOptions.events = {
      data: annotations,
      levels: _.keys(types).length + 1,
      manager: this,
      types,
    };
  }
}

function getRegions (events) {
  return _.filter(events, "isRegion");
}

function addRegionMarking (regions, flotOptions) {
  const markings = flotOptions.grid.markings;
  const defaultColor = DEFAULT_ANNOTATION_COLOR;
  let fillColor;

  _.each(regions, (region) => {
    if (region.source) {
      fillColor = region.source.iconColor || defaultColor;
    } else {
      fillColor = defaultColor;
    }

    fillColor = addAlphaToRGB(fillColor, REGION_FILL_ALPHA);
    markings.push({
      color: fillColor,
      xaxis: { from: region.min, to: region.timeEnd },
    });
  });
}

function addAlphaToRGB (colorString: string, alpha: number): string {
  const color = tinycolor(colorString);
  if (color.isValid()) {
    color.setAlpha(alpha);
    return color.toRgbString();
  } else {
    return colorString;
  }
}
