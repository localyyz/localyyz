// custom
import { GA, ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";
import { userStore } from "localyyz/stores";

// constant
const DEFAULT_CART = "default";

export default class CartStore extends Cart {
  constructor() {
    super({ id: DEFAULT_CART, email: userStore.email });
    this.fetchFromDb();
  }

  update = cart => {
    // offload to parent
    return super.update(cart);
  };

  clear = () => {
    this.constructor();
  };

  // actions
  updateEmail = (...params) => {
    GA.trackEvent("cart", "enter email");
    return super.updateEmail(...params);
  };

  updateShipping = (...params) => {
    GA.trackEvent("cart", "enter shipping address");
    return super.updateShipping(...params);
  };

  updateBilling = (...params) => {
    GA.trackEvent("cart", "enter billing address");
    return super.updateBilling(...params);
  };

  updatePayment = (...params) => {
    GA.trackEvent("cart", "enter payment details");
    return super.updatePayment(...params);
  };

  get resolvedId() {
    return this.id || DEFAULT_CART;
  }

  // api layer
  fetchFromDb = async () => {
    const response = await ApiInstance.get(`/carts/${this.resolvedId}`);
    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "fetch", `${this.resolvedId}`);
    };
    const onError = this.onInvalidCartLoad;

    return this._handleResponse(response, onSuccess, onError);
  };

  onInvalidCartLoad = ({ status }) => {
    status === 404 && this.clear();
  };

  syncToDb = async () => {
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
  };

  addProduct = async ({ product, variantId, quantity = 1 }) => {
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
  };

  removeItem = async cartItem => {
    const response = await ApiInstance.delete(
      `/carts/${this.resolvedId}/items/${cartItem.id}`
    );

    if (response && response.status == 204) {
      // remove item from cart items
      super.removeItem(cartItem);

      // track on GA
      GA.trackEvent("cart", "remove item", `${cartItem.productId}`);
      return Promise.resolve({ success: true });
    }

    return this._handleError(response.error);
  };

  applyDiscountCode = async discountCode => {
    // TODO: simplified version at the time, future improvements include adding
    // discount code per merchant
    GA.trackEvent("cart", "enter discount code", discountCode);
    const response = await ApiInstance.put(`/carts/${this.resolvedId}`, {
      discountCode: discountCode
    });

    const onSuccess = () => {
      this.setDiscountCode(discountCode);
    };

    return this._handleResponse(response, onSuccess);
  };

  checkout = async () => {
    const response = await ApiInstance.post(
      `/carts/${this.resolvedId}/checkout`
    );

    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "checkout success");
    };

    return this._handleResponse(response, onSuccess);
  };

  completePayment = async () => {
    const response = await ApiInstance.post(`/carts/${this.resolvedId}/pay`, {
      payment: this.paymentDetails.toServerCard,
      billingAddress: this.billingAddress
    });

    const onSuccess = cart => {
      this.update(cart);
      GA.trackEvent("cart", "purchase", `${this.resolvedId}`, this.totalPrice);
    };

    return this._handleResponse(response, onSuccess);
  };

  // internally used
  _handleError = ({ status, details, onError }) => {
    GA.trackEvent("cart", "error", details);
    let error = { error: details, status: status };
    onError && onError(error);

    return Promise.resolve(error);
  };

  _handleResponse = (response, onSuccess, onError) => {
    if (response && response.data) {
      onSuccess && onSuccess(response.data);
      return Promise.resolve({ success: true });
    }

    return this._handleError({ ...response.error, onError: onError });
  };
}
