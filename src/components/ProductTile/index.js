import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";
import { capitalize, toPriceString } from "localyyz/helpers";

// third party
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import { PropTypes as mobxPropTypes } from "mobx-react/native";

// local
import { ProductTilePlaceholder } from "./components";

export default class ProductTile extends React.PureComponent {
  static Placeholder = ProductTilePlaceholder;

  static propTypes = {
    product: mobxPropTypes.observableObject.isRequired,
    onPress: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};

    // update title length
    this.props.product && this.props.product.changeTitleWordsLength(4);

    // bindings
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e) {
    // get the first on layout
    if (!this.state.photoSize && e.nativeEvent.layout.width > 0) {
      this.setState({
        photoSize: Math.round(e.nativeEvent.layout.width)
      });
    }
  }

  get isOnSale() {
    return (
      this.props.product.previousPrice != null
      && this.props.product.previousPrice > 0
    );
  }

  render() {
    return (
      <TouchableOpacity
        ref="productTileTouchable"
        onPress={this.props.onPress}
        onLayout={this.onLayout}>
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
                ref="productTileImage"
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
              <Text
                ref="productTilePrice"
                style={[
                  styles.priceLabel,
                  this.isOnSale && styles.discountText
                ]}>
                {toPriceString(
                  this.props.product.price,
                  this.props.product.place.currency
                )}
              </Text>
            </View>
            <View style={styles.details}>
              <Text numberOfLines={1} style={styles.label}>
                {this.isOnSale ? (
                  <Text ref="productTileDiscount">
                    {`-${Math.round(this.props.product.discount * 100.0, 0)}%`}
                  </Text>
                ) : null}
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
    );
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

  discountText: {
    color: Colours.Fail
  }
});
