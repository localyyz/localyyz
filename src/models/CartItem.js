import { observable } from "mobx";

import Product from "./Product";

export default class CartItem {
  @observable id;

  @observable product;
  @observable variant;
  @observable quantity;
  @observable price = 0;

  @observable hasError = false;
  @observable error = "";

  constructor(props) {
    for (let k in props) {
      // NOTE: set if passed in, if not use default
      if (k === "product") {
        this[k] = new Product(props[k]);
      } else {
        this[k] = props[k] || this[k];
      }
    }
  }

  get previousPrice() {
    return this.variant.prevPrice;
  }
}
