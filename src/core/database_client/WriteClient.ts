/*
  TODO:
  1) rendere tutto un modulo in modo da importare una volta sola
  2) sistemate i tipi nell'interfaccia
*/

export default interface WriteClient {
  parseBatchData(batch: Array<object>): any;
  parsePointData(point: object): any;
  writeBatchData(batch: Array<object>, ...options): any;
  writePointData(point: object, ...options): any;
}
