import kbn from "grafana/app/core/utils/kbn";
import _ from "lodash";
import { getFlotTickDecimals } from "./ticks";

function matchSeriesOverride (aliasOrRegex, seriesAlias) {
  if (!aliasOrRegex) {
    return false;
  }

  if (aliasOrRegex[0] === "/") {
    const regex = kbn.stringToJsRegex(aliasOrRegex);
    return seriesAlias.match(regex) != null;
  }

  return aliasOrRegex === seriesAlias;
}

function translateFillOption (fill) {
  return fill === 0 ? 0.001 : fill / 10;
}

/**
 * Calculate decimals for legend and update values for each series.
 * @param data series data
 * @param panel
 */
export function updateLegendValues (data: Array<TimeSeries>, panel) {
  for (const current_serie of data) {
    const yaxes = panel.yaxes;
    const seriesYAxis = current_serie.yaxis || 1;
    const axis = yaxes[seriesYAxis - 1];
    const scaledDecimals = getFlotTickDecimals(data, axis).scaledDecimals;
    let tickDecimals = getFlotTickDecimals(data, axis).tickDecimals;
    // let { tickDecimals, scaledDecimals } = getFlotTickDecimals(data, axis);
    const formater = kbn.valueFormats[panel.yaxes[seriesYAxis - 1].format];

    // decimal override
    if (_.isNumber(panel.decimals)) {
      current_serie.updateLegendValues(formater, panel.decimals, null);
    } else {
      // auto decimals
      // legend and tooltip gets one more decimal precision
      // than graph legend ticks
      tickDecimals = (tickDecimals || -1) + 1;
      current_serie.updateLegendValues(formater, tickDecimals, scaledDecimals + 2);
    }
  }
}

export function getDataMinMax (data: Array<TimeSeries>) {
  let datamin = null;
  let datamax = null;

  for (const series of data) {
    if (datamax === null || datamax < series.stats.max) {
      datamax = series.stats.max;
    }
    if (datamin === null || datamin > series.stats.min) {
      datamin = series.stats.min;
    }
  }

  return { datamin, datamax };
}

export default class TimeSeries {
  public datapoints: any;
  public id: string;
  public label: string;
  public alias: string;
  public aliasEscaped: string;
  public color: string;
  public valueFormater: any;
  public stats: any;
  public legend: boolean;
  public allIsNull: boolean;
  public allIsZero: boolean;
  public decimals: number;
  public scaledDecimals: number;
  public hasMsResolution: boolean;
  public isOutsideRange: boolean;

  public lines: any;
  public dashes: any;
  public bars: any;
  public points: any;
  public yaxis: any;
  public zindex: any;
  public stack: any;
  public nullPointMode: any;
  public fillBelowTo: any;
  public transform: any;
  public flotpairs: any;
  public unit: any;

  constructor(opts) {
    this.datapoints = opts.datapoints;
    this.label = opts.alias;
    this.id = opts.alias;
    this.alias = opts.alias;
    this.aliasEscaped = _.escape(opts.alias);
    this.color = opts.color;
    this.valueFormater = kbn.valueFormats.none;
    this.stats = {};
    this.legend = true;
    this.unit = opts.unit;
    this.hasMsResolution = this.isMsResolutionNeeded();
  }

  public applySeriesOverrides(overrides) {
    this.lines = {};
    this.dashes = {
      dashLength: [],
    };
    this.points = {};
    this.bars = {};
    this.yaxis = 1;
    this.zindex = 0;
    this.nullPointMode = null;
    delete this.stack;

    for (const current_override of overrides) {
      if (!matchSeriesOverride(current_override.alias, this.alias)) {
        continue;
      }
      if (current_override.lines !== void 0) {
        this.lines.show = current_override.lines;
      }
      if (current_override.dashes !== void 0) {
        this.dashes.show = current_override.dashes;
        this.lines.lineWidth = 0;
      }
      if (current_override.points !== void 0) {
        this.points.show = current_override.points;
      }
      if (current_override.bars !== void 0) {
        this.bars.show = current_override.bars;
      }
      if (current_override.fill !== void 0) {
        this.lines.fill = translateFillOption(current_override.fill);
      }
      if (current_override.stack !== void 0) {
        this.stack = current_override.stack;
      }
      if (current_override.linewidth !== void 0) {
        this.lines.lineWidth = this.dashes.show ? 0 : current_override.linewidth;
        this.dashes.lineWidth = current_override.linewidth;
      }
      if (current_override.dashLength !== void 0) {
        this.dashes.dashLength[0] = current_override.dashLength;
      }
      if (current_override.spaceLength !== void 0) {
        this.dashes.dashLength[1] = current_override.spaceLength;
      }
      if (current_override.nullPointMode !== void 0) {
        this.nullPointMode = current_override.nullPointMode;
      }
      if (current_override.pointradius !== void 0) {
        this.points.radius = current_override.pointradius;
      }
      if (current_override.steppedLine !== void 0) {
        this.lines.steps = current_override.steppedLine;
      }
      if (current_override.zindex !== void 0) {
        this.zindex = current_override.zindex;
      }
      if (current_override.fillBelowTo !== void 0) {
        this.fillBelowTo = current_override.fillBelowTo;
      }
      if (current_override.color !== void 0) {
        this.color = current_override.color;
      }
      if (current_override.transform !== void 0) {
        this.transform = current_override.transform;
      }
      if (current_override.legend !== void 0) {
        this.legend = current_override.legend;
      }

      if (current_override.yaxis !== void 0) {
        this.yaxis = current_override.yaxis;
      }
    }
  }

