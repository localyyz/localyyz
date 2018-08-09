// custom
import { ApiInstance } from "localyyz/global";
import { runInAction } from "mobx";

import { Product as ProductModel } from "localyyz/models";

export default class ProductStore extends ProductModel {
  constructor(props) {
    super(props);
  }

  addFavourite = async () => {
    const resolve = await ApiInstance.post(`products/${this.id}/favourite`);
    if (!resolve.error) {
      runInAction("[ACTION] add product to favorite", () => {
        this.isFavorite = true;
      });
    }
    return resolve;
  };

  removeFavourite = async () => {
    const resolve = await ApiInstance.delete(`products/${this.id}/favourite`);
    if (!resolve.error) {
      runInAction("[ACTION] remove product to favorite", () => {
        this.isFavorite = false;
      });
    }
    return resolve;
  };

  toggleFavorite = async () => {
    return await (this.isFavourite
      ? this.removeFavourite()
      : this.addFavourite());
  };
}
