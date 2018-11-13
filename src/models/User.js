import { computed, observable, action, toJS } from "mobx";

export default class User {
  @observable id;
  @observable username = "";
  @observable email = "";
  @observable name;
  @observable avatarUrl = "";
  @observable network = "";
  @observable etc;
  @observable prf;
  @observable gender;
  @observable inviteCode;

  @observable loggedIn;
  @observable lastLoginAt;
  @observable createdAt;

  // authentication token
  @observable jwt;

  constructor(user) {
    if (user) {
      this.update(user);
    }
  }

  @computed
  get shouldOnboard() {
    return !this.prf;
  }

  @computed
  get shouldOnboardRightAway() {
    // if the user id is even and
    // was created in the last 5 min.
    // onboard them right away
    return this.shouldOnboard && this.etc && this.etc.autoOnboard;
  }

  @computed
  get hasSession() {
    return Boolean(this.id);
  }

  @computed
  get displayName() {
    return (this.etc && this.firstName) || this.name || "";
  }

  @computed
  get token() {
    return this.jwt;
  }

  @action
  update(user) {
    for (let k in user) {
      // prevent private things from being added
      if (user[k]) {
        this[k] = user[k];
      }
    }
    this.gender = user.etc.gender;
  }

  @computed
  get genderPreference() {
    if (this.prf && this.prf.gender) {
      return this.prf.gender[0];
    }

    if (this.etc) {
      switch (this.etc.gender) {
        case "male":
          return "man";
        case "female":
          return "woman";
        default:
          return null;
      }
    }

    return null;
  }

  @action
  reset() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.name = null;
    this.gender = null;
    this.jwt = null;
    this.etc = null;
    this.firstName = null;
    this.loggedIn = null;
  }

  toJSON() {
    return toJS(this);
  }
}
