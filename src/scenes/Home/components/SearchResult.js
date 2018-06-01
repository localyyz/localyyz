import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { NavBar, ProductList } from "localyyz/components";
//import { SearchTagsWrapper } from "./SearchTags";

// third party
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

// local
import ListPlaceholder from "./ListPlaceholder";

@inject(stores => ({
  searchResults: stores.homeStore.searchResults,
  fetchNextPage: stores.homeStore.fetchNextPage,
  onScrollUp: () => (stores.homeStore.searchTagsVisible = true),
  onScrollDown: () => (stores.homeStore.searchTagsVisible = false),
  isProcessingQuery: stores.homeStore.isProcessingQuery
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
    return this.props.isProcessingQuery ? (
      <Animatable.View animation="fadeIn" style={styles.placeholder}>
        <ListPlaceholder />
        <ListPlaceholder />
      </Animatable.View>
    ) : null;
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
        {/* TODO: <SearchTagsWrapper /> */}
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
  },

  placeholder: {
    padding: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
