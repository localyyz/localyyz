import { observable, action, computed, toJS } from "mobx";

import CartItem from "./CartItem";
import UserAddress from "./UserAddress";
import PaymentCard from "./PaymentCard";

export default class Cart {
  @observable id;
  @observable items = [];
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

  // not saved or returned by server, created and stored locally
  // per session
  @observable paymentDetails;
  @observable discountCode;

  // errors
  @observable hasError = false;
  @observable error = "";
  errorCode = 0;

  constructor(cart) {
    // bindings
    this.updateEmail = this.updateEmail.bind(this);
    this.updateShipping = this.updateShipping.bind(this);
    this.updateBilling = this.updateBilling.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.update = this.update.bind(this);
    this.setDiscountCode = this.setDiscountCode.bind(this);
    this.toJS = this.toJS.bind(this);

    // init
    this.update(cart);

    // init front end values
    this.updatePayment();
    this.setDiscountCode();
  }

  // setters
  @action
  updateEmail(email) {
    this.email = email;
  }

  @action
  updateShipping(address) {
    this.shippingAddress = new UserAddress(address);
  }

  @action
  updateBilling(address) {
    this.billingAddress = new UserAddress(address);
  }

  @action
  updatePayment(payment) {
    this.paymentDetails = new PaymentCard(payment);
  }

  // computed
  @computed
  get totalShippingDollars() {
    return this.totalShipping / 100.0;
  }

  @computed
  get totalTaxDollars() {
    return this.totalTax / 100.0;
  }

  @computed
  get totalDiscountDollars() {
    return this.totalDiscount / 100.0;
  }

  @computed
  get totalPriceDollars() {
    return this.totalPrice / 100.0;
  }

  @computed
  get subtotalPriceDollars() {
    return this.cartItems.reduce((s, p) => s + p.price, 0);
  }

  @computed
  get subtotalPreviousPriceDollars() {
    return this.cartItems.reduce((s, p) => s + (p.previousPrice || p.price), 0);
  }

  @computed
  get subtotalDiscountDollars() {
    return Math.max(
      0,
      this.subtotalPreviousPriceDollars - this.subtotalPriceDollars
    );
  }

  @computed
  get cartItems() {
    return this.items || [];
  }

  @computed
  get numCartItems() {
    return this.cartItems.length;
  }

  @computed
  get isEmpty() {
    return this.numCartItems < 1;
  }

  @computed
  get hasItemError() {
    return this.cartItems.some(item => item.hasError);
  }

  // checks
  @computed
  get isEmailComplete() {
    return !!this.email && this.email.length > 0;
  }

  @computed
  get isShippingAddressComplete() {
    return !!this.shippingAddress && !!this.shippingAddress.isComplete;
  }

  @computed
  get isBillingAddressComplete() {
    return !!this.billingAddress && !!this.billingAddress.isComplete;
  }

  @computed
  get isPaymentDetailsComplete() {
    return !!this.paymentDetails && !!this.paymentDetails.isComplete;
  }

  // internally used, but available publicly
  @action
  addItem(item) {
    this.items.push(new CartItem(item));
  }

  @action
  removeItem(item) {
    this.items.remove(item);
  }

  @action
  setDiscountCode(code) {
    this.discountCode = code;
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

  toJS() {
    return toJS(this);
  }
}
