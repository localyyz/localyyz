import React from "react";
import { View } from "react-native";

// third party
import { Provider, observer } from "mobx-react/native";

// local
import CategoryList from "./components/CategoryList";
import SearchInputBox from "./SearchInput";
import Store from "./store";

@observer
export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <Provider searchStore={this.store}>
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <SearchInputBox />
          <CategoryList />
        </View>
      </Provider>
    );
  }
}

export default Search;
