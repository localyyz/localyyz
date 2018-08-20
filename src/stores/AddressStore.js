import { UserAddress } from "localyyz/models";
import { observable, action, runInAction } from "mobx";
import { ApiInstance } from "localyyz/global";

export default class AddressStore {
  @observable addresses = [];

  constructor() {
    this.api = ApiInstance;
  }

  // address actions
  @action
  fetch = async () => {
    const response = await this.api.get("/users/me/address");
    return (
      response
      && response.data
      && (await runInAction("[ACTION] fetch addresses", () => {
        // sub in address model and set the first to default
        this.addresses.replace(
          response.data.map(address => new UserAddress(address))
        );
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

    return response && response.status < 400
      ? (await this.fetch()) && response.data
      : response;
  };

  @action
  update = async address => {
    const response = await this.api.put(
      `/users/me/address/${address.id}`,
      address
    );

    return response && response.status < 400
      ? (await this.fetch()) && response.data
      : response;
  };

  @action
  remove = async addressId => {
    const response = await this.api.delete(`/users/me/address/${addressId}`);

    return response && response.status < 400
      ? (await this.fetch()) && response
      : response;
  };
}
