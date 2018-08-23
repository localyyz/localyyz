import { runInAction } from "mobx";

// custom
import { GA, ApiInstance } from "localyyz/global";
import { Product as ProductModel } from "localyyz/models";
import { Colours } from "localyyz/constants";

import { navbarStore } from "localyyz/stores";

export default class ProductStore extends ProductModel {
  static fetch = async productId => {
    const resolve = await ApiInstance.get(`products/${productId}`);
    if (!resolve.error) {
      GA.trackEvent("product", "view", `${productId}`);
      return new Promise.resolve({
        product: new ProductStore(resolve.data)
      });
    }
    return resolve;
  };

  constructor(product, selectedColor) {
    super(product, selectedColor);
  }

  addFavourite = async () => {
    const resolve = await ApiInstance.post(`products/${this.id}/favourite`);
    if (!resolve.error) {
      GA.trackEvent("favourite", "add", `${this.id}`, this.price);
      runInAction("[ACTION] add product to favourite", () => {
        this.isFavourite = true;
        navbarStore.notify(
          "Added to favourites!",
          undefined,
          undefined,
          2000, // 2 seconds
          Colours.Accented,
          undefined,
          undefined
        );
      });
    }
    return resolve;
  };

  removeFavourite = async () => {
    const resolve = await ApiInstance.delete(`products/${this.id}/favourite`);
    GA.trackEvent("favourite", "remove", `${this.id}`, this.price);
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
