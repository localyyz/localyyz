// custom
import { ApplePayExpressPayment } from "localyyz/effects";
import { facebook as Facebook } from "localyyz/effects";
import { ApiInstance } from "localyyz/global";
import { Cart, UserAddress } from "localyyz/models";
import { assistantStore } from "localyyz/stores";

// third party
import Moment from "moment";
import isEmpty from "lodash/isEmpty";
import { observable, action, computed, runInAction } from "mobx";
import padStart from "lodash.padstart";

// consts
const EXPRESS_CART = "express";

// constants
const DEBUG = false;
const DEBUG_CARD = "4242 4242 4242 4242";
const DEBUG_CVC = "222";
const DEBUG_EXPIRY_MONTH = "11";
const DEBUG_EXPIRY_YEAR = "22";
const DEBUG_CARDHOLDER = "Johnny Appleseed";

export default class ExpressCartStore {
  @observable cart;
  @observable paymentDetails;

  // used for apple pay
  @observable selectedShipping;

  constructor() {
    this._api = ApiInstance;
    this.paymentDetails = DEBUG
      ? {
          number: DEBUG_CARD,
          cvc: DEBUG_CVC,
          expiry: `${DEBUG_EXPIRY_MONTH}/${DEBUG_EXPIRY_YEAR}`,
          expiryMonth: DEBUG_EXPIRY_MONTH,
          expiryYear: DEBUG_EXPIRY_YEAR,
          name: DEBUG_CARDHOLDER,

          // validity checks
          nameValid: true,
          cvcValid: true,
          expiryValid: true,
          numberValid: true,

          // aggregated check
          ready: true
        }
      : {};

    this.clear();
  }

  /*
  * Computed values
  *
  */

  // cart conveniences
  @computed
  get numItems() {
    return this.cart && this.cart.items ? this.cart.items.length : 0;
  }

  @computed
  get hasItemError() {
    return (
      this.cart && this.cart.items && this.cart.items.some(el => el.hasError)
    );
  }

  @computed
  get isEmpty() {
    return this.numItems < 1;
  }

  @computed
  get amountSubtotal() {
    return this.cart && this.cart.items
      ? this.cart.items.reduce((s, p) => s + p.price, 0)
      : 0;
  }

  @computed
  get amountTotal() {
    // use frontend calculated subtotal if address not given
    return this.cart && this.cart.totalPrice
      ? this.cart.totalPrice / 100
      : this.amountSubtotal || 0;
  }

  @computed
  get amountTaxes() {
    return this.cart && this.cart.totalTax ? this.cart.totalTax / 100 : 0;
  }

  @computed
  get amountDiscount() {
    return this.cart && this.cart.totalDiscount
      ? this.cart.totalDiscount / 100
      : 0;
  }

  @computed
  get amountShipping() {
    return this.cart && this.cart.totalShipping
      ? this.cart.totalShipping / 100
      : 0;
  }

  @computed
  get shippingDetails() {
    // by default, return isShipping = true to help
    // components make sense of the address
    return this.cart.shippingAddress;
  }

  @computed
  get billingDetails() {
    // by default, return isBilling = true to help
    // components make sense of the address
    return this.cart.billingAddress;
  }

  @computed
  get shippingMethods() {
    return this.cart.shippingMethods || [];
  }

  @computed
  get email() {
    return this.cart.email || "";
  }

  // TODO: remove this, gets the first placeId
  @computed
  get placeId() {
    return (
      this.cart.items
      && this.cart.items.length > 0
      && this.cart.items[0].product.placeId
    );
  }

  @computed
  get shippingExpectation() {
    const firstShippingMethod
      = this.placeId
      && this.cart.shippingMethods
      && this.cart.shippingMethods[this.placeId];

    // TODO: should be against all shipping methods
    // not just the first, but this will be
    // eventually handled by backend
    return firstShippingMethod
      ? deliveryExpectation(
          firstShippingMethod.deliveryRange
            && firstShippingMethod.deliveryRange[0],
          firstShippingMethod.deliveryRange
            && firstShippingMethod.deliveryRange[1]
        )
      : "";
  }

  @computed
  get customerName() {
    return (
      this.cart
      && this.cart.shippingAddress
      && this.cart.shippingAddress.firstName
        + (this.cart.shippingAddress.firstName
        && this.cart.shippingAddress.lastName
          ? " "
          : "")
        + this.cart.shippingAddress.lastName
    );
  }

