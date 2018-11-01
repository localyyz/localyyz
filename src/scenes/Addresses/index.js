import React from "react";
import { HeaderBackButton, createStackNavigator } from "react-navigation";

// local
import Addresses from "./Addresses";
import Form from "./Form";
import CountryPicker from "./CountryPicker";

export default createStackNavigator(
  {
    Addresses: Addresses,
    AddressForm: Form,
    CountryPicker: CountryPicker
  },
  {
    navigationOptions: ({ navigation, navigationOptions }) => ({
      ...navigationOptions,
      headerLeft: (
        <HeaderBackButton
          tintColor="#000"
          onPress={() => navigation.goBack(null)}/>
      )
    })
  }
);
