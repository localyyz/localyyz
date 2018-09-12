// custom
import { ApiInstance } from "localyyz/global";
import { Cart } from "localyyz/models";

// third party
import { observable, runInAction } from "mobx";

export default class OrdersUIStore {
  @observable orders = [];

  fetch = async () => {
    const resolved = await ApiInstance.get("/users/me/orders");
    if (!resolved.error) {
      runInAction("[ACTION] fetch orders", () => {
        this.orders = resolved.data.map(order => new Cart(order));
      });
    }
    return resolved;
  };
}
