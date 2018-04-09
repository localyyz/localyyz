// custom
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";

// third party
import { observable, action, runInAction, when } from "mobx";

export default class HomeStore {
  @observable featuredProducts;
  @observable discountedProducts;
  @observable _isInitialized = false;

  constructor(loginStore) {
    this.api = ApiInstance;
    this.login = loginStore;

    // _initialized is needed to monitor loginStore initialization
    // mobx will not react when this.login becomes truthy
    runInAction("[ACTION] done initialized", () => {
      this._isInitialized = true;
    });
  }

  // when the app logs the user in (or skips login) fetch home products
  reactLogin = when(
    () =>
      this._isInitialized &&
      (this.login._wasLoginSuccessful || this.login._wasLoginSkipped),
    () => {
      this.fetchFeaturedProducts();
      this.fetchDiscountedProducts();
    }
  );

  @action
  fetchFeaturedProducts = async () => {
    const response = await this.api.get("products/featured", {
      limit: 6
    });

    runInAction("[FETCH] featured", () => {
      this.featuredProducts =
        response && response.data
          ? response.data.map(
              p =>
                new Product({
                  ...p,
                  description: p.noTagDescription,
                  titleWordsLength: 3,
                  descriptionWordsLength: 10
                })
            )
          : [];
    });
  };

  @action
  fetchDiscountedProducts = async () => {
    const response = await this.api.get("products/onsale", {
      limit: 25
    });

    runInAction("[FETCH] discounted", () => {
      this.discountedProducts =
        response && response.data
          ? response.data.map(
              p =>
                new Product({
                  ...p,
                  description: p.noTagDescription,
                  titleWordsLength: 3,
                  descriptionWordsLength: 10
                })
            )
          : [];
    });
  };
}
