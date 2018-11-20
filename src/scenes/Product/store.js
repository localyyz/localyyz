import { action, runInAction, observable } from "mobx";

import { box } from "localyyz/helpers";
import { historyStore, Product } from "localyyz/stores";

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
    let params = { limit: 10 };
    const response = await ApiInstance.get(
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
