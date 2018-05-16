import React from "react";
import { View, StyleSheet } from "react-native";
import { Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";

@inject(stores => ({
  product: stores.productStore.product,
  coverPhoto:
    stores.productStore.product && stores.productStore.product.imageUrl,
  discount: stores.productStore.product && stores.productStore.product.discount,
  placeRank:
    stores.productStore.product
    && stores.productStore.product.place
    && stores.productStore.product.place.weight,
  placeName:
    stores.productStore.product
    && stores.productStore.product.place
    && stores.productStore.product.place.name,
  title: stores.productStore.product && stores.productStore.product.title,
  numTitleWords:
    stores.productStore.product && stores.productStore.product.numTitleWords
}))
@observer
export default class ProductHeader extends React.Component {
  static propTypes = {
    // mobx injected
    discount: PropTypes.number,
    placeRank: PropTypes.number,
    numTitleWords: PropTypes.number,
    placeName: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    discount: 0,
    numTitleWords: 0,
    placeRank: 0,
    placeName: "",
    title: ""
  };

  render() {
    return (
      <View {...this.props} style={styles.container}>
        <ConstrainedAspectImage
          source={{ uri: this.props.coverPhoto }}
          constrainWidth={Sizes.Width}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: Sizes.OuterFrame * 3,
    alignItems: "center"
  }
});