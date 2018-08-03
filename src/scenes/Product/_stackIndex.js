// STUB for extracted PR, will use this in a separate PR to
// refactor navigation stacks

// third party
import { createStackNavigator } from "react-navigation";

// local
import { ProductScene } from "./scenes";
import Information from "../Information";

const ProductStack = createStackNavigator(
  {
    Product: { screen: ProductScene },
    Information: { screen: Information }
  },
  {
    initialRouteName: "Product",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default ProductStack;
