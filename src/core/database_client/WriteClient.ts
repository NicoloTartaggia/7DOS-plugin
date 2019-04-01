export default interface WriteClient {
  writeBatchData(batch: Array < object > , ...options): any;
  writePointData(point: object, ...options): any;
}
