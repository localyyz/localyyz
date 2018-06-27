// custom
import { ApiInstance } from "localyyz/global";

// third party
import { observable, computed, action } from "mobx";

export default class MenuUIStore {
  constructor(userStore) {
    this.api = ApiInstance;
    this.user = userStore;

    // bindings
    this.setGender = this.setGender.bind(this);
  }

  @computed
  get userGender() {
    return this.user.gender;
  }

  async setGender(gender) {
    let response = await this.api.put("users/me", { gender: gender });
    if (response && response.status < 400 && response.data) {
      this.user.model.update(response.data);
    }
  }
}
