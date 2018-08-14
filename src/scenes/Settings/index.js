// custom
import { Forms } from "localyyz/scenes";

// third party
import { StackNavigator } from "react-navigation";

import { ProductListStack } from "localyyz/scenes";

// local
import { Menu as Settings, Addresses, Orders, History } from "./scenes";
import ProductScene from "../Product";

export const SettingsNavigator = StackNavigator(
  {
    Settings: { screen: Settings },
    Addresses: { screen: Addresses },
    AddressForm: { screen: Forms.AddressForm },
    Orders: { screen: Orders },
    Favourite: { screen: ProductListStack },
    History: { screen: History },
    Product: { screen: ProductScene }
  },
  {
    initialRouteName: "Settings",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);
