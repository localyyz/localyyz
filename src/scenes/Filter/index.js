// third party
import { StackNavigator } from "react-navigation";

// local
import { FilterMain, FilterList } from "./scenes";

const FilterStack = StackNavigator(
  {
    FilterMain: { screen: FilterMain },
    FilterList: { screen: FilterList }
  },
  {
    initialRouteName: "FilterMain",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default FilterStack;
