// third party
import { action, observable, computed } from "mobx";

// constants
const FREE_SHIPPING_IDS = { 4164: true };

export default class Place {
  @observable id = 0;
  @observable distance = 0.0;
  @observable name = "";
  @observable phone = "";
  @observable address = "";
  @observable website = "";
  @observable description = "";
  @observable imageUrl = "";
  @observable createdAt = "";

  @observable productCount = 0;
  @observable following = false;

  constructor(place) {
    this.update(place);
  }

  @action
  update(data) {
    for (let k in data) {
      // prevent private things from being added
      if (data[k]) {
        this[k] = data[k];
      }
    }
  }

  @computed
  get hasFreeShipping() {
    return !!FREE_SHIPPING_IDS[this.id];
  }
}
