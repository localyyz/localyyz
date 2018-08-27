import { observable, runInAction } from "mobx";
import { invariant } from "fbjs/lib";

// custom
import { GA, ApiInstance } from "localyyz/global";

import Product from "./Product";

export default class ProductListStore {
  @observable list = [];
  @observable brands = [];
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

  fetchBrands = async () => {
    const resolved = await ApiInstance.get(`${this.path}/brands`, null);
    if (!resolved.error) {
      runInAction("[ACTION] fetch product brands", () => {
        this.brands = [...this.brands, resolved.data.map(b => new b())];
      });
    }
    return resolved;
  };

  fetchNext = async () => {
    const resolved = await ApiInstance.get(this.fetchPath, this.params);
    if (!resolved.error) {
      this._next = resolved.link.next;
      this._self = resolved.link.self;
      runInAction("[ACTION] fetch products", () => {
        // optimization. push or replace the list of products
        this.list = [...this.list, resolved.data.map(p => new Product(p))];
      });
    }
    return resolved;
  };
}
