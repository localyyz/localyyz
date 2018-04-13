import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Colours } from "localyyz/constants";
import { NavBar, ProductList } from "localyyz/components";
//import { SearchTagsWrapper } from "./SearchTags";

// third party
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  searchResults: stores.homeStore.searchResults,
  fetchNextPage: stores.homeStore.fetchNextPage,
  onScrollUp: () => (stores.homeStore.searchTagsVisible = true),
  onScrollDown: () => (stores.homeStore.searchTagsVisible = false)
}))
@observer
export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._motion = new Animated.Value(0);
  }

  // TODO: do something here? search suggestions?
  get renderEmpty() {
    return <View />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.searchResults.slice().length === 0 ? (
          this.renderEmpty
        ) : (
          <Animatable.View animation="fadeIn" style={styles.results}>
            <ProductList
              style={{
                paddingBottom: this.state.tagsHeight
              }}
              onEndReached={this.props.fetchNextPage}
              products={this.props.searchResults.slice()}/>
          </Animatable.View>
        )}
        {/* <SearchTagsWrapper /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  results: {
    flex: 1,
    marginBottom: NavBar.HEIGHT,
    backgroundColor: Colours.Foreground
  }
});
