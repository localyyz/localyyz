import { Animated } from "react-native";

// third party
import { observable, runInAction, computed } from "mobx";

// custom
import { ApiInstance } from "localyyz/global";
import { Deal } from "localyyz/models";

// constants
const DEBUG = false;
const REFRESH_INTERVAL = 5000;

export default class UpcomingDealUIStore {
  @observable deal;
  @observable iteration = 0;

  constructor(deal) {
    this.deal = deal;
    this.origin = "deal/active/" + this.deal.id;        // we need to modify the origin
    this.progress = new Animated.Value(0);              // progress value
  }

  async fetch() {
    console.log("FETCHING");
    let response = await ApiInstance.get(this.origin);
    if (response && response.status < 400 && response.data) {
      // inject origin data from previous deal data
      let deal = new Deal({ ...response.data, origin: this.origin });
      !this.deal.equals(deal)
      && runInAction("[ACTION] Fetching Today's deal", () => {
        this.deal = deal;
        this.iteration = this.iteration + 1;
        DEBUG
        && console.log(
          "[ActiveDeal] Deal updated:",
          deal,
          "from",
          this.origin
        );

        // update progress
        this.updateProgress(this.deal.percentageClaimed);

        setTimeout(()=>this.fetch(), REFRESH_INTERVAL)
      });
    }
  }

}
