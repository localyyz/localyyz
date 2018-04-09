import { UserAddress } from "localyyz/models";
import { observable, action, runInAction } from "mobx";
import { ApiInstance } from "localyyz/global";

export default class UserStore {
  @observable addresses = [];

  constructor() {
    this.api = ApiInstance;
  }

  // address actions
  @action
  fetch = async () => {
    const response = await this.api.get("/users/me/address");
    return (
      response &&
      response.data &&
      (await runInAction("[ACTION] fetch addresses", () => {
        // sub in address model and set the first to default
        this.addresses = response.data.map(address => new UserAddress(address));
        if (this.addresses.length > 0) {
          this.addresses[0].isDefault = true;
        }

        return this.addresses;
      }))
    );
  };

  @action
  add = async address => {
    // send and update address list
    const response = await this.api.post("/users/me/address", address);
    if (response && response.status < 400) {
      return await this.fetch();
    }
  };

  @action
  remove = async addressId => {
    const response = await this.api.delete(`/users/me/address/${addressId}`);
    if (response && response.status < 400) {
      return await this.fetch();
    }
  };
}
