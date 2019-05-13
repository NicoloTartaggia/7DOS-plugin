/**
 * @File NetParser.ts
 * @Type TypeScript file
 * @Desc Contains the NetParser interface declaration.
 */
import {ConcreteNetworkAdapter} from "../adapter/ConcreteNetworkAdapter";

export interface NetParser {
  createNet(file_content: string): ConcreteNetworkAdapter;
}
