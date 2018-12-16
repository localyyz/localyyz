import { action, runInAction, observable } from "mobx";

import { box } from "localyyz/helpers";
import { historyStore } from "localyyz/stores";

class ProductUIStore {
  @box product = {};
  @box isVariantSelectorVisible = false;
  @observable isAddedSummaryVisible = false;
  @observable relatedProducts = [];
  @observable selectedVariant;

  // deep linking
  isDeepLinked = false;

  constructor({ product }) {
    this.product = product;

    // initialize the default variant
    this.onSelectVariant(this.product.selectedVariant);

    // log to history
    historyStore.log(product);
  }

  // added summary
  @action
  toggleAddedSummary = visible => {
    this.isAddedSummaryVisible
      = visible != null ? visible : !this.isAddedSummaryVisible;
  };

  // select variant syncs selected variant across components
  @action
  onSelectVariant = variant => {
    this.selectedVariant = variant;
    this.product.selectedVariant = variant;
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
