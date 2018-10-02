// third party
import { createStackNavigator } from "react-navigation";

import { ProductListStack } from "localyyz/scenes";
import DiscountsScene from "./Discounts";

const DealsNavigatorStack = createStackNavigator(
  {
    DiscountsScene: { screen: DiscountsScene },
    ProductList: { screen: ProductListStack }
  },
  {
    initialRouteName: "DiscountsScene",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default DealsNavigatorStack;
