import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ProductTile } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject } from "mobx-react/native";

// constants
const SCROLL_THRESHOLD = 100;

@withNavigation
@inject(stores => ({
  isFilterSupported: !!stores.filterStore
}))
export default class ProductList extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    products: PropTypes.array,
    style: PropTypes.any,
    backgroundColor: PropTypes.string,
    onScrollUp: PropTypes.func,
    onScrollDown: PropTypes.func,
    onScroll: PropTypes.func,
    onEndReached: PropTypes.func,
    paddingBottom: PropTypes.number
  };

  static defaultProps = {
    paddingBottom: 0,
    products: [],
    onScrollUp: () => {},
    onScrollDown: () => {},
    onScroll: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };

    // bindings
    this.fetchMore = this.fetchMore.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onScroll = this.onScroll.bind(this);

    // scrolling
    this.position = 0;
    this.change = 0;
    this.thresholdReached = false;
  }

  fetchMore({ distanceFromEnd }) {
    // NOTE: distanceFromEnd is returned by FlatList as a calculated value
    // as the current layout's distance to the end of scroll. However when
    // the next page is fetched, distance can be a negative value, which
    // we need to handle
    if (distanceFromEnd > 0) {
      this.setState({ isLoading: true });
      this.timer = setTimeout(() => this.setState({ isLoading: false }), 1500);
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
          style={{ minHeight: 250 }}
          onPress={() =>
            this.props.navigation.navigate("Product", {
              product: product
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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.props.products}
          numColumns={2}
          keyExtractor={e => e.id}
          onEndReached={this.fetchMore}
          onEndReachedThreshold={1}
          onScroll={this.onScroll}
          ListFooterComponent={
            this.props.onEndReached && (
              <ActivityIndicator
                size="large"
                animating={this.state.isLoading}/>
            )
          }
          contentContainerStyle={[
            styles.list,
            this.props.style,
            this.props.backgroundColor && {
              backgroundColor: this.props.backgroundColor
            },
            {
              marginTop: this.props.headerHeight,
              paddingBottom:
                this.props.paddingBottom
                + (this.props.isFilterSupported ? Sizes.OuterFrame : 0)
            }
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          scrollEventThrottle={16}
          columnWrapperStyle={styles.column}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  list: {
    paddingHorizontal: Sizes.InnerFrame
  },

  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
