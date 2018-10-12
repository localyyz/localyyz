// third party
import { createStackNavigator } from "react-navigation";

// custom
import Product from "../Product";
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

const FilterStack = createStackNavigator(
  {
    Filter: { screen: Filter },
    FilterList: { screen: FilterList },
    FilterPriceList: { screen: PriceFilterList },
    FilterDiscountList: { screen: DiscountFilterList },
    FilterCategoryList: { screen: CategoryFilterList }
  },
  {
    navigationOptions: ({ navigation: { state }, navigationOptions }) => ({
      ...navigationOptions,
      gesturesEnabled: state.params && state.params.gesturesEnabled,
      headerTintColor: Colours.DarkTransparent
    }),
    headerMode: "none"
  }
);

const ProductListStack = createStackNavigator(
  {
    ProductList: { screen: ProductList },
    Product: { screen: Product },
    Filter: {
      screen: FilterStack,
      navigationOptions: { header: undefined }
    }
  },
  {
    initialRouteName: "ProductList",
    navigationOptions: ({ navigation: { state }, navigationOptions }) => ({
      ...navigationOptions,
      gesturesEnabled: state.params && state.params.gesturesEnabled,
      headerTintColor: Colours.DarkTransparent,
      header: null
    })
  }
);

export default ProductListStack;
