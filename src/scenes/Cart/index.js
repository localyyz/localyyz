// third party
import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "react-navigation";
import { inject, Provider } from "mobx-react/native";

// custom
import { NavBar } from "localyyz/components";

// local
import AddressesScene from "~/src/scenes/Addresses";
import ProductScene from "../Product";
import {
  EmailScene,
  ShippingScene,
  PaymentScene,
  CartScene,
  ConfirmationScene,
  SummaryScene,
  DiscountScene
} from "./scenes";
import CartUiStore from "./store";

const CheckoutNavigator = createStackNavigator(
  {
    EmailScene: EmailScene,
    ShippingScene: ShippingScene,
    PaymentScene: PaymentScene,
    ConfirmationScene: ConfirmationScene,
    DiscountScene: DiscountScene,
    SummaryScene: SummaryScene,

    Addresses: AddressesScene
  },
  {
    navigationOptions: ({ navigation: { state } }) => ({
      gesturesEnabled: state.params && state.params.gesturesEnabled
    }),
    headerMode: "none"
  }
);

class CheckoutStack extends React.Component {
  static router = CheckoutNavigator.router;

  render() {
    return (
      <View style={styles.container}>
        <NavBar.Toggler hasPriority />
        <CheckoutNavigator navigation={this.props.navigation} />
      </View>
    );
  }
}

const CartNavigator = createStackNavigator(
  {
    CartScene: CartScene,
    CheckoutStack: CheckoutStack,
    Product: ProductScene
  },
  {
    navigationOptions: () => ({
      gesturesEnabled: false
    }),
    headerMode: "none"
  }
);

@inject(stores => ({
  cartStore: stores.cartStore,
  addressStore: stores.addressStore
}))
export default class CartStack extends React.Component {
  static router = CartNavigator.router;

  constructor(props) {
    super(props);
    this.cartUiStore = new CartUiStore(props.cartStore, props.addressStore);
  }

  render() {
    return (
      <Provider cartUiStore={this.cartUiStore}>
        <CartNavigator navigation={this.props.navigation} />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
