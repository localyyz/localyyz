import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { ProductTile } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// local
import { ProductListPlaceholder } from "./components";

class ProductListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    // OPTIMIZATION: do not rerender list items
    return false;
  }

  render() {
    return (
      <View style={styles.tile}>
        <ProductTile
          style={styles.tileComponent}
          onPress={() =>
            this.props.navigation.push("Product", {
              product: this.props.product
            })
          }
          backgroundColor={this.props.backgroundColor}
          product={this.props.product}/>
      </View>
    );
  }
}

@inject((stores, props) => ({
  products: (stores.productListStore || props).products || []
}))
@observer
export class ProductList extends React.Component {
  static Placeholder = ProductListPlaceholder;

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    products: PropTypes.any
  };

  static defaultProps = {
    products: []
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  get placeholder() {
    return <ProductListPlaceholder limit={2} />;
  }

  renderItem = ({ item: product }) => {
    return (
      <ProductListItem product={product} navigation={this.props.navigation} />
    );
  };

  render() {
    return (
      <View style={[styles.list, this.props.style]}>
        <FlatList
          data={this.props.products.slice()}
          numColumns={2}
          keyExtractor={i => i.id}
          renderItem={this.renderItem}
          ListFooterComponent={this.placeholder}
          initialNumToRender={6}/>
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