  @computed
  get paymentLastFour() {
    const parts = this.paymentDetails.number
      ? this.paymentDetails.number.split(" ")
      : [];

    return parts[parts.length - 1] || "0000";
  }

  @computed
  get paymentType() {
    return (
      {
        4: "cc-visa",
        5: "cc-mastercard",
        3: "cc-amex"
      }[(this.paymentDetails.number || "")[0]] || "cc-stripe"
    );
  }

  // converts to server spec, legacy from rn-cc-input
  @computed
  get payment() {
    let expiryMonth = `${this.paymentDetails.expiryMonth || ""}`;
    let expiryYear = `${this.paymentDetails.expiryYear || ""}`;

    return {
      number: this.paymentDetails.number,
      expiry: `${padStart(expiryMonth, 2, "0")}/${padStart(
        expiryYear,
        2,
        "0"
      )}`,
      cvc: this.paymentDetails.cvc,
      name: this.paymentDetails.name
    };
  }

  // cart actions
  @action
  clear = () => {
    this.cart = new Cart({
      id: EXPRESS_CART,
      items: []
    });
  };

  @action
  replace = cart => {
    this.cart.update(cart);
    return this.cart;
  };

  @action
  fetch = async () => {
    const response = await this._api.get(`/carts/${EXPRESS_CART}`);

    // instantiate the cart if succeeded
    return response && response.data && (await this.replace(response.data));
  };

  /*
  * Cart Items
  *
  */

  @action
  addItem = async ({
    productId,
    product,
    cartId,
    color,
    size,
    quantity = 1
  }) => {
    if (productId) {
      const response = await this._api.post(
        // adds to the current cart or a specified one
        `/carts/${EXPRESS_CART}/items`,
        {
          productId: productId || product.id,
          color: color,
          size: size,
          quantity: quantity
        }
      );

      // log data of product add and update store
      if (response && response.status < 400 && response.data) {
        // facebook analytics
        Facebook.logEvent("fb_mobile_add_to_cart", response.data.price, {
          fb_content_type: cartId === "express" ? "express" : "default",
          fb_content_id: productId || product.id
        });

        // update cart
        runInAction("[ACTION] add cart item", () => {
          this.cart.items.push(response.data);
        });

        return response.data;
      } else {
        return response;
      }
    }
  };

  /*
  * Cart General
  *
  */

  @action
  destroy = async () => {
    return await this._api.delete(`/carts/${EXPRESS_CART}`);
  };

  /*
  * Cart Checkout
  *
  */

