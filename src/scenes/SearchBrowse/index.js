// third party
import { createStackNavigator } from "react-navigation";

// local
import { Styles, Colours } from "~/src/constants";
import SearchBrowse from "./SearchBrowse";
import ProductListStack from "../ProductList";
import Category from "./Category";

const SearchBrowseStack = createStackNavigator(
  {
    SearchBrowse: { screen: SearchBrowse },
    Category: { screen: Category },
    ProductList: { screen: ProductListStack }
  },
  {
    initialRouteName: "SearchBrowse",
    navigationOptions: ({ navigation: { state }, navigationOptions }) => {
      return {
        ...navigationOptions,
        headerStyle: { borderBottomWidth: 0 },
        headerTintColor: Colours.LabelBlack,
        headerTitleStyle: {
          ...Styles.Text,
          ...Styles.Emphasized,
          color: Colours.LabelBlack
        },
        gesturesEnabled: state.params && state.params.gesturesEnabled,
        title: state.params && state.params.title.toUpperCase(),
        header: state.routeName === "Category" ? undefined : null
      };
    }
  }
);

export default SearchBrowseStack;
