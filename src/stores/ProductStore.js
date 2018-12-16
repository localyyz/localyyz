import { runInAction } from "mobx";
import branch from "react-native-branch";

// custom
import { GA, ApiInstance } from "localyyz/global";
import { Product as ProductModel } from "localyyz/models";
import { Colours } from "localyyz/constants";

import { navbarStore } from "localyyz/stores";

export default class ProductStore extends ProductModel {
  static fetch = async productId => {
    const resolve = await ApiInstance.get(`products/${productId}`);
    if (!resolve.error) {
      // app.js trackScreen is also handling product view events
      return new Promise.resolve({
        product: new ProductStore(resolve.data)
      });
    }
    return new Promise.resolve({ error: resolve.error });
  };

  constructor(product, selectedColor) {
    super(product, selectedColor);
  }

  fetchRelated = async () => {
    const response = await ApiInstance.get(`/products/${this.id}/related`);
    if (response && response.data) {
      let products = response.data.map(p => {
        return new ProductStore({
          ...p,
          description: p.noTagDescription,
          listTitle: `Related ${this.title}`
        });
      });
      return new Promise.resolve({ products: products });
    }
    return new Promise.resolve({ error: response.error });
  };

  addFavourite = async () => {
    const resolve = await ApiInstance.post(`products/${this.id}/favourite`);
    if (!resolve.error) {
      GA.trackEvent("favourite", "add", `${this.id}`, this.price, {
        products: [this.toGA()],
        productAction: {
          // ecommerce: product click
          // -> view is for navigating to product scene
          action: GA.ProductActions.Click
        }
      });
      runInAction("[ACTION] add product to favourite", () => {
        this.isFavourite = true;
        navbarStore.notify("Added to favourites!", {
          duration: 2000, // 2 seconds
          backgroundColor: Colours.Accented
        });
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

  generateDeepLink = async () => {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      `product:${this.id}`,
      {
        locallyIndex: true,
        title: this.title,
        contentDescription: this.description
      }
    );

    let controlParams = {
      destination: "product",
      destination_id: this.id
    };

    let { url } = await branchUniversalObject.generateShortUrl(
      {},
      controlParams
    );

    return url;
  };
}
