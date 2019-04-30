import {Tags} from "influx/lib/src/results";

export interface ReadClient {
  readField (database: string, query: string): Promise<Array<{ name: string, tags: Tags, rows: Array<any> }>>;
}
