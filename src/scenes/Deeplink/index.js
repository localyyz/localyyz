import React from "react";

import {
  Product as ProductStore,
  Collection as CollectionStore
} from "~/src/stores";

import { storage } from "~/src/effects";

import branch from "react-native-branch";
import OneSignal from "react-native-onesignal";
import { inject } from "mobx-react/native";

@inject(stores => ({
  loginStore: stores.loginStore,
  userStore: stores.userStore
}))
export default class Deeplink extends React.Component {
  constructor(props) {
    super(props);

    this._next = "App";
  }

  componentWillMount() {
    this.branchUnsubscriber = branch.subscribe(this.onBranchDeepLink);
    OneSignal.addEventListener("opened", this.onOpened);
  }

  componentDidMount() {
    this.props.loginStore.skipLogin();
  }

  componentWillUnmount = () => {
    if (this.branchUnsubscriber) {
      this.branchUnsubscriber();
      this.branchUnsubscriber = null;
    }
  };

  render() {
    return null;
  }

  getDeeplinkCollection = async collectionID => {
    return await CollectionStore.fetch(collectionID);
  };

  getDeeplinkProduct = async productID => {
    return await ProductStore.fetch(productID);
  };

  navigateTo = data => {
    switch (data.destination) {
      case "product":
        this.getDeeplinkProduct(data.destination_id).then(resolved => {
          if (!resolved.error) {
            this.props.navigation.navigate({
              routeName: "Product",
              key: `product${data.destination_id}`,
              params: {
                product: resolved.product
              }
            });
          }
        });

        break;
      case "collection":
        this.getDeeplinkCollection(data.destination_id).then(resolved => {
          if (!resolved.error) {
            this.props.navigation.navigate({
              routeName: "ProductList",
              key: `collection${data.destination_id}`,
              params: {
                fetchPath: `collections/${data.destination_id}/products`,
                collection: resolved.collection,
                title: resolved.collection.name,
                subtitle: resolved.collection.description
              }
            });
          }
        });

        break;
      case "place":
        this.props.navigation.navigate({
          routeName: "ProductList",
          key: `place${data.destination_id}`,
          params: {
            fetchPath: "places/" + data.destination_id + "/products",
            title: data.title
          }
        });
        break;
      case "deal":
        this.props.navigation.navigate({
          routeName: "Deals"
        });
        break;
      case "productlist":
        this.props.navigation.push("ProductList", {
          fetchPath: data.fetchPath,
          title: data.title || "Selected For You",
          filtersort: {
            category: data.categoryID,
            style: data.style,
            pricing: data.pricing,
            gender: data.gender,
            merchant: data.MerchantID,
            brand: data.brand,
            discountMin: data.discountMin || 0
          }
        });
        break;
      case "onboarding":
        this.props.navigation.push("Onboarding");
        break;
      default:
      // do nothing
    }
  };

  /*
  function is called whenever a branch READ event is triggered
  params = {
    destination: "product/place/collection" - indicating where to navigate to
    destination_id : the id of the product/place/collection
    title: title to display - only for place and collection
    description: the description of the object  - only for collection
  }
  */
  onBranchDeepLink = async ({ error, params }) => {
    if (error) {
      __DEV__ && console.log("Branch: " + error);
      this.props.navigation.replace("App");
    } else if (params.destination) {
      this.navigateTo(params);
    } else {
      // check if device has been onboarded. if not should onboarding
      storage.load("onboarded", val => {
        const next = val ? "App" : "Onboarding";
        this.props.navigation.replace(next);
      });
    }
  };

  onOpened = openResult => {
    let params = openResult.notification.payload.additionalData;
    if (params) {
      this.navigateTo(params);
    }
  };
}
