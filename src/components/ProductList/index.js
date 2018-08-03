import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { ProductTile } from "localyyz/components";
import { randInt } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// local
import { ProductListPlaceholder } from "./components";

@inject((stores, props) => ({
  products: ((stores.productListStore || props).products || []).slice(),
  isLoading: stores.productListStore && stores.productListStore.isLoading
}))
@observer
export class ProductList extends React.Component {
  static Placeholder = ProductListPlaceholder;

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    products: PropTypes.array,

    // mobx injected
    isFilterSupported: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    products: [],

    // mobx
    isLoading: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);

    // pseudo-unique (law of large numbers) key seed
    this._keySeed = randInt(10000000) + 1;
  }

  renderItem({ item: product }) {
    return (
      <View style={styles.tile}>
        <ProductTile
          style={styles.tileComponent}
          onPress={() =>
            this.props.navigation.push("Product", {
              product: product
            })
          }
          backgroundColor={this.props.backgroundColor}
          product={product}/>
      </View>
    );
  }

  get placeholder() {
    return this.props.isLoading ? <ProductListPlaceholder limit={2} /> : null;
  }

  render() {
    return (
      <View style={[styles.list, this.props.style]}>
        <FlatList
          data={this.props.products}
          numColumns={2}
          keyExtractor={(e, i) => `list-${this._keySeed}-row-${i}-id-${e.id}`}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={this.placeholder}
          initialNumToRender={6}
          renderItem={this.renderItem}/>
      </View>
    );
  }
}

export default withNavigation(ProductList);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 4
  },

  list: {
    flex: 1,
    backgroundColor: Colours.Foreground
  }
});
