import React from "react";
import { ActivityIndicator, View, StyleSheet, FlatList } from "react-native";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// custom
import { Colours } from "localyyz/constants";
import ProductTileV2, {
  ProductTileHeight,
  PADDING as ProductTilePadding
} from "~/src/components/ProductTileV2";

class ProductListItem extends React.Component {
  shouldComponentUpdate() {
    // OPTIMIZATION: do not rerender list items
    return false;
  }

  render() {
    return (
      <ProductTileV2
        onPress={() =>
          this.props.navigation.push("Product", {
            product: this.props.product
          })
        }
        product={this.props.product}/>
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
    onEndReached: () => {}
  };

  renderItem = ({ item: product, index }) => {
    const itemStyle = index % 2 == 0 ? styles.itemEven : styles.itemOdd;
    return (
      <View style={itemStyle}>
        <ProductListItem product={product} navigation={this.props.navigation} />
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.products}
        numColumns={2}
        keyExtractor={i => i.id}
        renderItem={this.renderItem}
        ListFooterComponent={<ActivityIndicator size="large" animating />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReachedThreshold={1}
        onEndReached={this.props.onEndReached}
        scrollEventThrottle={16}
        initialNumToRender={6}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}/>
    );
  }
}

export default withNavigation(ProductList);

const styles = StyleSheet.create({
  content: {
    paddingBottom: ProductTileHeight,
    backgroundColor: Colours.Foreground
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
