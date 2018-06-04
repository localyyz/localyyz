import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import getSymbolFromCurrency from "currency-symbol-map";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

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
          <View
            style={[
              styles.photoContainer,
              {
                backgroundColor: this.state.photoSize
                  ? Colours.Transparent
                  : Colours.Background
              }
            ]}>
            {this.state.photoSize ? (
              <ConstrainedAspectImage
                source={{
                  uri:
                    this.props.product.associatedPhotos[0]
                    && this.props.product.associatedPhotos[0].imageUrl
                }}
                sourceWidth={
                  this.props.product.associatedPhotos[0]
                  && this.props.product.associatedPhotos[0].width
                }
                sourceHeight={
                  this.props.product.associatedPhotos[0]
                  && this.props.product.associatedPhotos[0].height
                }
                constrainWidth={this.state.photoSize}
                constrainHeight={Sizes.Height / 4}/>
            ) : null}
          </View>
          <View style={styles.content}>
            <View style={styles.price}>
              <Text style={styles.priceLabel}>
                {this.toPriceString(this.props.product.price)}
              </Text>
              {this.isOnSale ? (
                <MaterialIcon
                  name="arrow-downward"
                  size={Sizes.TinyText}
                  color={Colours.Fail}/>
              ) : null}
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
                  {this.props.isVariant && this.props.product.selectedColor
                    ? capitalize(this.props.product.selectedColor)
                    : this.props.product.brand
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
    fontSize: Sizes.H3,
    marginRight: Sizes.InnerFrame / 4
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
