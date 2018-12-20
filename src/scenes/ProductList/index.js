// third party
import { createStackNavigator } from "react-navigation";

// custom
import Product from "../Product";
import { Styles, Colours } from "localyyz/constants";

// local
import {
  ProductList,
  FilterMenu,
  FilterList,
  DiscountFilterList,
  PriceFilterList
} from "./scenes";

const ProductListStack = createStackNavigator(
  {
    ProductList: { screen: ProductList },
    Product: { screen: Product },
    Filter: { screen: FilterMenu },
    FilterList: { screen: FilterList },
    FilterPriceList: { screen: PriceFilterList },
    FilterDiscountList: { screen: DiscountFilterList }
  },
  {
    initialRouteName: "ProductList",
    navigationOptions: ({ navigation: { state }, navigationOptions }) => {
      return {
        ...navigationOptions,
        gesturesEnabled: state.params && state.params.gesturesEnabled,
        headerStyle: { borderBottomWidth: 0 },
        headerBackTitle: null,
        headerTintColor: Colours.LabelBlack,
        headerTitleStyle: {
          ...Styles.Text,
          ...Styles.Emphasized,
          color: Colours.LabelBlack
        },
        headerTransparent: state.routeName === "Product"
      };
    }
  }
);

export default ProductListStack;
