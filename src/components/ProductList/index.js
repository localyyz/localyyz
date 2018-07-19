import React from "react";
import { View, StyleSheet, Keyboard, FlatList, Text } from "react-native";
import { Sizes, Styles } from "localyyz/constants";

// custom
import { ProductTile } from "localyyz/components";
import { randInt } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// local
import { ProductListPlaceholder } from "./components";

// constants
const SCROLL_THRESHOLD = 100;

@withNavigation
@inject(stores => ({
  isFilterSupported: !!stores.filterStore,
  isLoading: stores.productListStore && stores.productListStore.isLoading
}))
@observer
export default class ProductList extends React.Component {
  static Placeholder = ProductListPlaceholder;

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    products: PropTypes.array,
    style: PropTypes.any,
    backgroundColor: PropTypes.string,
    onScrollUp: PropTypes.func,
    onScrollDown: PropTypes.func,
    onScroll: PropTypes.func,
    onEndReached: PropTypes.func,
    paddingBottom: PropTypes.number,

    // mobx injected
    isFilterSupported: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    paddingBottom: 0,
    products: [],
    onScrollUp: () => {},
    onScrollDown: () => {},
    onScroll: () => {},

    // mobx
    isFilterSupported: false,
    isLoading: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.fetchMore = this.fetchMore.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onScroll = this.onScroll.bind(this);

    // scrolling
    this.position = 0;
    this.change = 0;
    this.thresholdReached = false;

    // pseudo-unique (law of large numbers) key seed
    this.keySeed = randInt(10000000) + 1;
  }

  fetchMore({ distanceFromEnd }) {
    // NOTE: distanceFromEnd is returned by FlatList as a calculated value
    // as the current layout's distance to the end of scroll. However when
    // the next page is fetched, distance can be a negative value, which
    // we need to handle
    if (distanceFromEnd > 0) {
      this.props.onEndReached && this.props.onEndReached();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderItem({ item: product }) {
    return (
      <View style={styles.tile}>
        <ProductTile
          style={styles.tileComponent}
          onPress={() =>
            // NOTE: specify the navigation `key` here
            // to force a "pushey" navigation
            this.props.navigation.navigate({
              routeName: "Product",
              key: `prouct${product.id}`,
              params: {
                product: product
              }
            })
          }
          backgroundColor={this.props.backgroundColor}
          product={product}/>
      </View>
    );
  }

  onScroll(e) {
    // dismiss keyboard
    Keyboard.dismiss();

    let scrollChange = e.nativeEvent.contentOffset.y - this.position;
    let isDirectionChanged = !(
      (scrollChange >= 0 && this.change >= 0)
      || (scrollChange <= 0 && this.change <= 0)
    );

    if (isDirectionChanged) {
      this.thresholdReached = false;
    }

    this.change = (isDirectionChanged ? 0 : this.change) + scrollChange;
    this.position = e.nativeEvent.contentOffset.y;

    if (!this.thresholdReached && Math.abs(this.change) > SCROLL_THRESHOLD) {
      this.thresholdReached = true;

      if (this.change > 0) {
        this.props.onScrollDown();
      } else {
        this.props.onScrollUp();
      }
    }

    // callback
    this.props.onScroll(e);
  }

  get emptyList() {
    return !this.props.isLoading ? (
      <View
        style={[
          styles.emptyList,
          this.props.backgroundColor && {
            backgroundColor: this.props.backgroundColor
          }
        ]}>
        <Text style={styles.emptyLabel}>
          {"There are no products matching your search criteria"}
        </Text>
      </View>
    ) : null;
  }

  get placeholder() {
    return this.props.onEndReached && this.props.isLoading ? (
      <View
        style={[
          styles.column,
          this.props.backgroundColor && {
            backgroundColor: this.props.backgroundColor
          }
        ]}>
        <ProductListPlaceholder />
      </View>
    ) : null;
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.props.products}
          numColumns={2}
          keyExtractor={(e, i) => `list-${this.keySeed}-row-${i}-id-${e.id}`}
          onEndReached={this.fetchMore}
          onEndReachedThreshold={1}
          onScroll={this.onScroll}
          ListHeaderComponent={this.props.header}
          ListFooterComponent={this.placeholder}
          ListEmptyComponent={this.emptyList}
          contentContainerStyle={[
            styles.list,
            this.props.style,
            {
              paddingBottom:
                this.props.paddingBottom
                + (this.props.isFilterSupported ? Sizes.OuterFrame * 4 : 0)
            }
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          scrollEventThrottle={16}
          columnWrapperStyle={[
            styles.column,
            this.props.backgroundColor && {
              backgroundColor: this.props.backgroundColor
            }
          ]}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 4
  },

  emptyList: {
    flex: 1,
    paddingLeft: Sizes.InnerFrame,
    paddingRight: Math.max(Sizes.InnerFrame, Sizes.Width / 4),
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.OuterFrame * 3
  },

  emptyLabel: {
    ...Styles.Text
  },

  column: {
    alignItems: "center",
    paddingHorizontal: Sizes.InnerFrame / 4
  }
});
