import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";

export default class PriceTag extends React.Component {
  static propTypes = {
    product: PropTypes.object,
    size: PropTypes.any
  };

  static defaultProps = {
    size: Sizes.Text
  };

  render() {
    const minPrice = Math.min(...this.props.product.variants.map(v => v.price));
    const maxPrice = Math.max(...this.props.product.variants.map(v => v.price));
    const currency
      = (this.props.product.place && this.props.product.place.currency) || "USD";

    const minPriceStr = toPriceString(minPrice, currency);
    const maxPriceStr = toPriceString(maxPrice, currency);
    const priceTag
      = maxPrice > minPrice ? `${minPriceStr}-${maxPriceStr}` : minPriceStr;

    const prevPriceStr
      = this.props.product.discount > 0.1 && !maxPrice
        ? toPriceString(minPrice - this.props.product.discount * minPrice)
        : "";

    return (
      <View style={styles.container}>
        <Text
          ref="price"
          style={[
            styles.label,
            this.props.size && { fontSize: this.props.size },
            this.props.product.previousPrice && {
              marginRight: Sizes.InnerFrame / 3
            }
          ]}>
          {priceTag}
        </Text>
        {prevPriceStr ? (
          <View style={styles.discountContainer}>
            <Text style={styles.previousPrice}>{prevPriceStr}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },

  discountContainer: {
    justifyContent: "space-around"
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  previousPrice: {
    fontSize: Sizes.TinyText,
    textDecorationLine: "line-through",
    color: Colours.SubduedText,
    marginHorizontal: Sizes.InnerFrame / 3,
    opacity: 0.9
  }
});
