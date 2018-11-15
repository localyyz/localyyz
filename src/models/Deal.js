import { action, observable, computed } from "mobx";

// third party
import Moment from "moment";

// custom
import { Product } from "~/src/stores";

// constants
const DEBUG = false;
const DELAY = 2000;

export default class Deal {
  @observable id = 0;
  @observable name = "";
  @observable description = "";
  @observable info = "";
  @observable productList = [];
  @observable startAt = "";
  @observable endAt = "";
  @observable cap = 0;
  @observable code = "";
  @observable products = [];
  @observable dealType = "";
  @observable dealTab = "";
  @observable imageUrl = "";

  // internally used (not provided by api) to track origin uri
  // for direct fetching
  @observable origin = "";

  constructor(deal) {
    this.update(deal);
  }

  @action
  update(data) {
    for (let k in data) {
      // prevent private things from being added
      if (data[k]) {
        this[k] = data[k];
      }
    }

    // products
    if (data.products) {
      this.products = data.products.map(
        product => new Product({ ...product, listTitle: `deal-${this.id}` })
      );
    }

    // inject delay into the startAt and endAt times to allow for server to process
    // status changes
    if (DELAY) {
      this.startAt = Moment(this.startAt)
        .add(DELAY, "ms")
        .toArray();
      this.endAt = Moment(this.endAt)
        .add(DELAY, "ms")
        .toArray();
    }
  }

  @computed
  get usersViewing() {
    return Math.max(
      0,
      this.products
        .map(product => product.liveViews || 0)
        .reduce((a, b) => a + b, 0)
    );
  }

  @computed
  get itemsSold() {
    return this.products
      .map(product => product.purchased || 0)
      .reduce((a, b) => a + b, 0);
  }

  @computed
  get quantityAvailable() {
    return Math.max(0, (this.cap || 0) - this.itemsSold);
  }

  @computed
  get percentageClaimed() {
    return Math.min(1, Math.max(0, this.cap ? this.itemsSold / this.cap : 1));
  }

  @computed
  get representativeProduct() {
    return (
      (this.products
        && (this.products || []).find(
          product => product.associatedPhotos.length > 0
        ))
      || {}
    );
  }

  @computed
  get productPhoto() {
    let product = this.representativeProduct;
    return (product.associatedPhotos && product.associatedPhotos[0]) || {};
  }

  @computed
  get msrp() {
    let product = this.representativeProduct;
    return product.previousPrice || product.price || 0;
  }

  equals(deal) {
    let idTest, signatureTest, claimedTest, viewTest;
    idTest = this.id === deal.id;
    signatureTest
      = this.products.map(product => product.id).join(",")
      === deal.products.map(product => product.id).join(",");
    claimedTest = this.percentageClaimed === deal.percentageClaimed;
    viewTest = this.usersViewing === deal.usersViewing;

    DEBUG
      && console.log(
        `[Deal] Diff: id ${idTest}, signature ${signatureTest}, view ${viewTest}, sold ${claimedTest}`
      );
    return idTest && signatureTest && claimedTest && viewTest;
  }
}
