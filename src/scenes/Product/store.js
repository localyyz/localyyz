import { action, runInAction, observable } from "mobx";

import { box } from "localyyz/helpers";
import { Product } from "localyyz/models";

import { facebook as Facebook } from "localyyz/effects";
import { ApiInstance } from "localyyz/global";
import branch from "react-native-branch";

class ProductUIStore {
  @box product = {};
  @box isVariantSelectorVisible = false;
  @observable isAddedSummaryVisible = false;
  @observable relatedProducts = [];
  @observable selectedVariant;

  // deep linking
  isDeepLinked = false;

  constructor({ product }, historyStore) {
    this.api = ApiInstance;
    this.history = historyStore;

    if (product) {
      this.product = product;

      // ping out for stats logging
      this.api.get(`products/${product.id}`);
    }

    // bindings
    this.toggleAddedSummary = this.toggleAddedSummary.bind(this);
    this.onSelectVariant = this.onSelectVariant.bind(this);

    // initialize the default variant
    this.onSelectVariant(this.product.selectedVariant);
  }

  // added summary
  @action
  toggleAddedSummary(visible) {
    this.isAddedSummaryVisible
      = visible != null ? visible : !this.isAddedSummaryVisible;
  }

  // select variant syncs selected variant across components
  @action
  onSelectVariant(variant) {
    // track product viewing
    Facebook.logEvent("fb_mobile_content_view", variant.price || 0, {
      fb_content_type: this.isDeepLinked ? "product_deeplink" : "product",
      fb_content_id: this.product.id,
      fb_content: { variant: variant.id }
    });

    this.selectedVariant = variant;
  }

  @action
  fetchProduct = async productId => {
    const response = await this.api.get(`products/${productId}`);
    if (response && response.data) {
      runInAction("fetch product", () => {
        this.product = new Product(response.data);
        this.product.changeDescriptionWordsLength(40);
        this.history.log(this.product);
      });
    }
    return;
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

  async generateProductDeeplink(
    productID,
    productTitle,
    productDescription,
    isDeal
  ) {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      `product:${productID}`,
      {
        locallyIndex: true,
        title: productTitle,
        contentDescription: productDescription
      }
    );

    let controlParams = isDeal
      ? { destination: "deals" }
      : {
          destination: "product",
          destination_id: productID
        };

    let { url } = await branchUniversalObject.generateShortUrl(
      {},
      controlParams
    );

    return url;
  }
}

export default ProductUIStore;
