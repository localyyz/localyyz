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
    OneSignal.removeEventListener("opened", this.onOpened);
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

  navigateTo = ({ destination, destination_id, title }) => {
    switch (destination) {
      case "product":
        this.getDeeplinkProduct(destination_id).then(resolved => {
          if (!resolved.error) {
            this.props.navigation.navigate({
              routeName: "Product",
              key: `product${destination_id}`,
              params: {
                product: resolved.product
              }
            });
          }
        });

        break;
      case "collection":
        this.getDeeplinkCollection(destination_id).then(resolved => {
          if (!resolved.error) {
            this.props.navigation.navigate({
              routeName: "ProductList",
              key: `collection${destination_id}`,
              params: {
                fetchPath: `collections/${destination_id}/products`,
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
          key: `place${destination_id}`,
          params: {
            fetchPath: "places/" + destination_id + "/products",
            title: title
          }
        });
        break;
      case "deal":
        this.props.navigation.navigate({
          routeName: "Deals"
        });
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
