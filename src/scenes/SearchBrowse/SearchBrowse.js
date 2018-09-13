import React from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";

// third party
import { Provider, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Styles } from "localyyz/constants";
import { capitalizeSentence } from "localyyz/helpers";

// local
import { CategoryList, SearchInputBox } from "./components";
import Store from "./store";

@observer
export class Search extends React.Component {
  constructor(props) {
    super(props);

    // data
    this.store = new Store();
  }

  onSubmitSearch = () => {
    this.props.navigation.push("ProductList", {
      store: this.store,
      title: capitalizeSentence(this.store.searchQuery)
    });
  };

  render() {
    return (
      <Provider searchStore={this.store}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.landing}>
            <CategoryList />
            <View style={styles.overlay} pointerEvents="box-none">
              <SearchInputBox onSubmit={this.onSubmitSearch} />
            </View>
          </View>
        </View>
      </Provider>
    );
  }
}

export default withNavigation(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  landing: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  overlay: {
    ...Styles.Overlay
  }
});
