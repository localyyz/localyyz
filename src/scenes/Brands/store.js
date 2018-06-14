// custom
import { ApiInstance } from "localyyz/global";

import { Product } from "localyyz/models";

// third party
import { observable, runInAction, computed } from "mobx";

export default class BrandsStore {
  @observable featured = [];
  @observable _brands = [];

  constructor(path) {
    this.path = path;
    this.api = ApiInstance;

    // pagination
    this.self = null;
    this.next = null;
    this.isLoading = false;
  }

  // TODO: make brand a MODEL
  newBrand = brand => {
    return {
      ...brand,
      products: brand.products.map(p => new Product(p))
    };
  };

  fetchNextPage() {
    if ((!this.isLoading && this.next) || !this.self) {
      this.isLoading = true;
      ApiInstance.get(this.next ? this.next.url : `${this.path}`).then(
        response => {
          if (response && response.data) {
            this.next = response.link.next;
            this.self = response.link.self;

            // data
            runInAction("[ACTION] fetching brands", () => {
              response.data.forEach(brand => {
                return this._brands.push(this.newBrand(brand));
              });
            });
          }

          // finish the request
          this.isLoading = false;
        }
      );
    }
  }

  fetchFeatured() {
    ApiInstance.get(`${this.path}/featured`).then(response => {
      response
        && response.data
        && runInAction("[ACTION] fetching featured", () => {
          response.data.forEach(brand => {
            brand = this.newBrand(brand);
            this.featured.push(brand);
          });
        });
    });
  }

  @computed
  get brands() {
    return [...this.featured, ...this._brands];
  }
}
