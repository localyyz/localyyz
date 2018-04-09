import { observable, action, computed, toJS } from "mobx";

class UserAddress {
  @observable firstName;
  @observable lastName;
  @observable address;
  @observable addressOpt = "";
  @observable city;
  @observable country;
  @observable countryCode;
  @observable province;
  @observable provinceCode;
  @observable zip;

  @observable isShipping;
  @observable isBilling;

  // NOTE: apple pay sends partial addresses
  // before an user accepts the payment. this
  // flag indicates if the address is partial
  @observable isPartial;

  constructor(address) {
    this.set(address);
  }

  @action set(address) {
    for (let k in address) {
      this[k] = address[k];
    }
  }

  @computed get formatted_address() {
    return `
${this.firstName} ${this.lastName}
${this.addressOpt}
${this.address}
${this.city}, ${this.province} ${this.zip}
${this.country}
    `.trim();
  }

  @computed get shortAddress() {
    return this.address;
  }

  @computed get extendedAddress() {
    return (this.addressOpt ? `${this.addressOpt}, `: "")
      + (this.city ? `${this.city}, `: "")
      + (this.province ? `${this.province}`: "")
      + (this.zip ? ` ${this.zip}, `: ", ")
      + (this.country || "");
  }

  @computed get fullAddress() {
    return `${this.shortAddress}, ${this.extendedAddress}`;
  }

  toJS() {
    return toJS(this);
  }
}

export default UserAddress;
