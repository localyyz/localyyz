// third party
import { createStackNavigator } from "react-navigation";

// local
import SearchBrowse from "./SearchBrowse";
import ProductListStack from "../ProductList";
import Product from "../Product";
import Information from "../Information";

const SearchBrowseStack = createStackNavigator(
  {
    SearchBrowse: { screen: SearchBrowse },
    ProductList: { screen: ProductListStack },
    Product: { screen: Product },
    Information: { screen: Information }
  },
  {
    initialRouteName: "SearchBrowse",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default SearchBrowseStack;
