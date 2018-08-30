import { observable, runInAction } from "mobx";
import { invariant } from "fbjs/lib";

// custom
import { GA, ApiInstance } from "localyyz/global";

import Product from "./Product";

export default class ProductListStore {
  @observable list = [];
  @observable totalItems;

  _next;
  _self;
  params = { page: 1, limit: 10 };

  constructor(props) {
    invariant(props.path, "path must be defined");
    this.initialPath = props.path;
  }

  get fetchPath() {
    return this.next ? this.next.url : this.initialPath;
  }

  fetchNext = async () => {
    const resolved = await ApiInstance.get(this.fetchPath, this.params);
    if (!resolved.error) {
      this._next = resolved.link.next;
      this._self = resolved.link.self;
      runInAction("[ACTION] fetch products", () => {
        // optimization. push or replace the list of products
        resolved.data.forEach(p => {
          this.list.push(new Product(p));
        });
      });
    }
    return resolved;
  };
}
