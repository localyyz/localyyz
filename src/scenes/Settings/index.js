// custom
import { Forms } from "localyyz/scenes";

// third party
import { createStackNavigator } from "react-navigation";

import { ProductListStack } from "localyyz/scenes";

// local
import { Menu as Settings, Addresses, Orders, History } from "./scenes";
import ProductScene from "../Product";

export const SettingsNavigator = createStackNavigator(
  {
    Settings: Settings,
    Addresses: Addresses,
    AddressForm: Forms.AddressForm,
    Orders: Orders,
    Favourite: { screen: ProductListStack },
    History: History,
    Product: ProductScene
  },
  {
    initialRouteName: "Settings",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);
