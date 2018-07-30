// third party
import { createStackNavigator } from "react-navigation";

// local
import SearchBrowse from "./SearchBrowse";
import ProductList from "../ProductList";
import Product from "../Product";
import Filter from "../Filter";

const SearchBrowseStack = createStackNavigator(
  {
    SearchBrowse: { screen: SearchBrowse },
    ProductList: { screen: ProductList },
    Product: { screen: Product },
    Filter: { screen: Filter }
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
