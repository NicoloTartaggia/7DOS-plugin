export default interface WriteClient {
  parseBatchData(batch: Array<object>): any;
  parsePointData(point: object): any;
  writeBatchData(batch: Array<object>, ...options): any;
  writePointData(point: object, ...options): any;
}
