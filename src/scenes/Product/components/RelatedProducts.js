import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ProductList } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

@inject(stores => ({
  relatedProducts: stores.productStore.relatedProducts.slice() || [],
  fetch: stores.productStore.fetchRelatedProduct,
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
export class RelatedProducts extends React.Component {
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

  onPressMore = () => {
    this.props.navigation.push("ProductList", {
      fetchPath: `places/${this.props.placeId}/products`,
      title: `${this.props.placeName}`,
      subtitle: "Here's some related products from this merchant"
    });
  };

  render() {
    return this.props.relatedProducts.length > 0 ? (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Others also viewed</Text>
        </View>
        <ProductList
          containerStyle={{ paddingBottom: 0 }}
          products={this.props.relatedProducts}/>
        <TouchableOpacity onPress={this.onPressMore} style={styles.tile}>
          <View style={styles.callToAction}>
            <Text style={styles.callToActionLabel}>
              View {this.props.placeName} Collection
            </Text>
            <MaterialCommunityIcon
              name="arrow-right"
              size={Sizes.Text}
              color={Colours.Text}/>
          </View>
        </TouchableOpacity>
      </View>
    ) : null;
  }
}

export default withNavigation(RelatedProducts);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    paddingBottom: Sizes.InnerFrame
  },

  header: {
    marginVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    marginHorizontal: Sizes.InnerFrame
  },
  tile: {
    alignItems: "flex-end",
    marginHorizontal: Sizes.InnerFrame
  },

  callToAction: {
    ...Styles.Horizontal,
    paddingBottom: Sizes.InnerFrame / 4,
    width: Sizes.Width / 2
  },

  callToActionLabel: {
    fontSize: Sizes.SmallText,
    marginRight: Sizes.InnerFrame / 2
  }
});
