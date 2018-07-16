import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Colours, Styles, Sizes } from "localyyz/constants";
import {
  NavBar,
  Filter,
  FilterPopupButton,
  ProductList
} from "localyyz/components";

// third party
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

@inject(stores => ({
  searchStore: stores.homeStore,
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

    this.filterStore = Filter.getNewStore(this.props.searchStore);
  }

  // TODO: do something here? search suggestions?
  get renderEmpty() {
    return this.props.isProcessingQuery ? (
      <Animatable.View animation="fadeIn" style={styles.placeholder}>
        <ProductList.Placeholder />
        <ProductList.Placeholder />
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
              onEndReached={this.props.fetchNextPage}
              products={this.props.searchResults.slice()}/>
          </Animatable.View>
        )}

        {this.props.searchResults.slice().length > 0 ? (
          <View pointerEvents="box-none" style={styles.filter}>
            <LinearGradient
              colors={[Colours.WhiteTransparent, Colours.Transparent]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient}
              pointerEvents="box-none">
              <View style={styles.buttons}>
                <FilterPopupButton store={this.filterStore} />
              </View>
            </LinearGradient>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  filter: {
    ...Styles.Overlay,
    justifyContent: "flex-end",
    bottom: NavBar.HEIGHT // TODO: fix this
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
  },

  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 7,
    width: Sizes.Width
  },

  buttons: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    justifyContent: "center"
  }
});
