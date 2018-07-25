// third party
import { StackNavigator } from "react-navigation";

// local
import SearchBrowse from "./SearchBrowse";
import ProductList from "../ProductList";
import Product from "../Product";

const SearchBrowseStack = StackNavigator(
  {
    SearchBrowse: { screen: SearchBrowse },
    ProductList: { screen: ProductList },
    Product: { screen: Product }
  },
  {
    initialRouteName: "SearchBrowse",
    navigationOptions: () => ({
      header: null,
      gesturesEnabled: false
    })
  }
);

export default SearchBrowseStack;
