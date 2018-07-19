import React from "react";

import { changeTab } from "localyyz/helpers";
import ProductStore from "../Product/store";

import branch from "react-native-branch";
import { inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

@withNavigation
@inject(stores => ({
  navStore: stores.navStore,
  loginStore: stores.loginStore,
  historyStore: stores.historyStore
}))
class Deeplink extends React.Component {
  constructor(props) {
    super(props);
    this.getDeeplinkProduct = this.getDeeplinkProduct.bind(this);
  }

  componentDidMount() {
    this.props.loginStore.skipLogin();
    //this.props.navigation.dispatch(resetHome());
    this.props.navigation.navigate("App");
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
    let store = new ProductStore({}, this.props.historyStore);
    await store.fetchProduct(productID);
    return store.product;
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
      if (params.destination === "product") {
        let product = await this.getDeeplinkProduct(params.destination_id);
        this.props.navigation.navigate("Product", {
          product: product
        });
      } else if (params.destination === "collection") {
        this.props.navigation.navigate("ProductList", {
          fetchPath: "collections/" + params.destination_id + "/products",
          title: params.title,
          subtitle: params.description
        });
      } else if (params.destination === "place") {
        this.props.navigation.navigate("ProductList", {
          fetchPath: "places/" + params.destination_id + "/products",
          title: params.title
        });
      } else if (params.destination === "deals") {
        this.props.navigation.dispatch(changeTab("Deals"));
      }
    }
    this.props.navStore.setLoaded();
  };
}

export default Deeplink;
