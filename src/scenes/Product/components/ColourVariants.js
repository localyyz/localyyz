import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ProductTile } from "localyyz/components";
import { Product } from "localyyz/stores";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

@inject(stores => ({
  product: stores.productStore.product,
  dealStore: stores.dealStore,
  activeDealStore: stores.activeDealStore
}))
@observer
export class ColourVariants extends React.Component {
  static propTypes = {
    // mobx injected
    product: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item: color }) {
    // instantiate a new virtual product model of this color only
    let product = new Product(this.props.product, color);
    return (
      <View style={styles.tile}>
        <ProductTile
          isVariant
          product={product}
          onPress={() =>
            this.props.navigation.navigate("Product", {
              product: product,

              // used for now timer sync
              dealStore: this.props.dealStore,

              // deal data itself
              activeDealStore: this.props.activeDealStore
            })
          }/>
      </View>
    );
  }

  render() {
    return this.props.product
      && this.props.product.colors
      && this.props.product.colors.length > 1 ? (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Other colors</Text>
          <Text style={styles.headerDescription}>
            This product is also available in other colors.
          </Text>
        </View>
        <View style={styles.content}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.props.product.colors
              .slice()
              .filter(color => color != this.props.product.selectedColor)}
            keyExtractor={item => item}
            renderItem={this.renderItem}
            contentContainerStyle={styles.splitList}/>
        </View>
      </View>
    ) : null;
  }
}

export default withNavigation(ColourVariants);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    marginVertical: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  },

  header: {
    paddingHorizontal: Sizes.OuterFrame - Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  headerDescription: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  },

  tile: {
    width: Sizes.Width / 2 - Sizes.InnerFrame * 3,
    paddingHorizontal: Sizes.InnerFrame / 2
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
