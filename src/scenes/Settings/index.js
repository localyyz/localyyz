// third party
import React from "react";
import { createStackNavigator } from "react-navigation";

// local
import Addresses from "~/src/scenes/Addresses";

import SettingsMenu from "./Menu";
import { Orders, History } from "./scenes";
import ProductScene from "../Product";
import ProductList from "../ProductList";

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsMenu,
    Addresses: Addresses,
    Orders: Orders,
    History: History,
    Product: ProductScene,
    Favourites: ProductList
  },
  {
    initialRouteName: "Settings",
    navigationOptions: ({ navigation, navigationOptions }) => ({
      ...navigationOptions,
      title: navigation.getParam("title", "Settings"),
      headerTintColor: "#000",
      header: null
    })
  }
);

export default class Settings extends React.Component {
  static router = SettingsStack.router;

  render() {
    return <SettingsStack navigation={this.props.navigation} />;
  }
}
