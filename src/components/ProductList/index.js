import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Sizes } from "localyyz/constants";

// custom
import { ProductTile } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";

// constants
const SCROLL_THRESHOLD = 100;

@withNavigation
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // bindings
    this.fetchMore = this.fetchMore.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onScroll = this.onScroll.bind(this);

    // scrolling
    this.position = 0;
    this.change = 0;
    this.thresholdReached = false;
  }

  fetchMore() {
    this.props.onEndReached && this.props.onEndReached();
  }

  renderItem({ item: product }) {
    return (
      <View style={styles.tile}>
        <ProductTile
          onPress={() =>
            this.props.navigation.navigate("Product", {
              product: product
            })}
          product={product}
        />
      </View>
    );
  }

  onScroll(e) {
    let scrollChange = e.nativeEvent.contentOffset.y - this.position;
    let isDirectionChanged = !(
      (scrollChange >= 0 && this.change >= 0) ||
      (scrollChange <= 0 && this.change <= 0)
    );

    if (isDirectionChanged) {
      this.thresholdReached = false;
    }

    this.change = (isDirectionChanged ? 0 : this.change) + scrollChange;
    this.position = e.nativeEvent.contentOffset.y;

    if (!this.thresholdReached && Math.abs(this.change) > SCROLL_THRESHOLD) {
      this.thresholdReached = true;

      if (this.change > 0) {
        this.props.onScrollDown && this.props.onScrollDown();
      } else {
        this.props.onScrollUp && this.props.onScrollUp();
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.products}
          numColumns={2}
          keyExtractor={e => e.id}
          onEndReached={this.fetchMore}
          onEndReachedThreshold={5}
          contentContainerStyle={this.props.style}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          columnWrapperStyle={styles.column}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Sizes.InnerFrame / 2
  },

  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
