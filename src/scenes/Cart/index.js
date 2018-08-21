// third party
import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "react-navigation";
import { inject, Provider } from "mobx-react/native";

// custom
import { NavBar } from "localyyz/components";
import Forms from "../Forms";
import { Addresses } from "../Settings/scenes";

// local
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
    Addresses: Addresses,
    AddressForm: Forms.AddressForm,
    PaymentScene: PaymentScene,
    ConfirmationScene: ConfirmationScene,
    DiscountScene: DiscountScene,
    SummaryScene: SummaryScene
  },
  {
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

class CheckoutStack extends React.Component {
  static router = CheckoutNavigator.router;

  render() {
    return (
      <View style={styles.container}>
        <NavBar.Toggler />
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
      header: null,
      gesturesEnabled: false
    })
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
