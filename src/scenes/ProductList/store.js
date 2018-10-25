import { observable, action, runInAction } from "mobx";
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";

import { Product } from "localyyz/stores";

class Store {
  @observable products = [];
  @box numProducts = 0;
  @box isLoading = false;
  // NOTE: fetch path is needed by filterStore to
  // know where to fetch filter data from
  fetchPath = "";

  constructor(props) {
    this.fetchPath = props.fetchPath;
    this.defaultParams = props.params || {};

    // unset
    this.isLoading;
    this.next;
    this.self;
    this.products;
  }

  @action
  reset = (mergeParams = {}, fetchPath = "") => {
    this.isLoading = null;
    this.next = null;
    this.self = null;

    // merge with old params
    let params = {};
    if (mergeParams) {
      params = { ...this.defaultParams, ...mergeParams };
    }
    this.products.clear();

    // special case where, sometime we want to swap out
    // the fetch path of this product list
    //
    // ie. search/browse -> selected sub categories
    if (fetchPath != "") {
      this.fetchPath = fetchPath;
    }

    // and finally refetch
    this.fetchNextPage(params);
  };

  @action
  fetchNextPage = async (params = {}) => {
    if (this.isLoading || (this.self && !this.next)) {
      /*global __DEV__:true*/
      __DEV__
        ? console.log(
            `skip page fetch already loading or reached end. l:${
              this.isLoading
            } n:${this.next}`
          )
        : null;
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

        // NOTE/TODO: make this better
        if (this.self && this.self.page == 1) {
          this.products = response.data.map(p => new Product(p));
        } else {
          response.data.forEach(p => {
            this.products.push(new Product(p));
          });
        }
      });
    } else {
      console.log(`ProductList (${this.fetchPath}): Failed to fetch next page`);
    }

    this.isLoading = false;
  };
}

export default Store;
