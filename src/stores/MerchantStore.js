import { runInAction } from "mobx";

// custom
import { ApiInstance, GA } from "~/src/global";

import { Place } from "~/src/models";

export default class MerchantStore extends Place {
  constructor(place) {
    super(place);
  }

  addFavourite = async () => {
    const resolve = await ApiInstance.post(`places/${this.id}/favourite`);
    if (!resolve.error) {
      runInAction("[ACTION] add product to favourite", () => {
        this.isFavourite = true;
      });
      GA.trackEvent("merchant", "add favourite", `${this.id}`, 0);
    }
    return resolve;
  };

  removeFavourite = async () => {
    const resolve = await ApiInstance.delete(`places/${this.id}/favourite`);
    GA.trackEvent("merchant", "remove favourite", `${this.id}`, 0);
    if (!resolve.error) {
      runInAction("[ACTION] remove product to favourite", () => {
        this.isFavourite = false;
      });
    }
    return resolve;
  };

  toggleFavourite = () => {
    this.isFavourite ? this.removeFavourite() : this.addFavourite();
  };
}
