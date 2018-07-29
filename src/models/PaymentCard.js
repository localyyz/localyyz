// third party
import { action, observable, computed } from "mobx";
import padStart from "lodash.padstart";

// consts
const DEBUG = false;
const DEBUG_NUMBER = "4242 4242 4242 4242";
const DEBUG_CVC = "222";
const DEBUG_EXPIRY_MONTH = "11";
const DEBUG_EXPIRY_YEAR = "22";
const DEBUG_CARDHOLDER = "Johnny Appleseed";

const DEBUG_CARD = {
  number: DEBUG_NUMBER,
  cvc: DEBUG_CVC,
  expiryMonth: DEBUG_EXPIRY_MONTH,
  expiryYear: DEBUG_EXPIRY_YEAR,
  expiry: `${DEBUG_EXPIRY_MONTH}/${DEBUG_EXPIRY_YEAR}`,
  name: DEBUG_CARDHOLDER,

  // validity checks
  nameValid: true,
  cvcValid: true,
  expiryValid: true,
  numberValid: true,
  // aggregated check
  ready: true
};

export default class PaymentCard {
  @observable number;
  @observable cvc;
  @observable expiryMonth;
  @observable expiryYear;
  @observable name;

  // validity checks
  @observable nameValid;
  @observable cvcValid;
  @observable expiryValid;
  @observable numberValid;

  // aggregated check
  @observable ready;

  constructor(props) {
    this.update(props || (DEBUG ? DEBUG_CARD : {}));
  }

  // converts to server spec, legacy from rn-cc-input
  @computed
  get toServerCard() {
    let expiryMonth = `${this.expiryMonth || ""}`;
    let expiryYear = `${this.expiryYear || ""}`;

    return {
      number: this.number,
      expiry: `${padStart(expiryMonth, 2, "0")}/${padStart(
        expiryYear,
        2,
        "0"
      )}`,
      cvc: this.cvc,
      name: this.name
    };
  }

  @computed
  get isComplete() {
    return (
      this.number
      && this.cvc
      && this.expiryMonth
      && this.expiryYear
      && this.name
    );
  }

  // TODO/NOTE: should field validation be here?
  // or leave as component/ui exercize?

  @action
  update(props) {
    for (let k in props) {
      this[k] = props[k];
    }
  }
}
