import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { Provider, inject } from "mobx-react/native";

// custom
import { Sizes } from "localyyz/constants";
import { GA } from "localyyz/global";

// local
import CartBaseScene from "../../components/CartBaseScene";
import CartItems from "../../components/CartItems";
import ProcessingOverlay from "./ProcessingOverlay";
import Footer from "./Footer";
import CouponSection from "./CouponSection";
import SummarySection from "./SummarySection";
import ConfirmationUIStore from "./store";

@inject(stores => ({
  setNextReady: stores.cartUiStore.setNextReady,
  navigateNext: stores.cartUiStore.navigateNext,
  scrollEnabled: stores.cartUiStore.scrollEnabled,
  numCartItems: stores.cartStore.numCartItems,

  // used for removal to recalc totals
  completeCheckout: stores.cartUiStore.completeCheckout
}))
export default class Confirmation extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.store = new ConfirmationUIStore(
      this.props.navigation.getParam("checkoutError"),
      this.props.navigation.getParam("paymentError")
    );

    // bindings
    this.onRemove = this.onRemove.bind(this);
  }

  componentDidMount() {
    GA.trackScreen("cart", "show summary");
  }

  async onRemove() {
    this.props.setNextReady(false);
    if (this.props.numCartItems <= 0) {
      this.props.navigation.popToTop();
      this.props.navigation.goBack(null);
    }

    // update the cart
    await this.props.completeCheckout();
    this.props.setNextReady(true);
  }

  get expandedFooter() {
    return <Footer navigation={this.props.navigation} />;
  }

  render() {
    return (
      <Provider confirmationUiStore={this.store}>
        <View style={styles.container}>
          <CartBaseScene
            keySeed={this.props.keySeed}
            scrollEnabled={this.props.scrollEnabled}
            navigation={this.props.navigation}
            iconType="close"
            activeSceneId="ConfirmationScene"
            footer={this.expandedFooter}>
            <SummarySection navigation={this.props.navigation} />
            <CartItems
              navigation={this.props.navigation}
              onRemove={this.onRemove}
              itemStyle={styles.items}/>
            <CouponSection navigation={this.props.navigation} />
          </CartBaseScene>
          <ProcessingOverlay />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  items: {
    marginHorizontal: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame / 2
  }
});
