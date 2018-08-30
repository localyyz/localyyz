// third party
import { createStackNavigator } from "react-navigation";

// local
import SearchBrowse from "./SearchBrowse";
import ProductListStack from "../ProductList";

const SearchBrowseStack = createStackNavigator(
  {
    SearchBrowse: { screen: SearchBrowse },
    ProductList: { screen: ProductListStack }
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
