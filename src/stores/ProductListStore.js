import { observable, runInAction } from "mobx";

// custom
import { ApiInstance } from "~/src/global";

import Product from "./ProductStore";

export default class ProductListStore {
  static fetch = async (path, params = {}) => {
    const resolve = await ApiInstance.get(path, params);
    if (!resolve.error) {
      // app.js trackScreen is also handling product view events
      return new Promise.resolve({
        products: new ProductListStore(path, resolve.data)
      });
    }
    return new Promise.resolve({ error: resolve.error });
  };

  constructor(path, products = []) {
    this._fetchPath = path;
    this.list = products.map(p => new Product(p));
  }

  @observable list = [];
  @observable totalItems;

  _next;
  _self;
  params = { page: 1, limit: 10 };

  get fetchPath() {
    return this.next ? this.next.url : this._fetchPath;
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
