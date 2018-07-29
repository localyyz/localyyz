// third party
import { observable, action } from "mobx";

export default class ConfirmationUIStore {
  @observable checkoutError;
  @observable paymentError;
  @observable isProcessing = false;

  constructor(checkoutError, paymentError) {
    // bindings
    this.setCheckoutError = this.setCheckoutError.bind(this);
    this.setPaymentError = this.setPaymentError.bind(this);
    this.toggleProcessing = this.toggleProcessing.bind(this);

    // init
    this.setCheckoutError(checkoutError);
    this.setPaymentError(paymentError);
  }

  @action
  setCheckoutError(error) {
    this.checkoutError = error;
  }

  @action
  setPaymentError(error) {
    this.paymentError = error;
  }

  @action
  toggleProcessing(isProcessing) {
    this.isProcessing
      = isProcessing == null ? !this.isProcessing : isProcessing;
  }
}
