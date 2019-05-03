import {expect} from "chai";
import {TimeBasedNetUpdater} from "../../core/time-based-net-updater/TimeBasedNetUpdater";
import {NetManager} from "../../core/net-manager/NetManager";

describe("TimeBasedNetUpdater - constructor", () => {
  it("Undefined netManager - Error",()=>{
    let netManager: NetManager;
    expect(() => new TimeBasedNetUpdater(netManager)).to.throw(Error, "[7DOS G&B][TimeBasedNetUpdater]constructor - invalid netManager parameter");
  });
});
