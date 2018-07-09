// custom
import { ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";

// third party
import { observable, runInAction, computed } from "mobx";

export default class OrdersUIStore {
  @observable completed = [];
  @observable payment_success = [];

  constructor() {
    this.api = ApiInstance;
  }

  @computed
  get orders() {
    return [...this.payment_success, ...this.completed];
  }

  fetch = async type => {
    if (type) {
      const response = await this.api.get(`carts/${type}`);
      return (
        response
        && response.data
        && (await runInAction("[ACTION] fetch orders", () => {
          this[type].replace(response.data.map(order => new Cart(order)));
        }))
      );
    } else {
      // fetch all known types since none given
      this.fetch("completed");
      this.fetch("payment_success");
    }
  };
}
