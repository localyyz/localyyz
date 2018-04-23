import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ProductList, MoreTile } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";

@withNavigation
@inject(stores => ({
  relatedProducts: stores.productStore.relatedProducts.slice() || [],
  fetch: () =>
    stores.productStore.product
      ? stores.productStore.fetchRelatedProduct()
      : {},
  placeId:
    stores.productStore.product
    && stores.productStore.product.place
    && stores.productStore.product.place.id,
  placeName:
    stores.productStore.product
    && stores.productStore.product.place
    && stores.productStore.product.place.name
}))
@observer
export default class RelatedProducts extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    relatedProducts: PropTypes.array.isRequired,
    fetch: PropTypes.func.isRequired,
    placeId: PropTypes.number,
    placeName: PropTypes.string
  };

  static defaultProps = {
    placeName: ""
  };

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    return this.props.relatedProducts.length > 0 ? (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Related products</Text>
        </View>
        <ProductList products={this.props.relatedProducts} />
        <View style={styles.footer}>
          <MoreTile
            onPress={() =>
              this.props.placeId
              && this.props.navigation.navigate("ProductList", {
                fetchPath: `places/${this.props.placeId}/products`,
                title: `${this.props.placeName}`,
                subtitle: "Here's some related products from this merchant"
              })
            }/>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    marginVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame - Sizes.InnerFrame
  },

  header: {
    marginVertical: Sizes.InnerFrame,
    paddingTop: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Title,
    marginHorizontal: Sizes.InnerFrame
  },

  footer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginVertical: Sizes.OuterFrame
  }
});
