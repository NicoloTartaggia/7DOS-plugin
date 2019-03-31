/*
  TODO:
  1) rendere tutto un modulo in modo da importare una volta sola
  2) sistemate i tipi nell'interfaccia
*/
export interface WriteClient {
  writeBatchData(batch: Array < object > , ...options): any;
  writePointData(point: object, ...options): any;
}

export interface WriteClientFactory {
  makeWriteClient(...options): WriteClient;
}