  // apple pay/express checkout
  @action
  _launchExpressPayment = async () => {
    let express = new ApplePayExpressPayment(
      "example",
      this.cart.items.slice().map(item => ({
        amount: `${item.price}`,

        // TODO: sanitize and limit
        label: item.product.title
      })),
      {
        merchantName: this.cart.items[0].product.place.name,
        requestName: true,
        requestPhone: false,
        requestEmail: true,
        requestShipping: true,
        requestBilling: true,

        // stripe related payment account id
        stripeAccountId: this.cart.stripeAccountId,
        currency: this.cart.currency,

        updateShippingMethod: async methodId => {
          let shipping
            = this.cart.shippingMethods
            && this.cart.shippingMethods.find(method => method.id === methodId);

          // sync to remote server
          const response = await this._api.put(
            "/carts/express/shipping/method",
            {
              handle: shipping.id
            }
          );

          if (response && response.data) {
            runInAction("[ACTION] update checkout shipping method", () => {
              this.selectedShipping = shipping;
              this.replace(response.data);

              // updated shipping method
              Facebook.logEvent("fb_mobile_shipping_method", {
                fb_content_type: "express",
                fb_content_id: this.cart.id
              });
            });
          }
        },

        updateShippingAddress: async address => {
          let payerName = (address.recipient || "").split(" ");
          let shippingLines = (address.addressLine || "").split("\n");
          this.selectedAddress = new UserAddress({
            firstName: payerName.slice(0, payerName.length - 1).join(" "),
            lastName: payerName[payerName.length - 1],
            address:
              shippingLines && shippingLines.length > 0 && shippingLines[0],
            addressOpt:
              !isEmpty(shippingLines) && shippingLines.length > 1
                ? shippingLines[1]
                : undefined,
            city: address.city,
            country: address.country,
            countryCode: address.countryCode,
            province: address.region,
            zip: address.postalCode,

            // internal
            isShipping: true,
            isPartial: address.isPartial
          });

          // NOTE: region could be long or short. shortcode is autopopulated
          // by apple pay. but user may enter the full region manually
          if (address.region && address.region.length < 3) {
            this.selectedAddress.provinceCode = address.region;
            this.selectedAddress.province = "";
          } else {
            this.selectedAddress.province = address.region;
          }

          // NOTE: THIS IS WHY YOU DON'T USE FANCY ASYNC EVENTS
          // when the shipping address is NOT partial. it means we've already
          // started payment request. HOWEVER. if we're updating the full
          // shipping address at the same time, SHOPIFY nulls the SHIPPING
          // METHOD. So sometimes, we have:
          //
          // SHIPPING ADDRESS -> PAYMENT -> SHIPPING METHOD
          //
          // which shopify will return error saying shipping method is not
          // selected.
          //
          // hence. if NOT partial. chain update at END of payment request
          if (!address.isPartial) {
            // DO NOTHING
            return;
          }

          // return type is full cart object
          const response = await this._api.put(
            "/carts/express/shipping/address",
            this.selectedAddress
          );
          if (response && response.data) {
            runInAction("[ACTION] update checkout shipping address", () => {
              // NOTE reset selected shipping because address has changed
              this.selectedShipping = null;
              this.replace({
                ...response.data,
                totalShipping: 0
              });

              // updated shipping address
              Facebook.logEvent("fb_mobile_shipping_address", {
                fb_content_type: "express",
                fb_content_id: this.cart.id
              });
            });
          }
        },

        getShippingMethods: async () => {
          const response = await this._api.get(
            "/carts/express/shipping/estimate"
          );

          // save shipping methods to store
          if (response && response.data && response.data.shippingRates) {
            runInAction("[ACTION] update shipping methods", () => {
              this.cart.shippingMethods = response.data.shippingRates.map(
                rate => ({
                  id: rate.handle,
                  title: rate.title,
                  price: rate.price,
                  desc:
                    rate.deliveryRange
                    && deliveryExpectation(
                      rate.deliveryRange[0],
                      rate.deliveryRange[1]
                    ),
                  amount: {
                    currency: this.cart.currency || "USD",
                    value: (rate.price / 100).toFixed(2)
                  }
                })
              );
              if (this.cart.shippingMethods.length > 0) {
                // NOTE: apple pay automatically selectes the first shipping method.
                // we need this here to mimic the apple pay behavior

                // Either it's RN-payments or we're doing something wrong, but
                // the issue here is that when new address is selected, we ask
                // the server for new shipping methods. However, apple pay
                // automatically selects the first shipping method, by that
                // point we've already called apple pay with UI updates.
                //
                // The problem is, the native code doesn't call didSelectShippingMethod
                // on the first load (or address change). So we can't update the
                // apple pay UI. We have to "fake" the total when the address is
                // changed to match the default first shipping method.
                //
                // TODO: there's an error here when the user removes all their
                // shipping address. the backend is sending the wrong cartTotal
                // (still have the old total with old shipping address and tax)
                this.selectedShipping = this.cart.shippingMethods[0];
                this.cart.totalShipping = this.selectedShipping.price;
                this.cart.totalPrice += this.cart.totalShipping;
              }
            });
          }

          return (this.cart.shippingMethods || []).map(rate => ({
            // conversion back to apple pay shipping spec
            ...rate,
            label: rate.title,
            detail: rate.desc
          }));
        },

        buildPaymentDetails: (target = {}) => {
          let lineItems = (this.cart.items || []).map(item => ({
            label: `${item.product.title} - ${item.variant.etc.size} ${
              item.variant.etc.color
            }`,
            amount: {
              currency: this.cart.currency,
              value: `${(item.price || 0).toFixed(2)}`
            }
          }));

          let details = {
            id: `cart${this.cart.id}`,
            displayItems: lineItems,
            shippingOptions: target.shipping || [],
            subtotal: {
              label: "SUBTOTAL",
              amount: {
                value: `${this.amountSubtotal.toFixed(2)}`,
                currency: this.cart.currency
              }
            },
            total: {
              label: `${target.merchantName} (via Localyyz)` || "Shop",
              amount: {
                value: `${this.amountTotal.toFixed(2)}`,
                currency: this.cart.currency
              }
            }
          };

          if (this.amountDiscount > 0) {
            details.displayItems.push({
              label: "DISCOUNT CODE",
              amount: {
                value: -this.amountDiscount,
                currency: "USD"
              }
            });
          }

          if (this.amountTaxes > 0) {
            details.tax = {
              label: "TAX",
              amount: {
                value: `${this.amountTaxes.toFixed(2)}`,
                currency: this.cart.currency
              }
            };
          }

          if (this.amountShipping > 0) {
            details["shipping"] = {
              label: this.selectedShipping
                ? `SHIPPING - ${this.selectedShipping.title}`
                : "SHIPPING",
              amount: {
                value: `${this.amountShipping.toFixed(2)}`,
                currency: this.cart.currency
              }
            };
          }

          return details;
        }
      }
    );

    // initiated checkout
    Facebook.logEvent("fb_mobile_initiated_checkout", this.amountTotal || 0, {
      fb_content_type: "express",
      fb_content_id: this.cart.id,
      fb_num_items: 1
    });

    // request creates a payment request and shows the appropriate payment forms
    return express
      .request()
      .then(response => {
        // inject the express paymentRequest object for aborting later
        // --> resolve onto payExpressCheckout
        response._paymentRequest = express._paymentRequest;
        return response;
      })
      .catch(e => {
        // convert to friendly format including the payment request object
        throw {
          _wasFailed: true,
          _error: e,
          _paymentResponse: {
            _paymentRequest: express._paymentRequest
          }
        };
      });
  };

