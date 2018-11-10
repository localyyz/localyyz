import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";

export default class PriceTag extends React.Component {
  get priceTag() {
    return this.props.product.minPrice >= this.props.product.maxPrice
      ? toPriceString(
          this.props.product.price,
          this.props.product.place && this.props.product.place.currency
        )
      : `${toPriceString(
          this.props.product.minPrice,
          this.props.product.place && this.props.product.place.currency
        )}—${toPriceString(
          this.props.product.maxPrice,
          this.props.product.place && this.props.product.place.currency
        )}`;
  }

  render() {
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
          {this.priceTag}
        </Text>
        {this.props.product.discount > 0.1 ? (
          <View style={styles.discountContainer}>
            <Text
              style={[
                styles.previousPrice,
                this.props.discountSize && {
                  fontSize: this.props.discountSize
                },
                { marginHorizontal: Sizes.InnerFrame / 3 }
              ]}>
              {toPriceString(this.props.product.previousPrice)}
            </Text>
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
    fontSize: Sizes.MiniText,
    textDecorationLine: "line-through",
    color: Colours.SubduedText,
    opacity: 0.9
  }
});
