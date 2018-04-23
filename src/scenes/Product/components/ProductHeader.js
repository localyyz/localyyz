import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { DiscountBadge, VerifiedBadge } from "localyyz/components";

// third party
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";

// consts
const BADGE_MIN_DISCOUNT = 0.1;
import { MAX_TITLE_WORD_LENGTH } from "../../../models/Product";

@inject(stores => ({
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
        <View style={styles.badges}>
          {this.props.discount >= BADGE_MIN_DISCOUNT ? (
            <View style={styles.badge}>
              <DiscountBadge discount={this.props.discount} />
            </View>
          ) : null}
          {this.props.placeRank > 5 && (
            <View style={styles.badge}>
              <VerifiedBadge />
            </View>
          )}
        </View>
        <Text
          style={[
            styles.title,
            this.props.numTitleWords > MAX_TITLE_WORD_LENGTH
              ? Styles.Title
              : Styles.Oversized
          ]}>
          {this.props.title}
        </Text>
        {this.props.placeName ? (
          <Text style={styles.subtitle}>{this.props.placeName}</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.Height / 8,
    marginHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.BottomHalfSpacing
  },

  subtitle: {
    ...Styles.Text
  },

  badges: {
    ...Styles.Horizontal,
    alignItems: "center",
    marginVertical: Sizes.InnerFrame / 2
  },

  badge: {
    marginRight: Sizes.InnerFrame / 4
  }
});
