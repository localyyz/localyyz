import React from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";

// third party
import { Provider, observer } from "mobx-react/native";

// custom
import { Colours, Styles } from "localyyz/constants";
import { capitalizeSentence } from "localyyz/helpers";

// local
import { ProductListScene } from "../ProductList/scenes";
import { CategoryList, SearchInputBox } from "./components";
import Store from "./store";

@observer
export default class Search extends React.Component {
  constructor(props) {
    super(props);

    // data
    this.store = new Store();
  }

  render() {
    return (
      <Provider searchStore={this.store}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          {!this.store.searchQuery ? (
            <View style={styles.landing}>
              <CategoryList />
              <Animated.View style={styles.overlay} pointerEvents="box-none">
                <SearchInputBox />
              </Animated.View>
            </View>
          ) : (
            <ProductListScene
              store={this.store}
              title={capitalizeSentence(this.store.searchQuery)}
              onBack={this.store.clearSearch}
              iconType="close"
              backColor={Colours.Text}/>
          )}
        </View>
      </Provider>
    );
  }
}

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
