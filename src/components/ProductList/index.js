import React from "react";
import {
  Animated,
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList
} from "react-native";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import ProductTileV2, {
  PADDING as ProductTilePadding
} from "~/src/components/ProductTileV2";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ProductListItem extends React.Component {
  shouldComponentUpdate() {
    // OPTIMIZATION: do not rerender list items
    return false;
  }

  onPress = () => {
    this.props.navigation.push("Product", {
      product: this.props.product
    });
  };

  render() {
    return (
      <ProductTileV2 onPress={this.onPress} product={this.props.product} />
    );
  }
}

@inject((stores, props) => ({
  products: (stores.productListStore || props).products.slice() || [],
  isLoading: (stores.productListStore || props).isLoading
}))
@observer
export class ProductList extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    products: PropTypes.any
  };

  static defaultProps = {
    products: [],
    onEndReached: () => {},
    containerStyle: {}
  };

  renderItem = ({ item: product, index }) => {
    const itemStyle = index % 2 == 0 ? styles.itemEven : styles.itemOdd;
    return (
      <View style={[styles.separator, itemStyle]}>
        <ProductListItem product={product} navigation={this.props.navigation} />
      </View>
    );
  };

  render() {
    return (
      <AnimatedFlatList
        {...this.props}
        data={this.props.products}
        numColumns={2}
        keyExtractor={i => i.id}
        renderItem={this.renderItem}
        ListFooterComponent={
          <ActivityIndicator
            size="large"
            animating={this.props.isLoading || false}/>
        }
        onEndReachedThreshold={1}
        scrollEventThrottle={16}
        initialNumToRender={6}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, this.props.containerStyle]}/>
    );
  }
}

export default withNavigation(ProductList);

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colours.Foreground,
    paddingBottom: Sizes.Height / 6
  },

  separator: {
    paddingBottom: Sizes.OuterFrame
  },

  itemEven: {
    paddingLeft: ProductTilePadding,
    paddingRight: ProductTilePadding / 2
  },

  itemOdd: {
    paddingLeft: ProductTilePadding / 2,
    paddingRight: ProductTilePadding
  }
});
