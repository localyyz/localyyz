import { observable } from "mobx";
import { capitalize } from "~/src/helpers";

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

  toGA = () => {
    return {
      id: `${this.product.id}`,
      name: this.product.title,
      brand: this.product.brand,
      price: this.variant.price,
      variant: [this.variant.etc.color, this.variant.etc.size]
        .filter(v => v)
        .map(v => capitalize(v))
        .join("/"),
      category: this.product.category.type
        ? [
            this.product.genderHint,
            this.product.category.type,
            this.product.category.value
          ]
            .map(c => capitalize(c))
            .join("/")
        : "",
      quantity: 1
      //couponCode: "APPARELSALE"
    };
  };
}
