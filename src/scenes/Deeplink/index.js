import React from "react";

import {
  Product as ProductStore,
  Collection as CollectionStore
} from "~/src/stores";

import branch from "react-native-branch";
import OneSignal from "react-native-onesignal";
import { inject } from "mobx-react/native";

@inject(stores => ({
  loginStore: stores.loginStore,
  historyStore: stores.historyStore
}))
export default class Deeplink extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loginStore.skipLogin();

    // navigating with key = null will reset the root navigator
    this.props.navigation.replace("App");
    this.branchUnsubscriber = branch.subscribe(this.onBranchDeepLink);

    OneSignal.addEventListener("opened", this.onOpened)
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

  navigateTo = ( data ) => {
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
        let params = {
          fetchPath: data.fetchPath,
          title: data.title || "Selected For You",
        };

        params.filtersort = {
          filter: data.filter,
          category: data.categoryID,
          style: data.style,
          pricing: data.pricing,
          gender: data.gender,
          brand: data.brand,
          discountMin: data.discountMin || 0
        };

        if (data.filter === "sale" && !data.discountMin) {
          params.filtersort.discountMin = 0.5;
        }

        this.props.navigation.push("ProductList", params);
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
  onBranchDeepLink = async ({error, params}) => {
    if (error) {
      console.log("Error: failed to deep link", error);
    } else if (params) {
      this.navigateTo(params)
    }
  };

  onOpened = (openResult) => {
    let params = openResult.notification.payload.additionalData;
    if (params) {
      this.navigateTo(params)
    }

  }
}
