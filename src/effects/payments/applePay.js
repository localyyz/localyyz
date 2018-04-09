import ExpressPayment from "./express";
import { STRIPE_PUB_KEY, STRIPE_DEF_MERCHANT_ID } from "localyyz/constants";

// 3rd party
import { PaymentRequest } from "react-native-payments";

// docs in express.js
class ApplePayExpressPayment extends ExpressPayment {

  /* Creates a new Apple Pay request.
   *
   * @param target Used to identify the merchant, usually
   *  MerchantId, specific to ExpressPayment method.
   */
  constructor(target, items = [], options = {}) {
    super(items, options);
    this._currency = options.currency || "USD";
  }

  onAddressUpdate = async event => {

    // send the updated address to remote server
    // need to wait for the report server to sync
    await this._options.updateShippingAddress(event.target.shippingAddress);

    // NOTE: only refetch the shipping methods if user is change address
    // if this is updated when user accepted the payment, do not refetch
    // shipping methods
    if (event.target.shippingAddress.isPartial) {

      // (re)fetch the new shipping rates and update applePay UI
      const methods = await this._options.getShippingMethods();

      // mutate shipping methods with async returned ones
      methods && Object.assign(this._options, { shipping: methods });

      // TODO: dosn't need the whole option object
      // just need shipping methods -> save on the store side?
      event.updateWith(this._options.buildPaymentDetails(this._options));
    }
  };

  onShippingMethodUpdate = async event => {

    // send the updated address to remote server
    // need to wait for the report server to sync
    await this._options.updateShippingMethod(event.target.shippingOption);
    event.updateWith(this._options.buildPaymentDetails(this._options));
  };

  request = () => {
    let paymentRequest = new PaymentRequest(
      [
        {
          supportedMethods: ["apple-pay"],
          data: {
            merchantIdentifier: this._options.merchantId ||
              STRIPE_DEF_MERCHANT_ID,
            supportedNetworks: this._options.networks || [
              "visa",
              "mastercard",
              "amex"
            ],

            // TODO: pass in the correct country code
            countryCode: this._options.country || "US",
            currencyCode: this._options.currency,
            paymentMethodTokenizationParameters: {
              parameters: {
                gateway: "stripe",
                "stripe:publishableKey": STRIPE_PUB_KEY,
                "stripe:accountId": this._options.stripeAccountId
                //"stripe:version": "5.0.0" // Only required on Android
              }
            }
          }
        }
      ],
      this._options.buildPaymentDetails(this._options),
      {
        requestPayerName: this._options.requestName,
        requestPayerPhone: this._options.requestPhone,
        requestPayerEmail: this._options.requestEmail,
        requestShipping: this._options.requestShipping,
        requestBilling: this._options.requestBilling
      }
    );

    // TODO: tidy this up, currently convoluted by injecting items and options
    // into scope for mutation via function returning a function
    this._paymentRequest = paymentRequest;

    if (this._options.requestShipping) {
      this._paymentRequest.addEventListener(
        "shippingaddresschange",
        this.onAddressUpdate
      );
      this._paymentRequest.addEventListener(
        "shippingoptionchange",
        this.onShippingMethodUpdate
      );
    }

    return this._paymentRequest.show();
  };

  // TODO: this ReactNativePayments is not handling stub very well;
  // need to give it all the functions
  //isSupported = () => {
    //let stub = new PaymentRequest(
      //[
        //{
          //supportedMethods: ["apple-pay"],
          //data: {}
        //}
      //],
      //{
        //id: "mock",
        //total: {
          //label: "mock total",
          //amount: { currency: "USD", value: "15.00" }
        //}
      //},
    //)
    //stub.addEventListener("shippingaddresschange", () => {});
    //stub.addEventListener("shippingoptionchange", () => {});

    //return stub.canMakePayments()
  //}
}

export default ApplePayExpressPayment;
