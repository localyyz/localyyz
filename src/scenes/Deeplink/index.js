import React from "react";

import { Product as ProductStore } from "localyyz/stores";

import branch from "react-native-branch";
import { inject } from "mobx-react/native";

@inject(stores => ({
  loginStore: stores.loginStore,
  historyStore: stores.historyStore
}))
export default class Deeplink extends React.Component {
  constructor(props) {
    super(props);
    this.getDeeplinkProduct = this.getDeeplinkProduct.bind(this);
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

  getDeeplinkProduct = async productID => {
    const resolve = await ProductStore.fetch(productID);
    if (!resolve.error) {
      return resolve.product;
    }
    // TODO: what do we do here?
    return resolve;
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
          this.props.navigation.navigate({
            routeName: "Product",
            key: `prouct${params.destination_id}`,
            params: {
              product: await this.getDeeplinkProduct(params.destination_id)
            }
          });
          break;
        case "collection":
          this.props.navigation.navigate({
            routeName: "ProductList",
            key: `collection${params.destination_id}`,
            params: {
              fetchPath: "collections/" + params.destination_id + "/products",
              title: params.title,
              subtitle: params.description
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
