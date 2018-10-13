import React from "react";

import {
  Product as ProductStore,
  Collection as CollectionStore
} from "~/src/stores";

import branch from "react-native-branch";
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
      console.log("Error: failed to deep link", error);
    } else if (params) {
      switch (params.destination) {
        case "product":
          this.getDeeplinkProduct(params.destination_id).then(resolved => {
            if (!resolved.error) {
              this.props.navigation.navigate({
                routeName: "Product",
                key: `product${params.destination_id}`,
                params: {
                  product: resolved.product
                }
              });
            }
          });

          break;
        case "collection":
          this.getDeeplinkCollection(params.destination_id).then(resolved => {
            if (!resolved.error) {
              this.props.navigation.navigate({
                routeName: "ProductList",
                key: `collection${params.destination_id}`,
                params: {
                  fetchPath: `collections/${params.destination_id}/products`,
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
            key: `place${params.destination_id}`,
            params: {
              fetchPath: "places/" + params.destination_id + "/products",
              title: params.title
            }
          });
          break;
        case "deals":
          this.props.navigation.navigate("DealsScene", {
            dealId: params.destination_id,
            startAt: params.startAt,
            duration: params.duration
          });
          break;
        default:
        // do nothing
      }
    }
  };
}
