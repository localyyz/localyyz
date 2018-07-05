import { Animated } from "react-native";

// third party
import { observable, runInAction, computed } from "mobx";

// custom
import { ApiInstance } from "localyyz/global";
import { Deal } from "localyyz/models";

// constants
const DEBUG = true;
const REFRESH_INTERVAL = 5000;

export default class ActiveDealUIStore {
  @observable deal;

  constructor(deal) {
    // data
    this.deal = deal;
    this.progress = new Animated.Value(0);
    this.refresh();
  }

  refresh(interval = REFRESH_INTERVAL) {
    this.fetch().then(() => {
      this._refreshTimeout && clearTimeout(this._refreshTimeout);

      // fire first, then wait
      this._refreshTimeout = setTimeout(() => this.refresh(interval), interval);
    });
  }

  async fetch() {
    let response = await ApiInstance.get(this.deal.origin);
    if (response && response.status < 400 && response.data) {
      // inject origin data from previous deal data
      let deal = new Deal({ ...response.data, origin: this.deal.origin });
      !this.deal.equals(deal)
        && runInAction("[ACTION] Fetching Today's deal", () => {
          this.deal = deal;
          DEBUG
            && console.log(
              "[ActiveDeal] Deal updated:",
              deal,
              "from",
              this.deal.origin
            );

          // update progress
          Animated.timing(this.progress, {
            toValue: this.deal.percentageClaimed
          }).start();
        });
    }
  }

  @computed
  get products() {
    return this.deal.products || [];
  }
}
