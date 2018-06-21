// custom
import { ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";

// third party
import { observable, runInAction } from "mobx";

export default class OrdersUIStore {
  @observable orders = [];

  constructor() {
    this.api = ApiInstance;
  }

  fetch = async () => {
    const response = await this.api.get("carts/completed");
    return (
      response
      && response.data
      && (await runInAction("[ACTION] fetch orders", () => {
        this.orders.replace(response.data.map(order => new Cart(order)));
      }))
    );
  };
}
