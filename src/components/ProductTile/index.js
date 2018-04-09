import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import {
  LiquidImage,
  DiscountBadge,
  UppercasedText
} from "localyyz/components";

// third party
import LinearGradient from "react-native-linear-gradient";
import getSymbolFromCurrency from "currency-symbol-map";

export default class ProductTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoSize: 0
    };

    // update title length
    this.props.product && this.props.product.changeTitleWordsLength(4);

    // bindings
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e) {
    this.setState({
      photoSize: e.nativeEvent.layout.width
    });
  }

  render() {
    return this.props.product ? (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.container, this.props.style]}
        onLayout={this.onLayout}
      >
        <LiquidImage
          square
          crop="bottom"
          resizeMode="cover"
          w={this.state.photoSize}
          style={styles.photo}
          source={{ uri: this.props.product && this.props.product.imageUrl }}
        />
        <View style={styles.header}>
          <UppercasedText numberOfLines={1} style={styles.merchantName}>
            {`${this.props.product.place.name}`}
          </UppercasedText>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {this.props.product.truncatedTitle || "Something"}
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.pricing,
                !!this.props.product &&
                  !!this.props.product.previousPrice &&
                  styles.salePricing
              ]}
            >
              {`${getSymbolFromCurrency(this.props.product.place.currency) ||
                "$"}${this.props.product.price.toFixed(2)}`}
            </Text>
            {!!this.props.product &&
              !!this.props.product.previousPrice && (
                <Text
                  numberOfLines={1}
                  style={[styles.pricing, styles.previousPricing]}
                >
                  {`${this.props.product.previousPrice.toFixed(2)}`}
                </Text>
              )}
          </View>
          <LinearGradient
            colors={[
              this.props.backgroundColor || Colours.Foreground,
              Colours.Transparent
            ]}
            start={{ x: 1 }}
            end={{ x: 0 }}
            style={styles.overflowGradient}
          />
          {this.props.product.discount > 0 && (
            <View style={styles.saleBadge}>
              <DiscountBadge
                size={Sizes.TinyText}
                product={this.props.product}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: Sizes.InnerFrame / 4
  },

  photo: {
    backgroundColor: Colours.Foreground,
    borderRadius: 2
  },

  header: {
    justifyContent: "space-between",
    marginBottom: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame
  },

  titleContainer: {
    overflow: "hidden"
  },

  contentContainer: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.InnerFrame / 2
  },

  merchantName: {
    ...Styles.Text,
    ...Styles.TinyText,
    ...Styles.Emphasized,
    color: Colours.Accented
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    fontSize: Sizes.H3,
    flexWrap: "nowrap"
  },

  pricing: {
    ...Styles.Text,
    ...Styles.SmallText,
    marginRight: Sizes.InnerFrame / 3
  },

  salePricing: {
    ...Styles.Medium
  },

  previousPricing: {
    ...Styles.Subdued,
    textDecorationLine: "line-through"
  },

  overflowGradient: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: Sizes.OuterFrame
  },

  saleBadge: {
    position: "absolute",
    bottom: Sizes.InnerFrame / 2,
    right: 0
    // TODO: throws warnings some stuff about no background colour
    //shadowColor: Colours.Foreground,
    //shadowRadius: 10,
    //shadowOpacity: 1,
    //shadowOffset: {
    //width: 0,
    //height: 0
    //}
  }
});
