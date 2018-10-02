// third party
import { computed, observable, action, runInAction } from "mobx";

// custom
import { ApiInstance } from "~/src/global";
import { Merchant } from "~/src/stores";

// constants
export const MinFollowCount = 3;

export default class Store {
  @observable selected = observable.map({});
  @observable merchants = [];
  @observable isLoading = false;

  @computed
  get favouriteCount() {
    return this.merchants.slice().filter(m => m.isFavourite).length;
  }

  get selectedOptions() {
    return Array.from(this.selected.keys());
  }

  @action
  toggleLoading = state => {
    this.isLoading = state;
  };

  @action
  fetchMerchants = () => {
    this.next = null;
    this.self = null;
    this.merchants.clear();
    return this.fetchNextPage();
  };

  @action
  fetchNextPage = async () => {
    if (this.isLoading || (this.self && !this.next)) {
      // end of page!
      return;
    }
    this.toggleLoading(true);
    const path = this.next ? this.next.url : "categories/merchants";
    let payload = {
      categories: this.selectedOptions
    };
    const resolved = await ApiInstance.post(path, payload, { limit: 5 });
    if (!resolved.error) {
      // eslint-disable-next-line
      this.next = resolved.link && resolved.link.next;
      this.self = resolved.link && resolved.link.self;
      runInAction("merchant", () => {
        resolved.data.forEach(m => this.merchants.push(new Merchant(m)));
      });
    }
    this.toggleLoading(false);
    return Promise.resolve({ error: resolved.error });
  };

  @action
  selectOption = option => {
    if (this.selected.get(option.id)) {
      this.selected.delete(option.id);
    } else {
      // select the current category
      this.selected.set(option.id, true);
    }
  };

  @action
  storeUserCategory = async () => {
    const resolved = await ApiInstance.put("users/me/categories", {
      categories: this.selectedOptions
    });
    if (!resolved.error) {
      return Promise.resolve({ success: true });
    }
    return Promise.resolve({ error: resolved.error });
  };
}
