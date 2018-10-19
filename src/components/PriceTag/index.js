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
        {this.props.product.previousPrice ? (
          <View style={styles.background}>
            <View style={styles.highlighter} />
          </View>
        ) : null}
        <Text
          ref="price"
          style={[
            styles.label,
            this.props.size && { fontSize: this.props.size },
            this.props.product.previousPrice && {
              marginHorizontal: Sizes.InnerFrame / 3
            }
          ]}>
          {this.priceTag}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center"
  },

  highlighter: {
    width: "100%",
    height: Sizes.InnerFrame * 2 / 3,
    marginTop: Sizes.InnerFrame / 6,
    backgroundColor: Colours.Clearance
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
