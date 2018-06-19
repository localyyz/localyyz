import { observable, action, toJS } from "mobx";

import CartItem from "./CartItem";
import UserAddress from "./UserAddress";

export default class Cart {
  @observable id;
  @observable items;
  @observable status;
  @observable isExpress;

  @observable shippingAddress;
  @observable billingAddress;
  @observable shippingMethods;

  @observable totalShipping;
  @observable totalTax;
  @observable totalPrice;
  @observable totalDiscount;

  @observable stripeAccountId = "";
  @observable currency = "USD";

  @observable stripeAccountId = "";
  @observable email = "";

  // errors
  @observable hasError = false;
  @observable error = "";
  errorCode = 0;

  constructor(cart) {
    this.update(cart);
  }

  @action
  addItem(item) {
    this.items.push(item);
  }

  @action
  update(data = {}) {
    for (let k in data) {
      if (k == "shippingAddress" || k == "billingAddress") {
        this[k] = new UserAddress(data[k]);
      } else if (k == "items") {
        this.items = data.items ? data.items.map(i => new CartItem(i)) : [];
      } else {
        this[k] = data[k];
      }
    }

    const { shippingMethods: methods } = data.etc || {};
    this.shippingMethods = methods ? methods : null;
  }

  @action
  clear = () => {
    for (let k in this) {
      this[k] = undefined;
    }
  };

  toJS() {
    return toJS(this);
  }
}
