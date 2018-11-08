// custom
import { GA, ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";
import { navbarStore, userStore } from "localyyz/stores";

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
    return super.updateEmail(...params);
  };

  updateShipping = (...params) => {
    return super.updateShipping(...params);
  };

  updateBilling = (...params) => {
    return super.updateBilling(...params);
  };

  updatePayment = (...params) => {
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
        product.price,
        {
          products: [product.toGA()],
          productAction: { action: GA.ProductActions.Add }
        }
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
      GA.trackEvent("cart", "remove item", `${cartItem.productId}`, 0, {
        products: [cartItem.product.toGA()],
        productAction: { action: GA.ProductActions.Remove }
      });
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

      GA.trackEvent("cart", "purchase", null, null, {
        products: this.cartItems.map(ci => ci.toGA()),
        productAction: {
          transaction: {
            id: `CART${this.id}`,
            affiliation: "LOCALYYZ",
            revenue: this.totalPriceDollars,
            tax: this.totalTaxDollars,
            shipping: this.totalShippingDollars
            //couponCode: this.discountCode ? this.discountCode : ""
          },
          action: GA.ProductActions.Purchase
        }
      });
    };

    return this._handleResponse(response, onSuccess);
  };

  // internally used
  _handleError = ({ status, details, onError }) => {
    let error = { error: details, status: status };
    onError && onError(error);
    GA.trackEvent("cart", "error", `cart ${this.id} ${details}`);
    GA.trackException(`cart ${this.id}: status: ${status} ${details}`);
    navbarStore.notify(details);

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
