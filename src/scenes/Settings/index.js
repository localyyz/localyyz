// custom
import { Forms } from "localyyz/scenes";

// third party
import { StackNavigator } from "react-navigation";

// local
import { Menu, Addresses, Orders, History } from "./scenes";
import ProductScene from "../Product";

export const SettingsNavigator = StackNavigator(
  {
    Menu: { screen: Menu },
    Addresses: { screen: Addresses },
    AddressForm: { screen: Forms.AddressForm },
    Orders: { screen: Orders },
    History: { screen: History },
    Product: { screen: ProductScene }
  },
  {
    initialRouteName: "Menu",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);
