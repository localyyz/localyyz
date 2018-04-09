import React from "react";

import { resetHome } from "localyyz/helpers";

import branch from "react-native-branch";
import { inject } from "mobx-react";

@inject("loginStore", "navStore")
class Deeplink extends React.Component {
  constructor(props) {
    super(props);
  }

  _onBranchDeepLink = async ({ error, params }) => {
    if (error) {
      console.log("deeplinking error", error);
    } else {
      const { navigation } = this.props;
      if (params && params.type === "product") {
        const { navigation } = this.props;
        navigation.navigate("Product", {
          productId: params.product_id // sent through deeplink
        });
      } else if (!this.props.navStore.isLoaded) {
        navigation.dispatch(resetHome());
      }
      // set loaded for the first time
      this.props.navStore.setLoaded();
    }
  };

  componentDidMount() {
    this.props.loginStore.skipLogin();
    this.props.navigation.dispatch(resetHome());
    //this.branchUnsubscriber = branch.subscribe(this._onBranchDeepLink);
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
}

export default Deeplink;
