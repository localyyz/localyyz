import { observable, action, runInAction } from "mobx";
import { Product } from "localyyz/models";
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";

class Store {
  @observable listData = [];
  @box numProducts = 0;
  @box isLoading = false;

  constructor(props) {
    this.fetchPath = props.fetchPath;
    this.categories = props.categories;
    this.defaultParams = props.params || {};

    // TODO is this best way?
    this.categories && this.categories.current && this.categories.current();

    // unset
    this.isLoading;
    this.next;
    this.self;
    this.listData;

    // bindings
    this.reset = this.reset.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  reset(mergeParams = {}) {
    this.isLoading = null;
    this.next = null;
    this.self = null;

    // merge with old params
    let params = {};
    if (mergeParams) {
      params = { ...this.defaultParams, ...mergeParams };
    }
    this.listData.clear();

    // and finally refetch
    this.fetchNextPage(params);
  }

  @action
  async fetchNextPage(params = {}) {
    if (this.isLoading || (this.self && !this.next)) {
      console.log(
        `skip page fetch already loading or reached end. l:${
          this.isLoading
        } n:${this.next}`
      );
      return;
    }
    this.isLoading = true;

    const response = await ApiInstance.get(
      (this.next && this.next.url) || `${this.fetchPath}`,
      { ...this.defaultParams, ...params, limit: 8 }
    );

    if (response && response.data) {
      runInAction("[ACTION] fetch products", () => {
        // product count
        if (response.headers && response.headers["x-item-total"] != null) {
          this.numProducts = parseInt(response.headers["x-item-total"]) || 0;
        }

        this.next = response.link.next;
        this.self = response.link.self;
        if (this.self && this.self.page == 1) {
          this.listData = response.data.map(p => new Product(p));
        } else {
          response.data.forEach(p => {
            this.listData.push(new Product(p));
          });
        }
      });
    } else {
      console.log(`ProductList (${this.fetchPath}): Failed to fetch next page`);
    }

    this.isLoading = false;
  }
}

export default Store;
