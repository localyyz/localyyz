import { action, computed, runInAction, observable } from "mobx";

import { box } from "localyyz/helpers";
import { historyStore } from "localyyz/stores";

class ProductUIStore {
  @box product = {};
  @observable isAddedSummaryVisible = false;
  @observable relatedProducts = [];

  @observable selectedColor;
  @observable selectedSize;

  constructor({ product, selectedColor }) {
    this.product = product;
    this.selectedColor = selectedColor || product.variants[0].etc.color;

    // log to history
    historyStore.log(product);
  }

  get currency() {
    return this.product.place.currency;
  }

  // computed get images => reordered by selected color
  @computed
  get price() {
    return this.selectedVariant.price;
  }

  @computed
  get previousPrice() {
    return this.selectedVariant.prevPrice;
  }

  getVariantBySize = size => {
    return this.product.variants.find(
      v => v.etc.color == this.selectedColor && v.etc.size == size
    );
  };

  @computed
  get selectedVariant() {
    return this.product.variants.find(
      v =>
        v.etc.color == this.selectedColor
        && (this.selectedSize ? v.etc.size == this.selectedSize : true)
    );
  }

  @computed
  get associatedSizes() {
    return this.product.variants
      .filter(v => v.etc.color == this.selectedColor)
      .map(v => v.etc.size);
  }

  // added summary
  @action
  toggleAddedSummary = visible => {
    this.isAddedSummaryVisible
      = visible != null ? visible : !this.isAddedSummaryVisible;
  };

  // select variant syncs selected variant across components
  @action
  onSelectSize = size => {
    this.selectedSize = size;
  };

  @action
  fetchRelatedProduct = async () => {
    const resolved = await this.product.fetchRelated();
    if (resolved.products) {
      runInAction("fetch related product", () => {
        this.relatedProducts = resolved.products;
      });
    }
  };
}

export default ProductUIStore;
