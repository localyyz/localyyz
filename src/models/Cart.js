import { observable, action, toJS } from "mobx";

import CartItem from "./CartItem";
import UserAddress from "./UserAddress";

export default class Cart {
  @observable id;
  @observable items;
  @observable status;
  @observable isExpress;

  @observable shippingAddress;
  @observable shippingMethods;

  @observable totalShipping;
  @observable totalTax;
  @observable totalPrice;
  @observable totalDiscount;

  @observable stripeAccountId = "";
  @observable currency = "USD";

  @observable stripeAccountId = "";

  constructor(cart) {
    this.update(cart);
  }

  @action
  convertEtcToProps(cart) {
    this.items = cart.items ? cart.items.map(i => new CartItem(i)) : [];
    const { shippingAddress: address, shippingMethods: methods } =
      cart.etc || {};
    this.shippingAddress = address ? new UserAddress(address) : null;
    this.shippingMethods = methods ? methods : null;
  }

  @action
  addItem(item) {
    this.items.push(item);
  }

  @action
  update(data = {}) {
    for (let k in data) {
      // prevent private things from being added
      if (data[k] && k.length > 0 && k[0] !== "_") {
        this[k] = data[k];
      }
    }

    this.convertEtcToProps(data);
  }

  toJS() {
    return toJS(this);
  }
}
