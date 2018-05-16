import { action, runInAction, observable } from "mobx";

import { box } from "localyyz/helpers";
import { Product } from "localyyz/models";

import { facebook as Facebook } from "localyyz/effects";
import { ApiInstance } from "localyyz/global";

class ProductUIStore {
  @box product = {};
  @box isVariantSelectorVisible = false;
  @observable isAddedSummaryVisible = false;
  @observable relatedProducts = [];
  @observable selectedVariant;

  // deep linking
  isDeepLinked = false;

  constructor({ product }, historyStore) {
    if (product) {
      this.product = product;
    }

    this.api = ApiInstance;
    this.history = historyStore;

    // bindings
    this.toggleAddedSummary = this.toggleAddedSummary.bind(this);
  }

  // added summary
  @action
  toggleAddedSummary(visible) {
    this.isAddedSummaryVisible
      = visible != null ? visible : !this.isAddedSummaryVisible;
  }

  // select variant syncs selected variant across components
  @action
  onSelectVariant = variant => {
    // track product viewing
    Facebook.logEvent("fb_mobile_content_view", variant.price || 0, {
      fb_content_type: this.isDeepLinked ? "product_deeplink" : "product",
      fb_content_id: this.product.id,
      fb_content: { variant: variant.id }
    });

    this.selectedVariant = variant;
  };

  @action
  fetchProduct = async (productId, forceNew = false) => {
    // for now, don't do anything
    if (!this.product || forceNew) {
      const response = await this.api.get(`/products/${productId}`);
      if (response && response.data) {
        runInAction("fetch product", () => {
          this.product = new Product(response.data);
          this.product.changeDescriptionWordsLength(40);
          this.history.log(this.product);
        });
      }
      return;
    }

    // product already exists, making a call here for
    // stats tracking
    this.api.get(`/products/${this.product.id}`);
  };

  @action
  fetchRelatedProduct = async () => {
    let params = { limit: 10 };
    const response = await this.api.get(
      `/products/${this.product.id}/related`,
      params
    );
    if (response && response.data) {
      runInAction("fetch related product", () => {
        this.relatedProducts = response.data.map(p => {
          return new Product({ ...p, description: p.noTagDescription });
        });
      });
    }
  };
}

export default ProductUIStore;