  public getFlotPairs(fillStyle) {
    const result = [];

    this.stats.total = 0;
    this.stats.max = -Number.MAX_VALUE;
    this.stats.min = Number.MAX_VALUE;
    this.stats.logmin = Number.MAX_VALUE;
    this.stats.avg = null;
    this.stats.current = null;
    this.stats.first = null;
    this.stats.delta = 0;
    this.stats.diff = null;
    this.stats.range = null;
    this.stats.timeStep = Number.MAX_VALUE;
    this.allIsNull = true;
    this.allIsZero = true;

    const ignoreNulls = fillStyle === "connected";
    const nullAsZero = fillStyle === "null as zero";
    let currentTime;
    let currentValue;
    let nonNulls = 0;
    let previousTime;
    let previousValue = 0;
    let previousDeltaUp = true;

    for (let i = 0; i < this.datapoints.length; i++) {
      currentValue = this.datapoints[i][0];
      currentTime = this.datapoints[i][1];

      // Due to missing values we could have different timeStep all along the series
      // so we have to find the minimum one (could occur with aggregators such as ZimSum)
      if (previousTime !== undefined) {
        const timeStep = currentTime - previousTime;
        if (timeStep < this.stats.timeStep) {
          this.stats.timeStep = timeStep;
        }
      }
      previousTime = currentTime;

      if (currentValue === null) {
        if (ignoreNulls) {
          continue;
        }
        if (nullAsZero) {
          currentValue = 0;
        }
      }

      if (currentValue !== null) {
        if (_.isNumber(currentValue)) {
          this.stats.total += currentValue;
          this.allIsNull = false;
          nonNulls++;
        }

        if (currentValue > this.stats.max) {
          this.stats.max = currentValue;
        }

        if (currentValue < this.stats.min) {
          this.stats.min = currentValue;
        }

        if (this.stats.first === null) {
          this.stats.first = currentValue;
        } else {
          if (previousValue > currentValue) {
            // counter reset
            previousDeltaUp = false;
            if (i === this.datapoints.length - 1) {
              // reset on last
              this.stats.delta += currentValue;
            }
          } else {
            if (previousDeltaUp) {
              this.stats.delta += currentValue - previousValue; // normal increment
            } else {
              this.stats.delta += currentValue; // account for counter reset
            }
            previousDeltaUp = true;
          }
        }
        previousValue = currentValue;

        if (currentValue < this.stats.logmin && currentValue > 0) {
          this.stats.logmin = currentValue;
        }

        if (currentValue !== 0) {
          this.allIsZero = false;
        }
      }

      result.push([currentTime, currentValue]);
    }

    if (this.stats.max === -Number.MAX_VALUE) {
      this.stats.max = null;
    }
    if (this.stats.min === Number.MAX_VALUE) {
      this.stats.min = null;
    }

    if (result.length && !this.allIsNull) {
      this.stats.avg = this.stats.total / nonNulls;
      this.stats.current = result[result.length - 1][1];
      if (this.stats.current === null && result.length > 1) {
        this.stats.current = result[result.length - 2][1];
      }
    }
    if (this.stats.max !== null && this.stats.min !== null) {
      this.stats.range = this.stats.max - this.stats.min;
    }
    if (this.stats.current !== null && this.stats.first !== null) {
      this.stats.diff = this.stats.current - this.stats.first;
    }

    this.stats.count = result.length;
    return result;
  }

  public updateLegendValues(formater, decimals, scaledDecimals) {
    this.valueFormater = formater;
    this.decimals = decimals;
    this.scaledDecimals = scaledDecimals;
  }

  public formatValue(value) {
    if (!_.isFinite(value)) {
      value = null; // Prevent NaN formatting
    }
    return this.valueFormater(value, this.decimals, this.scaledDecimals);
  }

  public isMsResolutionNeeded() {
    for (const current_datapoint of this.datapoints) {
      if (current_datapoint[1] !== null) {
        const timestamp = current_datapoint[1].toString();
        if (timestamp.length === 13 && timestamp % 1000 !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  public hideFromLegend(options) {
    if (options.hideEmpty && this.allIsNull) {
      return true;
    }
    // ignore series excluded via override
    if (!this.legend) {
      return true;
    }

    // ignore zero series
    if (options.hideZero && this.allIsZero) {
      return true;
    }

    return false;
  }
}
