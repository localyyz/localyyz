// third party
import { createStackNavigator } from "react-navigation";

// custom
import Product from "../Product";
import Information from "../Information";
import { Colours } from "localyyz/constants";

// local
import {
  ProductList,
  Filter,
  FilterList,
  DiscountFilterList,
  PriceFilterList,
  CategoryFilterList
} from "./scenes";

const ProductListStack = createStackNavigator(
  {
    ProductList: { screen: ProductList },
    Product: { screen: Product },
    Information: { screen: Information },
    Filter: { screen: Filter },
    FilterList: { screen: FilterList },
    FilterPriceList: { screen: PriceFilterList },
    FilterDiscountList: { screen: DiscountFilterList },
    FilterCategoryList: { screen: CategoryFilterList }
  },
  {
    initialRouteName: "ProductList",
    navigationOptions: ({ navigation: { state }, navigationOptions }) => ({
      ...navigationOptions,
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled,
      headerTintColor: Colours.DarkTransparent
    })
  }
);

export default ProductListStack;
