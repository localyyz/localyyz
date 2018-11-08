// third party
import { observable, computed, action } from "mobx";
import Moment from "moment";

import { GA } from "~/src/global";

export default class CartUIStore {
  @observable nextSceneIsReady = true;
  @observable scrollEnabled = true;

  constructor(cartStore, addressStore) {
    // bindings
    this.setNextReady = this.setNextReady.bind(this);
    this.completeCheckout = this.completeCheckout.bind(this);
    this.completePayment = this.completePayment.bind(this);
    this.navigateNext = this.navigateNext.bind(this);
    this.setScrollEnabled = this.setScrollEnabled.bind(this);

    // transport layer cartstore used to update and submit cart data to server
    this.cart = cartStore;
    this.addresses = addressStore;

    // scene info, order matters
    this.scenes = [
      {
        id: "EmailScene",
        label: "Email",
        isComplete: () => {
          this.trackGACheckout("Email", 1);
          return this.cart.isEmailComplete;
        }
      },
      {
        id: "ShippingScene",
        label: "Shipping",
        isComplete: () => {
          this.trackGACheckout("Shipping", 2);
          return (
            this.cart.isShippingAddressComplete
            && this.addresses.addresses.length > 0
          );
        }
      },
      {
        id: "PaymentScene",
        label: "Payment",
        isComplete: () => {
          this.trackGACheckout("Payment", 3);
          return (
            this.cart.isBillingAddressComplete
            && this.cart.isPaymentDetailsComplete
          );
        }
      },
      {
        id: "ConfirmationScene",
        label: "Confirmation",
        isComplete: () => {
          this.trackGACheckout("Confirmation", 4);
        }
      },
      {
        id: "DiscountScene",
        label: "Add a coupon",
        isHidden: true
      }
    ];
  }

  @action
  async completeCheckout() {
    // update the cart
    let resolved = await this.cart.syncToDb();

    // make sure sync to db worked
    if (!resolved.error) {
      resolved = await this.cart.checkout();
    }

    return resolved;
  }

  @action
  setNextReady(isReady) {
    this.nextSceneIsReady = isReady;
  }

  async completePayment() {
    let resolved = await this.cart.completePayment();
    return resolved;
  }

  trackGACheckout = (step, index) => {
    GA.trackEvent("checkout", step, null, 0, {
      products: this.cart.cartItems.map(ci => ci.product.toGA()),
      productAction: {
        action: GA.ProductActions.Checkout,
        checkoutStep: index
      }
    });
  };

  // responsible for routing to the first scene that's not complete
  async navigateNext(navigation) {
    // first, set loading status and disable button
    this.setNextReady(false);
    let nextScene = this.nextScene;

    // if we're at Confirmation, should preload checkout
    let { error }
      = (nextScene === "ConfirmationScene" && (await this.completeCheckout()))
      || {};

    // signal next scene ready and push error through
    return (
      this.setNextReady(true)
      || navigation.navigate(this.nextScene, error && { checkoutError: error })
    );
  }

  @action
  setScrollEnabled(enabled) {
    this.scrollEnabled = enabled;
  }

  get nextScene() {
    return this.scenes.find(
      scene => (scene.isComplete ? !scene.isComplete() : true)
    ).id;
  }

  // computed helpers
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
      this.cart.shippingAddress
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
    const parts
      = this.cart.paymentDetails && this.cart.paymentDetails.number
        ? this.cart.paymentDetails.number.split(" ")
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
      }[
        ((this.cart.paymentDetails && this.cart.paymentDetails.number) || "")[0]
      ] || "cc-stripe"
    );
  }

  @computed
  get checkoutSummary() {
    return {
      // static vars for when summary is completed, so when store
      // cart resets, display remains on props
      cart: this.cart && this.cart.toJS(),
      customerName: this.customerName,
      email: this.cart.email,
      shippingDetails: this.cart.shippingAddress,
      billingDetails: this.cart.billingAddress,
      shippingExpectation: this.shippingExpectation,

      // NOTE: these totals are in cents from the backend
      amountSubtotal: this.cart.subtotalPriceDollars,
      amountShipping: this.cart.totalShippingDollars,
      amountTaxes: this.cart.totalTaxDollars,
      amountDiscount: this.cart.totalDiscountDollars,
      amountTotal: this.cart.totalPriceDollars,

      // payment
      paymentType: this.paymentType,
      paymentLastFour: this.paymentLastFour
    };
  }
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
