import { action } from "mobx";

// custom
import { GA, ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";
import { userStore } from "localyyz/stores";

// constant
const DEFAULT_CART = "default";

export default class CartStore extends Cart {
  constructor() {
    super({ id: DEFAULT_CART, email: userStore.email });

    // bindings
    this.update = this.update.bind(this);
    this.clear = this.clear.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateShipping = this.updateShipping.bind(this);
    this.updateBilling = this.updateBilling.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
    this.fetchFromDb = this.fetchFromDb.bind(this);
    this.syncToDb = this.syncToDb.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.applyDiscountCode = this.applyDiscountCode.bind(this);
    this.checkout = this.checkout.bind(this);
    this.completePayment = this.completePayment.bind(this);
    this._handleError = this._handleError.bind(this);
    this._handleResponse = this._handleResponse.bind(this);

    // init
    this.fetchFromDb();
  }

  update(cart) {
    // offload to parent
    return super.update(cart);
  }

  clear() {
    this.constructor();
  }

  // actions
  updateEmail(...params) {
    GA.trackEvent("cart", "enter email");
    return super.updateEmail(...params);
  }

  updateShipping(...params) {
    GA.trackEvent("cart", "enter shipping address");
    return super.updateShipping(...params);
  }

  updateBilling(...params) {
    GA.trackEvent("cart", "enter billing address");
    return super.updateBilling(...params);
  }

  updatePayment(...params) {
    GA.trackEvent("cart", "enter payment details");
    return super.updatePayment(...params);
  }

  get resolvedId() {
    return this.id || DEFAULT_CART;
  }

  // api layer
  async fetchFromDb() {
    const response = await ApiInstance.get(`/carts/${this.resolvedId}`);
    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "fetch", `${this.resolvedId}`);
    };

    return this._handleResponse(response, onSuccess);
  }

  async syncToDb() {
    const response = await ApiInstance.put(`/carts/${this.resolvedId}`, {
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      email: this.email
    });
    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "update");
    };

    return this._handleResponse(response, onSuccess);
  }

  async addProduct({ product, variantId, quantity = 1 }) {
    const response = await ApiInstance.post(`/carts/${this.resolvedId}/items`, {
      productId: product.id,
      variantId: variantId,
      quantity: quantity
    });

    const onSuccess = cartItem => {
      this.addItem(cartItem);
      GA.trackEvent(
        "cart",
        "add to cart - success",
        `${product.id}`,
        product.price
      );
    };

    return this._handleResponse(response, onSuccess);
  }

  async removeItem(cartItem) {
    const response = await ApiInstance.delete(
      `/carts/${this.resolvedId}/items/${cartItem.id}`
    );

    if (response && response.status == 204) {
      // remove item from cart items
      action(() => super.removeItem(cartItem))();

      // track on GA
      GA.trackEvent("cart", "remove item", `${cartItem.productId}`);
      return Promise.resolve({ success: true });
    }

    return this._handleError(response.error);
  }

  async applyDiscountCode(discountCode) {
    // TODO: simplified version at the time, future improvements include adding
    // discount code per merchant
    const response = await ApiInstance.put(`/carts/${this.resolvedId}`, {
      discountCode: discountCode
    });

    const onSuccess = cart => {
      this.update({ ...cart, discountCode: discountCode });
      GA.trackEvent("cart", "enter discount code", discountCode);
    };

    return this._handleResponse(response, onSuccess);
  }

  async checkout() {
    const response = await ApiInstance.post(
      `/carts/${this.resolvedId}/checkout`
    );

    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "checkout success");
    };

    return this._handleResponse(response, onSuccess);
  }

  async completePayment() {
    const response = await ApiInstance.post(`/carts/${this.resolvedId}/pay`, {
      payment: this.paymentDetails.toServerCard,
      billingAddress: this.billingAddress
    });

    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "purchase", `${this.resolvedId}`, this.totalPrice);
    };

    return this._handleResponse(response, onSuccess);
  }

  // internally used
  _handleError({ status, details }) {
    GA.trackEvent("cart", "error", details);
    return Promise.resolve({
      error: details,
      status: status
    });
  }

  _handleResponse(response, onSuccess) {
    if (response && response.data) {
      onSuccess && onSuccess(response.data);
      return Promise.resolve({ success: true });
    }

    return this._handleError(response.error);
  }
}
