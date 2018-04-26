import { observable, action, runInAction } from "mobx";

import { Product } from "localyyz/models";
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";

class Store {
  @observable listData = [];
  @box isLoading = false;

  constructor(props) {
    this.fetchPath = props.fetchPath;
    this.categories = props.categories;
    this.defaultParams = props.params;
  }

  @action
  fetchNextPage = async (params = {}) => {
    if (this.isLoading || (this.self && !this.next)) {
      console.log("skip page fetch already loading or reached end");
      return;
    }
    this.isLoading = true;
    const response = await ApiInstance.get(
      (this.next && this.next.url) || `${this.fetchPath}`,
      { ...params, limit: 8 }
    );
    runInAction("[ACTION] fetch products", () => {
      if (response && response.data) {
        this.next = response.link.next;
        this.self = response.link.self;
        if (this.self && this.self.page == 1) {
          this.listData = response.data.map(p => new Product(p));
        } else {
          response.data.forEach(p => {
            this.listData.push(new Product(p));
          });
        }
      }
    });
    this.isLoading = false;
  };
}

export default Store;
