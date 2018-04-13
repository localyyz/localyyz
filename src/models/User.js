import { computed, observable, action, toJS } from "mobx";

export default class User {
  @observable id;
  @observable username = "";
  @observable email = "";
  @observable name = "";
  @observable avatarUrl = "";
  @observable network = "";
  @observable etc;
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
