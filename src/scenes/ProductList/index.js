// third party
import { createStackNavigator } from "react-navigation";

// custom
import Product from "../Product";
import Filter from "../Filter";
import Information from "../Information";

// local
import { ProductList } from "./scenes";

const ProductListStack = createStackNavigator(
  {
    ProductList: { screen: ProductList },
    Product: { screen: Product },
    Information: { screen: Information },
    Filter: { screen: Filter }
  },
  {
    initialRouteName: "ProductList",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default ProductListStack;
