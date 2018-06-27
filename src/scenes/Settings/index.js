// custom
import { Forms } from "localyyz/scenes";

// third party
import { StackNavigator } from "react-navigation";

// local
import { Menu, Addresses, Orders } from "./scenes";

export const SettingsTab = StackNavigator(
  {
    Menu: { screen: Menu },
    Addresses: { screen: Addresses },
    AddressForm: { screen: Forms.AddressForm },
    Orders: { screen: Orders }
  },
  {
    initialRouteName: "Menu",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);
