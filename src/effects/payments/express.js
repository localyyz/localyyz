
// used as interface for all Express payments, don't use this
// directly, but a concrete implementation of it.
class ExpressPayment {

  /*
   * Creates a new ExpressPayment.
   *
   * @param [items].amount the amount for this item.
   * @param [items].label the label for this item.
   * @param options.[shipping].id the internal shipping
   *  method id.
   * @param options.[shipping].label a label for the shipping
   *  method, shown on Apple Pay interface.
   * @param options.[shipping].detail description.
   * @param options.[shipping].amount cost of the shipping.
   * @param options.[methods] can be of the following:
   *  american_express, discover, master_card, visa.
   * @param options.currency default is CAD if not specified.
   * @param options.country default is CA if not specified.
   */
  constructor(items, options) {
    this._items = items;
    this._options = options;
  }

  /*
   * Sends a payment request out.
   *
   * @return similar object following the dummy stub below or
   *  false if it didn't work.
   */
  request = async () => {
    return {
      token: 'dummy-token-id',
      type: 'dummy',
      created: 0,
      props: {
        label: 'Dummy Charge',
        amount: 0,
        currency: 'usd',
        name: 'Johnny Appleseed',
        phoneNumber: '0',
        emailAddress: 'johnny@appleseed.com',
        street: '1 Infinite Loop',
        city: 'Cupertino',
        region: 'CA',
        country: 'United States',
        countryCode: 'US',
        postalCode: '95014'
      }
    };
  }

  /*
   * Processes the charge and completes the payment.
   *
   * @return true if successful, o/w false
   */
  finalize = async () => {
    return true;
  }

  /*
   * Cancels this ExpressPayment.
   *
   * @return true if successful, o/w false
   */
  cancel = async () => {
    return true;
  }

  /*
   * Determines if this ExpressPayment is supported.
   *
   * @return true if supported, o/w false
   */
  isSupported = async () => {
    return true;
  }
}

export default ExpressPayment;
