// custom
import { navbarStore, cartStore } from "localyyz/stores";
import { Alert } from "react-native";
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
    this.cartStore = cartStore;
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

    if (!this.cartStore.email) {
      throw {
        alertButtons: [{ text: "OK" }],
        alertTitle: "Invalid Email",
        alertMessage: "Please add a email address"
      };
    }

    if (
      !(
        this.cartStore.shippingDetails && this.cartStore.shippingDetails.address
      )
    ) {
      Alert.alert("Checkout failed", "missing shipping address");
      throw {};
    }

    if (
      !(this.cartStore.paymentDetails && this.cartStore.paymentDetails.ready)
    ) {
      this.togglePayment(true);
      this.toggleItems(false);
      throw {};
    }

    if (
      !(this.cartStore.billingDetails && this.cartStore.billingDetails.address)
    ) {
      Alert.alert("Checkout failed", "missing billing address");
      throw {};
    }

    if (this.cartStore.hasItemError) {
      this.setItemSizeType(ITEM_SIZE_FULL);
      throw {
        alertButtons: [{ text: "OK" }],
        alertTitle: "Some items are out of stock",
        alertMessage: "Please remove them from your cart"
      };
    }

    if (this.cartStore.isEmpty) {
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
      cart: this.cartStore.cart,
      customerName: this.cartStore.customerName,
      shippingDetails: this.cartStore.shippingDetails,
      billingDetails: this.cartStore.billingDetails,
      shippingExpectation: this.cartStore.shippingExpectation,
      amountSubtotal: this.cartStore.amountSubtotal,
      amountTaxes: this.cartStore.amountTaxes,
      amountDiscount: this.cartStore.amountDiscount,
      amountTotal: this.cartStore.amountTotal,
      amountShipping: this.cartStore.amountShipping,
      paymentType: this.cartStore.paymentType,
      paymentLastFour: this.cartStore.paymentLastFour
    };
  }
}