  // onUserAcceptPayment is a step before finalizing payment.
  // in this we can:
  //
  // - update checkout with full shipping address (apple pay)
  // - update with billing address
  // - update any other fields (email, phone)
  @action
  _onUserAcceptPayment = async response => {
    const addressResponse = await this._api.put(
      "/carts/express/shipping/address",
      this.selectedAddress
    );
    const shippingResponse = await this._api.put(
      "/carts/express/shipping/method",
      {
        handle: this.selectedShipping.id
      }
    );

    if (addressResponse.status > 200) {
      return Promise.reject({
        ...addressResponse,
        _paymentResponse: response,
        _wasFailed: true,
        _error: addressResponse.error,
        _failureTitle: "Invalid shipping address",
        _failureMessage:
          "There was an issue with your shipping address and we couldn't complete your purchase, please try again"
      });
    } else if (shippingResponse.status > 200) {
      return Promise.reject({
        ...shippingResponse,
        _paymentResponse: response,
        _wasFailed: true,
        _error: shippingResponse.error,
        _failureTitle: "Invalid shipping method selected",
        _failureMessage:
          "There was an issue selecting that shipping method, please try again"
      });
    }

    Facebook.logEvent("fb_mobile_add_payment_info", {
      fb_success: true,
      fb_content_type: "express",
      fb_content_id: this.cart.id
    });

    return response;
  };

  // apple pay completion
  @action
  _payExpressCheckout = async response => {
    // NOTE: billing address is processed here because until the user
    // accepts payment, we don't receive the full address
    let billingAddress = response.billingContact;
    let billingLines = billingAddress.addressLine.split("\n");
    let billingPayerName = billingAddress.recipient.split(" ");
    let selectedBillingAddress = new UserAddress({
      firstName: billingPayerName
        .slice(0, billingPayerName.length - 1)
        .join(" "),
      lastName:
        billingPayerName.length > 1
        && billingPayerName[billingPayerName.length - 1],
      address: billingLines && billingLines.length > 0 && billingLines[0],
      addressOpt:
        !isEmpty(billingLines) && billingLines.length > 1
          ? billingLines[1]
          : undefined,
      city: billingAddress.city,
      country: billingAddress.country,
      countryCode: billingAddress.countryCode,
      province: billingAddress.region,
      zip: billingAddress.postalCode,

      // saveAddress action expects off-spec so include
      // also as postal_code
      postal_code: billingAddress.postalCode,
      isBilling: true
    });

    // added billing address
    Facebook.logEvent("fb_mobile_billing_address", {
      fb_content_type: "express",
      fb_content_id: this.cart.id
    });

    // process payment to api
    let payResponse = await this._api.post("/carts/express/pay", {
      billingAddress: selectedBillingAddress,
      expressPaymentToken: response.details.paymentToken,
      email: response.payerEmail
    });

    // update the cart on completion
    if (payResponse && payResponse.data && payResponse.status === 200) {
      this.replace(payResponse.data);

      Facebook.logPurchase(this.amountTotal, this.cart.currency, {
        fb_content_type: "express",
        fb_content_id: this.cart.id,
        fb_num_items: 1
      });

      // add original _paymentResponse to help dismiss apple pay ui
      return {
        // reference to express payment response object
        ...payResponse.data,
        _paymentResponse: response
      };
    } else {
      return Promise.reject({
        // reference to express payment response object
        _paymentResponse: response,

        // api
        _wasFailed: true,
        _error: payResponse.error
      });
    }
  };

