import {appEvents, coreModule} from "grafana/app/core/core";
import kbn from "grafana/app/core/utils/kbn";
import "grafana/vendor/flot/jquery.flot.crosshair.js";
import "grafana/vendor/flot/jquery.flot.dashes.js";
import "grafana/vendor/flot/jquery.flot.fillbelow.js";
import "grafana/vendor/flot/jquery.flot.gauge.js";
import "grafana/vendor/flot/jquery.flot.js";
import "grafana/vendor/flot/jquery.flot.pie.js";

import "grafana/vendor/flot/jquery.flot.selection.js";
import "grafana/vendor/flot/jquery.flot.stack.js";
import "grafana/vendor/flot/jquery.flot.stackpercent.js";
import "grafana/vendor/flot/jquery.flot.time.js";
import * as $ from "jquery";
import _ from "lodash";
import moment from "moment";
import GraphTooltip from "./graph_tooltip";
import {convertValuesToHistogram, getSeriesValues} from "./histogram";
import {ThresholdManager} from "./threshold_manager";

import "./vendor/flot/jquery.flot.events";
import {EventManager} from "./vendor/grafana/event_manager";
import {tickStep} from "./vendor/grafana/ticks";
import {updateLegendValues} from "./vendor/grafana/time_series2";

function graphDirective (timeSrv, popoverSrv, contextSrv) {
  return {
    link (scope, elem) {
      const ctrl = scope.ctrl;
      const dashboard = ctrl.dashboard;
      const panel = ctrl.panel;
      let annotations = [];
      let data;
      let plot;
      let sortedSeries;
      let panelWidth = 0;
      const eventManager = new EventManager(ctrl);
      let thresholdManager = new ThresholdManager(ctrl);
      const tooltip = new GraphTooltip(elem, dashboard, scope, function () {
        return sortedSeries;
      });

      // panel events
      ctrl.events.on("panel-teardown", () => {
        thresholdManager = null;

        if (plot) {
          plot.destroy();
          plot = null;
        }
      });

      /**
       * Split graph rendering into two parts.
       * First, calculate series stats in buildFlotPairs() function. Then legend rendering started
       * (see ctrl.events.on("render") in legend.ts).
       * When legend is rendered it emits "legend-rendering-complete" and graph rendered.
       */
      ctrl.events.on("render", (renderData) => {
        data = renderData || data;
        if (!data) {
          return;
        }
        annotations = ctrl.annotations || [];
        buildFlotPairs(data);
        updateLegendValues(data, panel);

        ctrl.events.emit("render-legend");
      });

      ctrl.events.on("legend-rendering-complete", () => {
        render_panel();
      });

      // global events
      appEvents.on(
        "graph-hover",
        (evt) => {
          // ignore other graph hover events if shared tooltip is disabled
          if (!dashboard.sharedTooltipModeEnabled()) {
            return;
          }

          // ignore if we are the emitter
          if (!plot || evt.panel.id === panel.id || ctrl.otherPanelInFullscreenMode()) {
            return;
          }

          tooltip.show(evt.pos);
        },
        scope,
      );

      appEvents.on(
        "graph-hover-clear",
        (event, info) => {
          if (plot) {
            tooltip.clear(plot);
          }
        },
        scope,
      );

      function shouldAbortRender () {
        if (!data) {
          return true;
        }

        return panelWidth === 0;

      }

      function drawHook (plot) {
        // add left axis labels
        if (panel.yaxes[0].label && panel.yaxes[0].show) {
          $("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>")
            .text(panel.yaxes[0].label)
            .appendTo(elem);
        }

        // add right axis labels
        if (panel.yaxes[1].label && panel.yaxes[1].show) {
          $("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>")
            .text(panel.yaxes[1].label)
            .appendTo(elem);
        }

        if (ctrl.dataWarning) {
          $(`<div class="datapoints-warning flot-temp-elem">${ctrl.dataWarning.title}</div>`).appendTo(elem);
        }

        thresholdManager.draw(plot);
      }

      function processOffsetHook (plot, gridMargin) {
        const left = panel.yaxes[0];
        const right = panel.yaxes[1];
        if (left.show && left.label) {
          gridMargin.left = 20;
        }
        if (right.show && right.label) {
          gridMargin.right = 20;
        }

        // apply y-axis min/max options
        const yaxis = plot.getYAxes();
        for (let i = 0; i < yaxis.length; i++) {
          const axis = yaxis[i];
          const panelOptions = panel.yaxes[i];
          axis.options.max = axis.options.max !== null ? axis.options.max : panelOptions.max;
          axis.options.min = axis.options.min !== null ? axis.options.min : panelOptions.min;
        }
      }

      // Series could have different timeSteps,
      // let's find the smallest one so that bars are correctly rendered.
      // In addition, only take series which are rendered as bars for this.
      function getMinTimeStepOfSeries (data) {
        let min = Number.MAX_VALUE;

        for (const current_data of data) {
          if (!current_data.stats.timeStep) {
            continue;
          }
          if (panel.bars) {
            if (current_data.bars && current_data.bars.show === false) {
              continue;
            }
          } else {
            if (typeof current_data.bars === "undefined" ||
              typeof current_data.bars.show === "undefined" ||
              !current_data.bars.show) {
              continue;
            }
          }

          if (current_data.stats.timeStep < min) {
            min = current_data.stats.timeStep;
          }
        }

        return min;
      }

      // Function for rendering panel
      function render_panel () {
        panelWidth = elem.width();
        if (shouldAbortRender()) {
          return;
        }

        // give space to alert editing
        thresholdManager.prepare(elem, data);

        // un-check dashes if lines are unchecked
        panel.dashes = panel.lines ? panel.dashes : false;

        // Populate element
        const options: any = buildFlotOptions(panel);
        prepareXAxis(options, panel);
        configureYAxisOptions(data, options);
        thresholdManager.addFlotOptions(options, panel);
        eventManager.addFlotEvents(annotations, options);

        sortedSeries = sortSeries(data, panel);
        callPlot(options, true);
      }

      function buildFlotPairs (data) {
        for (const serie of data) {
          serie.data = serie.getFlotPairs(serie.nullPointMode || panel.nullPointMode);

          // if hidden remove points and disable stack
          if (ctrl.hiddenSeries[serie.alias]) {
            serie.data = [];
            serie.stack = false;
          }
        }
      }

      function prepareXAxis (options, panel) {
        switch (panel.xaxis.mode) {
          case "series": {
            options.series.bars.barWidth = 0.7;
            options.series.bars.align = "center";

            for (let i = 0; i < data.length; i++) {
              const series = data[i];
              series.data = [[i + 1, series.stats[panel.xaxis.values[0]]]];
            }

            addXSeriesAxis(options);
            break;
          }
          case "histogram": {
            let bucketSize: number;
            const values = getSeriesValues(data);

            if (data.length && values.length) {
              const histMin = _.min(_.map(data, (s: any) => s.stats.min));
              const histMax = _.max(_.map(data, (s: any) => s.stats.max));
              const ticks = panel.xaxis.buckets || panelWidth / 50;
              bucketSize = tickStep(histMin, histMax, ticks);
              const histogram = convertValuesToHistogram(values, bucketSize);
              data[0].data = histogram;
              options.series.bars.barWidth = bucketSize * 0.8;
            } else {
              bucketSize = 0;
            }

            addXHistogramAxis(options, bucketSize);
            break;
          }
          case "table": {
            options.series.bars.barWidth = 0.7;
            options.series.bars.align = "center";
            addXTableAxis(options);
            break;
          }
          default: {
            options.series.bars.barWidth = getMinTimeStepOfSeries(data) / 1.5;
            addTimeAxis(options);
            break;
          }
        }
      }

      function callPlot (options, incrementRenderCounter) {
        try {
          plot = $.plot(elem, sortedSeries, options);
          if (ctrl.renderError) {
            delete ctrl.error;
            delete ctrl.inspector;
          }
        } catch (e) {
          console.log("flotcharts error", e);
          ctrl.error = e.message || "Render Error";
          ctrl.renderError = true;
          ctrl.inspector = {error: e};
        }

        if (incrementRenderCounter) {
          ctrl.renderingCompleted();
        }
      }

      function buildFlotOptions (panel) {
        const stack = panel.stack ? true : null;
        return {
          crosshair: {
            mode: "x",
          },
          dashes: {
            dashLength: [panel.dashLength, panel.spaceLength],
            lineWidth: panel.linewidth,
            show: panel.dashes,
          },
          grid: {
            backgroundColor: null,
            borderWidth: 0,
            clickable: true,
            color: "#c8c8c8",
            hoverable: true,
            labelMarginX: 0,
            margin: {left: 0, right: 0},
            markings: [],
            minBorderMargin: 0,
          },
          hooks: {
            draw: [drawHook],
            processOffset: [processOffsetHook],
          },
          legend: {show: false},
          selection: {
            color: "#666",
            mode: "x",
          },
          series: {
            bars: {
              barWidth: 1,
              fill: 1,
              lineWidth: 0,
              show: panel.bars,
              zero: false,
            },
            lines: {
              fill: translateFillOption(panel.fill),
              lineWidth: panel.dashes ? 0 : panel.linewidth,
              show: panel.lines,
              steps: panel.steppedLine,
              zero: false,
            },
            points: {
              fill: 1,
              fillColor: false,
              radius: panel.points ? panel.pointradius : 2,
              show: panel.points,
            },
            shadowSize: 0,
            stack: panel.percentage ? null : stack,
            stackpercent: panel.stack ? panel.percentage : false,
          },
          xaxis: {},
          yaxes: [],
        };
      }

      function sortSeries (series, panel) {
        const sortBy = panel.legend.sort;
        const sortOrder = panel.legend.sortDesc;
        const haveSortBy = sortBy !== null || sortBy !== undefined;
        const haveSortOrder = sortOrder !== null || sortOrder !== undefined;
        const shouldSortBy = panel.stack && haveSortBy && haveSortOrder;
        const sortDesc = panel.legend.sortDesc === true ? -1 : 1;

        series.sort((x, y) => {
          if (x.zindex > y.zindex) {
            return 1;
          }

          if (x.zindex < y.zindex) {
            return -1;
          }

          if (shouldSortBy) {
            if (x.stats[sortBy] > y.stats[sortBy]) {
              return sortDesc;
            }
            if (x.stats[sortBy] < y.stats[sortBy]) {
              return -1 * sortDesc;
            }
          }

          return 0;
        });

        return series;
      }

      function translateFillOption (fill) {
        if (panel.percentage && panel.stack) {
          return fill === 0 ? 0.001 : fill / 10;
        } else {
          return fill / 10;
        }
      }

      function addTimeAxis (options) {
        const ticks = panelWidth / 100;
        const min = _.isUndefined(ctrl.range.from) ? null : ctrl.range.from.valueOf();
        const max = _.isUndefined(ctrl.range.to) ? null : ctrl.range.to.valueOf();

        options.xaxis = {
          label: "Datetime",
          max,
          min,
          mode: "time",
          show: panel.xaxis.show,
          ticks,
          timeformat: time_format(ticks, min, max),
          timezone: dashboard.getTimezone(),
        };
      }

      function addXSeriesAxis (options) {
        const ticks = _.map(data, function (series: any, index) {
          return [index + 1, series.alias];
        });

        options.xaxis = {
          label: "Datetime",
          max: ticks.length + 1,
          min: 0,
          mode: null,
          show: panel.xaxis.show,
          ticks,
          timezone: dashboard.getTimezone(),
        };
      }

      function addXHistogramAxis (options, bucketSize) {
        let ticks;
        let min;
        let max;
        const defaultTicks = panelWidth / 50;

        if (data.length && bucketSize) {
          ticks = _.map(data[0].data, (point) => point[0]);
          min = _.min(ticks);
          max = _.max(ticks);

          // Adjust tick step
          let tickStep = bucketSize;
          let ticks_num = Math.floor((max - min) / tickStep);
          while (ticks_num > defaultTicks) {
            tickStep = tickStep * 2;
            ticks_num = Math.ceil((max - min) / tickStep);
          }

          // Expand ticks for pretty view
          min = Math.floor(min / tickStep) * tickStep;
          max = Math.ceil(max / tickStep) * tickStep;

          ticks = [];
          for (let i = min; i <= max; i += tickStep) {
            ticks.push(i);
          }
        } else {
          // Set defaults if no data
          ticks = defaultTicks / 2;
          min = 0;
          max = 1;
        }

        options.xaxis = {
          label: "Histogram",
          max,
          min,
          mode: null,
          show: panel.xaxis.show,
          ticks,
          timezone: dashboard.getTimezone(),
        };

        // Use "short" format for histogram values
        configureAxisMode(options.xaxis, "short");
      }

      function addXTableAxis (options) {
        let ticks = _.map(data, function (series: any, seriesIndex: any) {
          return _.map(series.datapoints, function (point, pointIndex) {
            const tickIndex = seriesIndex * series.datapoints.length + pointIndex;
            return [tickIndex + 1, point[1]];
          });
        });
        ticks = _.flatten(ticks);

        options.xaxis = {
          label: "Datetime",
          max: ticks.length + 1,
          min: 0,
          mode: null,
          show: panel.xaxis.show,
          ticks,
          timezone: dashboard.getTimezone(),
        };
      }

      function configureYAxisOptions (data, options) {
        const defaults = {
          index: 1,
          logBase: panel.yaxes[0].logBase || 1,
          max: parseNumber(panel.yaxes[0].max),
          min: parseNumber(panel.yaxes[0].min),
          position: "left",
          show: panel.yaxes[0].show,
          tickDecimals: panel.yaxes[0].decimals,
        };

        options.yaxes.push(defaults);

        if (_.find(data, {yaxis: 2})) {
          const secondY = _.clone(defaults);
          secondY.index = 2;
          secondY.show = panel.yaxes[1].show;
          secondY.logBase = panel.yaxes[1].logBase || 1;
          secondY.position = "right";
          secondY.min = parseNumber(panel.yaxes[1].min);
          secondY.max = parseNumber(panel.yaxes[1].max);
          secondY.tickDecimals = panel.yaxes[1].decimals;
          options.yaxes.push(secondY);

          applyLogScale(options.yaxes[1], data);
          configureAxisMode(options.yaxes[1], panel.percentage && panel.stack ? "percent" : panel.yaxes[1].format);
        }
        applyLogScale(options.yaxes[0], data);
        configureAxisMode(options.yaxes[0], panel.percentage && panel.stack ? "percent" : panel.yaxes[0].format);
      }

      function parseNumber (value: any) {
        if (value === null || typeof value === "undefined") {
          return null;
        }

        return _.toNumber(value);
      }

      function applyLogScale (axis, data) {
        if (axis.logBase === 1) {
          return;
        }

        const minSetToZero = axis.min === 0;

        if (axis.min < Number.MIN_VALUE) {
          axis.min = null;
        }
        if (axis.max < Number.MIN_VALUE) {
          axis.max = null;
        }

        let series;
        let i;
        let max = axis.max;
        let min = axis.min;

        for (i = 0; i < data.length; i++) {
          series = data[i];
          if (series.yaxis === axis.index) {
            if (!max || max < series.stats.max) {
              max = series.stats.max;
            }
            if (!min || min > series.stats.logmin) {
              min = series.stats.logmin;
            }
          }
        }

        axis.transform = function (v) {
          return v < Number.MIN_VALUE ? null : Math.log(v) / Math.log(axis.logBase);
        };
        axis.inverseTransform = function (v) {
          return Math.pow(axis.logBase, v);
        };

        if (!max && !min) {
          max = axis.inverseTransform(+2);
          min = axis.inverseTransform(-2);
        } else if (!max) {
          max = min * axis.inverseTransform(+4);
        } else if (!min) {
          min = max * axis.inverseTransform(-4);
        }

        if (axis.min) {
          min = axis.inverseTransform(Math.ceil(axis.transform(axis.min)));
        } else {
          min = axis.min = axis.inverseTransform(Math.floor(axis.transform(min)));
        }
        if (axis.max) {
          max = axis.inverseTransform(Math.floor(axis.transform(axis.max)));
        } else {
          max = axis.max = axis.inverseTransform(Math.ceil(axis.transform(max)));
        }

        if (!min || min < Number.MIN_VALUE || !max || max < Number.MIN_VALUE) {
          return;
        }

        if (Number.isFinite(min) && Number.isFinite(max)) {
          if (minSetToZero) {
            axis.min = 0.1;
            min = 1;
          }

          axis.ticks = generateTicksForLogScaleYAxis(min, max, axis.logBase);
          if (minSetToZero) {
            axis.ticks.unshift(0.1);
          }
          if (axis.ticks[axis.ticks.length - 1] > axis.max) {
            axis.max = axis.ticks[axis.ticks.length - 1];
          }
        } else {
          axis.ticks = [1, 2];
          delete axis.min;
          delete axis.max;
        }
      }

      function generateTicksForLogScaleYAxis (min, max, logBase) {
        let ticks = [];

        let nextTick;
        for (nextTick = min; nextTick <= max; nextTick *= logBase) {
          ticks.push(nextTick);
        }

        const maxNumTicks = Math.ceil(ctrl.height / 25);
        const numTicks = ticks.length;
        if (numTicks > maxNumTicks) {
          const factor = Math.ceil(numTicks / maxNumTicks) * logBase;
          ticks = [];

          for (nextTick = min; nextTick <= max * factor; nextTick *= factor) {
            ticks.push(nextTick);
          }
        }

        return ticks;
      }

      function configureAxisMode (axis, format) {
        axis.tickFormatter = function (val, axis) {
          return kbn.valueFormats[format](val, axis.tickDecimals, axis.scaledDecimals);
        };
      }

      function time_format (ticks, min, max) {
        if (min && max && ticks) {
          const range = max - min;
          const secPerTick = range / ticks / 1000;
          const oneDay = 86400000;
          const oneYear = 31536000000;

          if (secPerTick <= 45) {
            return "%H:%M:%S";
          }
          if (secPerTick <= 7200 || range <= oneDay) {
            return "%H:%M";
          }
          if (secPerTick <= 80000) {
            return "%m/%d %H:%M";
          }
          if (secPerTick <= 2419200 || range <= oneYear) {
            return "%m/%d";
          }
          return "%Y-%m";
        }

        return "%H:%M";
      }

      elem.bind("plotselected", function (event, ranges) {
        if (panel.xaxis.mode !== "time") {
          // Skip if panel in histogram or series mode
          plot.clearSelection();
          return;
        }

        if ((ranges.ctrlKey || ranges.metaKey) && contextSrv.isEditor) {
          // Add annotation
          setTimeout(() => {
            eventManager.updateTime(ranges.xaxis);
          }, 100);
        } else {
          scope.$apply(function () {
            timeSrv.setTime({
              from: moment.utc(ranges.xaxis.from),
              to: moment.utc(ranges.xaxis.to),
            });
          });
        }
      });

      elem.bind("plotclick", function (event, pos, item) {
        if (panel.xaxis.mode !== "time") {
          // Skip if panel in histogram or series mode
          return;
        }

        if ((pos.ctrlKey || pos.metaKey) && contextSrv.isEditor) {
          // Skip if range selected (added in "plotselected" event handler)
          const isRangeSelection = pos.x !== pos.x1;
          if (!isRangeSelection) {
            setTimeout(() => {
              eventManager.updateTime({from: pos.x, to: null});
            }, 100);
          }
        }
      });

      scope.$on("$destroy", function () {
        tooltip.destroy();
        elem.off();
        elem.remove();
      });
    },
    restrict: "A",
    template: "",
  };
}

coreModule.directive("grafanaTemplateGraph", graphDirective);
