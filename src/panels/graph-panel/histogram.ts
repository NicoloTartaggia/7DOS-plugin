import _ from "lodash";

export function getSeriesValues (dataList: Array<any>): Array<number> {
  const VALUE_INDEX = 0;
  const values = [];

  // Count histogam stats
  for (const current_data_list of dataList) {
    const datapoints = current_data_list.datapoints;
    for (const datapoint of datapoints) {
      if (datapoint[VALUE_INDEX] !== null) {
        values.push(datapoint[VALUE_INDEX]);
      }
    }
  }

  return values;
}

/**
 * Convert array of values into timeseries-like histogram:
 * [[val_1, count_1], [val_2, count_2], ..., [val_n, count_n]]
 * @param values
 * @param bucketSize
 */
export function convertValuesToHistogram (values: Array<number>, bucketSize: number): Array<any> {
  const histogram = {};

  for (const current_value of values) {
    const bound = getBucketBound(current_value, bucketSize);
    if (histogram[bound]) {
      histogram[bound] = histogram[bound] + 1;
    } else {
      histogram[bound] = 1;
    }
  }

  const histogam_series = _.map(histogram, (count, bound) => {
    return [Number(bound), count];
  });

  // Sort by Y axis values
  return _.sortBy(histogam_series, (point) => point[0]);
}

function getBucketBound (value: number, bucketSize: number): number {
  return Math.floor(value / bucketSize) * bucketSize;
}
