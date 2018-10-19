// third party
import { observable, runInAction, action } from "mobx";

// custom
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";
import { Deal } from "localyyz/models";

const ENDPOINT = "deals";

export default class DealsUIStore {
  @observable dealType;
  @observable dealTab;
  @observable.shallow deals = [];
  @box isLoading = false;
  @box isRefreshing = false;
  @observable.shallow featuredDeals = [];

  @action
  setDealTab = dealTab => {
    this.dealTab = dealTab;
    this.next = null;
    this.self = null;
    this.fetchDeals();
  };

  @action
  refreshDeals = async () => {
    console.log("flatlist started refreshing");
    this.isRefreshing = true;
    this.next = null;
    this.self = null;
    this.fetchDeals();
    this.isRefreshing = false;
  };

  fetchDeals = async () => {
    let origin = `${ENDPOINT}/${this.dealTab.id}`;

    if (this.isLoading || (this.self && !this.next)) {
      return;
    }
    this.isLoading = true;

    const resolved = await ApiInstance.get(
      (this.next && this.next.url) || origin
    );

    if (resolved && resolved.data) {
      await runInAction("[ACTION] Fetching deals", () => {
        this.next = resolved.link.next;
        this.self = resolved.link.self;

        if (this.self && this.self.page == 1) {
          this.deals = resolved.data.map(deal => new Deal(deal));
        } else {
          resolved.data.forEach(d => {
            this.deals.push(new Deal(d));
          });
        }
      });
    } else {
      console.log(`DealList (${origin}): Failed to fetch next page`);
    }

    this.isLoading = false;
  };

  fetchFeaturedDeals = async () => {
    let origin = `${ENDPOINT}/featured`;

    const resolved = await ApiInstance.get(origin);

    if (resolved && resolved.data) {
      await runInAction("[ACTION] Fetching deals", () => {
        this.featuredDeals = resolved.data.map(
          deal => new Deal({ ...deal, origin: `${origin}/${deal.id}` })
        );
      });
    } else {
      console.log(`DealList (${origin}): Failed to fetch next page`);
    }
  };
}
