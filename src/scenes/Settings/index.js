// custom
import { Forms } from "localyyz/scenes";

// third party
import { StackNavigator } from "react-navigation";

// local
import { Menu as Settings, Addresses, Orders, History } from "./scenes";
import ProductScene from "../Product";

export const SettingsNavigator = StackNavigator(
  {
    Settings: { screen: Settings },
    Addresses: { screen: Addresses },
    AddressForm: { screen: Forms.AddressForm },
    Orders: { screen: Orders },
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
