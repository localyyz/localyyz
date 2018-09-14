// third party
import { StackNavigator } from "react-navigation";

// custom
import { Product, ProductListStack, CartSummary } from "localyyz/scenes";

// local
import { DealsScene, History, MissedDeal } from "./scenes";

export const DealsNavigator = StackNavigator(
  {
    DealsScene: { screen: DealsScene },
    History: { screen: History },
    MissedDeal: { screen: MissedDeal },
    Product: { screen: Product },
    ProductList: { screen: ProductListStack },
    CartSummary: { screen: CartSummary }
  },
  {
    initialRouteName: "DealsScene",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);
