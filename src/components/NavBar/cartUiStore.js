// custom
import { navbarStore, cartStore } from "localyyz/stores";
import {
  PULLUP_LOW_SPAN,
  PULLUP_FULL_SPAN,
  HEIGHT_THRESHOLD_TYPES
} from "./components/Pullup";

// third party
import { observable, action, reaction } from "mobx";

// constants
const DEFAULT_ITEM_SIZE_TYPE = 0;
const ITEM_SIZE_TINY = 0;
const ITEM_SIZE_MEDIUM = 1;
const ITEM_SIZE_FULL = 2;

export default class CartUIStore {
  @observable name;

  // visibility
  @observable isItemsVisible = true;
  @observable isAddressVisible = false;
  @observable isBillingVisible = false;
  @observable isPaymentVisible = false;

  // sizes
  @observable itemSizeType = DEFAULT_ITEM_SIZE_TYPE;

  // helper values
  @observable defaultName = "";

  constructor() {
    this.navbar = navbarStore;
    this.cart = cartStore;
    this.toggleItems = this.toggleItems.bind(this);
    this.togglePayment = this.togglePayment.bind(this);
    this.setItemSizeType = this.setItemSizeType.bind(this);
    this.getCheckoutSummary = this.getCheckoutSummary.bind(this);
    this.setDefaultName = this.setDefaultName.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.setFullscreenPullup = this.setFullscreenPullup.bind(this);
    this.setMinimizedPullup = this.setMinimizedPullup.bind(this);
  }

  @action
  setFullscreenPullup() {
    this.navbar.setPullupHeight(PULLUP_FULL_SPAN, PULLUP_FULL_SPAN);
  }

  @action
  setMinimizedPullup() {
    this.navbar.setPullupHeight(PULLUP_LOW_SPAN, PULLUP_LOW_SPAN);
  }

  @action
  toggleItems(visible) {
    this.isItemsVisible = visible != null ? visible : !this.isItemsVisible;
    this.isItemsVisible && this.setFullscreenPullup();
  }

  @action
  togglePayment(visible) {
    this.isPaymentVisible = visible != null ? visible : !this.isPaymentVisible;
    this.isPaymentVisible && this.setFullscreenPullup();
  }

  @action
  setItemSizeType(type) {
    this.itemSizeType = type != null ? type : 0;
  }

  @action
  setDefaultName(name) {
    this.defaultName = name;
  }

  closeAll() {
    this.togglePayment(false);

    // reset height for next launch
    this.setMinimizedPullup();
  }

  pullupReaction = reaction(
    () => ({
      isVisible: navbarStore.isPullupVisible,
      closestHeight: navbarStore._pullupClosestHeight
    }),
    pullup => {
      this.setItemSizeType(
        pullup.isVisible
          ? HEIGHT_THRESHOLD_TYPES[pullup.closestHeight]
          : DEFAULT_ITEM_SIZE_TYPE
      );

      // if closing, then close everything (defocusing forms)
      !pullup.isVisible && this.closeAll();
    }
  );

  // validate forms
  validate = () => {
    this.setFullscreenPullup();

    if (!(this.cart.shippingDetails && this.cart.shippingDetails.address)) {
      this.toggleItems(false);
      throw {};
    }

    if (!(this.cart.paymentDetails && this.cart.paymentDetails.ready)) {
      this.togglePayment(true);
      this.toggleItems(false);
      throw {};
    }

    if (!(this.cart.billingDetails && this.cart.billingDetails.address)) {
      this.toggleItems(false);
      throw {};
    }

    if (this.cart.hasItemError) {
      this.setItemSizeType(ITEM_SIZE_FULL);
      throw {
        alertButtons: [{ text: "OK" }],
        alertTitle: "Some items are out of stock",
        alertMessage: "Please remove them from your cart"
      };
    }

    if (this.cart.isEmpty) {
      throw {
        alertButtons: [{ text: "OK" }],
        alertTitle: "Your cart is empty",
        alertMessage: "Please add a product to your cart"
      };
    }
  };

  getCheckoutSummary() {
    return {
      // static vars for when summary is completed, so when store
      // cart resets, display remains on props
      cart: this.cart.cart,
      customerName: this.cart.customerName,
      shippingDetails: this.cart.shippingDetails,
      billingDetails: this.cart.billingDetails,
      shippingExpectation: this.cart.shippingExpectation,
      amountSubtotal: this.cart.amountSubtotal,
      amountTaxes: this.cart.amountTaxes,
      amountDiscount: this.cart.amountDiscount,
      amountTotal: this.cart.amountTotal,
      amountShipping: this.cart.amountShipping,
      paymentType: this.cart.paymentType,
      paymentLastFour: this.cart.paymentLastFour
    };
  }
}
