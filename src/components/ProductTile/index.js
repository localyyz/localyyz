import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import getSymbolFromCurrency from "currency-symbol-map";

export default class ProductTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    // update title length
    this.props.product && this.props.product.changeTitleWordsLength(4);

    // bindings
    this.onLayout = this.onLayout.bind(this);
    this.toPriceString = this.toPriceString.bind(this);
  }

  onLayout(e) {
    // get the first on layout
    if (!this.state.photoSize && e.nativeEvent.layout.width > 0) {
      this.setState({
        photoSize: Math.round(e.nativeEvent.layout.width)
      });
    }
  }

  toPriceString(price, avoidFree = false) {
    return price != null && (price > 0 || !avoidFree)
      ? price > 0
        ? `${getSymbolFromCurrency(this.props.product.place.currency)
            || "$"}${price.toFixed(2)}`
        : "Free"
      : "";
  }

  get isOnSale() {
    return (
      this.props.product.previousPrice != null
      && this.props.product.previousPrice > 0
    );
  }

  render() {
    return this.props.product ? (
      <TouchableOpacity onPress={this.props.onPress} onLayout={this.onLayout}>
        <View style={styles.container}>
          <View style={styles.photoContainer}>
            <ConstrainedAspectImage
              source={{ uri: this.props.product.imageUrl }}
              constrainWidth={this.state.photoSize}
              constrainHeight={Sizes.Height / 4}/>
          </View>
          <View style={styles.content}>
            <View style={styles.price}>
              {this.isOnSale ? <View style={styles.priceOnSale} /> : null}
              <Text style={styles.priceLabel}>
                {this.toPriceString(this.props.product.price)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text numberOfLines={1} style={styles.label}>
                <Text style={styles.prevPrice}>
                  {this.toPriceString(this.props.product.previousPrice, true)}
                </Text>
                {this.props.product.previousPrice
                && (this.props.product.brand
                  || this.props.product.truncatedTitle) ? (
                  <Text> · </Text>
                ) : null}
                <Text style={styles.name}>
                  {this.props.product.brand
                    || this.props.product.truncatedTitle}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
    paddingVertical: Sizes.InnerFrame / 2
    // backgroundColor: Colours.Accented
  },

  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.Height / 4,
    backgroundColor: Colours.Foreground
  },

  content: {
    height: Sizes.InnerFrame * 4,
    alignItems: "center",
    justifyContent: "center"
  },

  price: {
    ...Styles.Horizontal,
    marginBottom: Sizes.InnerFrame / 2
  },

  priceLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    fontSize: Sizes.H3
  },

  priceOnSale: {
    height: Sizes.TinyText / 2,
    width: Sizes.TinyText / 2,
    borderRadius: Sizes.TinyText / 4,
    marginRight: Sizes.InnerFrame / 2,
    backgroundColor: Colours.OnSale
  },

  label: {
    ...Styles.Text,
    ...Styles.TinyText,
    ...Styles.Subdued
  },

  prevPrice: {
    textDecorationLine: "line-through"
  }
});