  _onExpressCheckoutFailure = (response = {}, message) => {
    assistantStore.cancel(message);

    // clear the current cart and refetch
    this.clear();
    this.fetch();

    // only close if user aborted failure
    if (
      response
      && response._paymentResponse
      && response._error.message !== "AbortError"
    ) {
      response._paymentResponse._paymentRequest.abort();
    }

    // present failure
    // if debug, console error for easy debugging
    DEBUG && console.log("[CartStore] Error", response);
    return {
      wasSuccessful: false,
      wasAborted:
        (response
          && response._error
          && response._error.message === "AbortError")
        || false,
      title: response._failureTitle || "Payment Failed",
      message:
        response._failureMessage
        || message
        || "We couldn't complete your purchase at this time",
      buttons: [{ text: "OK" }]
    };
  };

  onExpressCheckout = async ({ productId, color, size }) => {
    let response;

    // logging
    Facebook.logEvent("fb_mobile_express_pay", {
      fb_content_type: "apple_pay",
      fb_content: true
    });

    // block user progress until express is ready
    let message = "Hold on, I'm preparing your express checkout..";
    assistantStore.write(message, 10000, true);

    try {
      // clear the previous express cart,
      // then add to the express cart
      await this.destroy();
      response = await this.addItem({
        productId: productId,
        color: color,
        size: size,
        cartId: "express"
      });

      // TODO: assuming all add to cart errors are OOS
      if (response.error) {
        return this._onExpressCheckoutFailure(
          {
            _failureTitle: response.error.message || "Out of stock",
            _failureMessage:
              response.error.details || "This product is currently out of stock"
          },
          message
        );
      }

      // update cart before presenting apple pay sheet
      await this.fetch({ cartId: "express" });
      if (this.cart.stripeAccountId === "") {
        return this._onExpressCheckoutFailure(
          {},
          "This merchant does not support apple pay. Please add item to your cart"
        );
      }
      response = await this._launchExpressPayment();

      // sheet ready, so reveal and close assistant
      assistantStore.cancel(message);

      // wait for user to complete sheet
      response = await this._onUserAcceptPayment(response);
      response = await this._payExpressCheckout(response);
      if (!response._wasFailed) {
        await this.replace(response);
        let completionSummary = {
          wasSuccessful: true,
          cart: response,
          customerName: this.customerName,
          shippingDetails: this.shippingDetails,
          shippingExpectation: this.shippingExpectation,
          billingDetails: this.billingDetails,
          amountSubtotal: this.amountSubtotal,
          amountTaxes: this.amountTaxes,
          amountDiscount: this.amountDiscount,
          amountTotal: this.amountTotal,
          amountShipping: this.amountShipping
        };

        response._paymentResponse.complete("success");

        // revert the cart.
        // TODO: this needs to be cleaned up
        this.clear();

        // and finally pass out completion summary object for caller to present
        return completionSummary;
      } else {
        return this._onExpressCheckoutFailure(response, message);
      }
    } catch (evt) {
      return this._onExpressCheckoutFailure(evt, message);
    }
  };

  onShowSummary = () => {
    Facebook.logEvent("fb_mobile_show_summary", this.amountTotal || 0, {
      fb_content_id: this.cart.id
    });
  };
}

function daysUntil(targetDate) {
  return Moment(targetDate).diff(Moment(), "days");
}

function deliveryExpectation(min, max) {
  let expectation;
  if (!!min && !!max) {
    min = daysUntil(min);
    max = daysUntil(max);
    expectation = "Expected tomorrow";
    if (min < 1) {
      expectation = `Expected in ${max} days`;
    } else if (max > 1) {
      expectation = `Expected in ${min}-${max} days`;
    }
  } else {
    // no delivery expectation, standard message
    expectation = null;
  }

  return expectation;
}
