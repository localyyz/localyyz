import { Animated } from "react-native";

// third party
import { observable, runInAction, computed } from "mobx";

// custom
import { ApiInstance } from "localyyz/global";
import { Product } from "localyyz/models";

// constants
const DEBUG = false;
const REFRESH_INTERVAL = 5000;

export default class ActiveDealUIStore {
  @observable products = [];

  constructor(deal) {
    // bindings
    this.isDiff = this.isDiff.bind(this);

    // data
    this.deal = deal;
    this.progress = new Animated.Value(0);
    this.refresh();
  }

  @computed
  get usersViewing() {
    return this.products
      .map(product => product.viewing || 0)
      .reduce((a, b) => a + b, 0);
  }

  @computed
  get itemsSold() {
    return this.products
      .map(product => product.sold || 0)
      .reduce((a, b) => a + b, 0);
  }

  @computed
  get quantityAvailable() {
    return (this.deal.limit || 0) - this.itemsSold;
  }

  @computed
  get percentageClaimed() {
    return this.deal.limit ? this.itemsSold / this.deal.limit : 1;
  }

  refresh(interval = REFRESH_INTERVAL) {
    this.fetch().then(() => {
      this._refreshTimeout && clearTimeout(this._refreshTimeout);

      // fire first, then wait
      this._refreshTimeout = setTimeout(() => this.refresh(interval), interval);
    });
  }

  isDiff(newProducts) {
    let signatureTest, viewCountTest, soldQuantityTest;
    signatureTest = this.products.join(",") !== newProducts.join(",");
    viewCountTest = this.products.some(
      product =>
        (newProducts.find(p => p.id === product.id) || {}).viewing
        !== product.viewing
    );
    soldQuantityTest = this.products.some(
      product =>
        (newProducts.find(p => p.id === product.id) || {}).sold > product.sold
    );

    DEBUG
      && console.log(
        `[ActiveDeal] Diff: signature ${signatureTest}, view ${viewCountTest}, sold ${soldQuantityTest}`
      );
    return signatureTest || viewCountTest || soldQuantityTest;
  }

  async fetch() {
    let response = await ApiInstance.get(
      `collections/${this.deal.id}/products`
    );
    if (response && response.status < 400 && response.data) {
      let isDiff = this.isDiff(response.data || []);
      isDiff
        && runInAction("[ACTION] Fetching products for Today's deal", () => {
          this.products = [
            ...response.data.map(product => new Product(product))
          ];

          // update progress
          Animated.timing(this.progress, {
            toValue: this.percentageClaimed
          }).start();
        });
    }
  }
}
