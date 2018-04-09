import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import getSymbolFromCurrency from "currency-symbol-map";
import { withNavigation } from "react-navigation";
import Moment from "moment";

// custom
import { Product } from "localyyz/models";
import { LiquidImage, DiscountBadge, Badge } from "localyyz/components";

@withNavigation
export default class HistoryItem extends React.Component {
  static propTypes = {
    product: PropTypes.instanceOf(Product).isRequired,
    lastPrice: PropTypes.number
  };

  static defaultProps = {
    product: {
      place: {},
      price: 0,
      previousPrice: 0,
      discount: 0
    },
    lastPrice: 0,
    lastViewedAt: Moment().valueOf()
  };

  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  get product() {
    return this.props.product;
  }

  onPress() {
    this.product.price > 0 &&
      this.props.navigation.navigate("Product", {
        product: this.product
      });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          {this.product.imageUrl ? (
            <LiquidImage
              square
              w={Sizes.SquareButton}
              crop="bottom"
              resizeMode="cover"
              style={styles.photo}
              source={{ uri: this.product.imageUrl }}
            />
          ) : (
            <View style={styles.photo} />
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{this.product.truncatedTitle}</Text>
            {this.props.lastPrice > this.product.price ? (
              <Text style={styles.lastViewedPrice}>
                {`Last viewed ${Moment(
                  this.props.lastViewedAt
                ).fromNow()} at $${this.props.lastPrice.toFixed(2)}`}
              </Text>
            ) : null}
            <View style={styles.pricingContainer}>
              <Text
                numberOfLines={1}
                style={[
                  styles.pricing,
                  !!this.product.previousPrice && styles.salePricing
                ]}>
                {`${getSymbolFromCurrency(this.product.place.currency) ||
                  "$"}${this.product.price.toFixed(2)}`}
              </Text>
              {!!this.product.previousPrice && (
                <Text
                  numberOfLines={1}
                  style={[styles.pricing, styles.previousPricing]}>
                  {`${this.product.previousPrice.toFixed(2)}`}
                </Text>
              )}
            </View>
            <View style={styles.badges}>
              {this.product.discount > 0 ? (
                <DiscountBadge style={styles.badge} product={this.product} />
              ) : null}
              {this.props.lastPrice > this.product.price ? (
                <Badge style={styles.badge} icon="bolt">
                  Price change
                </Badge>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    // marginHorizontal: Sizes.InnerFrame,
    marginVertical: 1,
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  photo: {
    width: Sizes.SquareButton,
    height: Sizes.SquareButton,
    backgroundColor: Colours.MenuBackground
  },

  content: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  pricingContainer: {
    ...Styles.Horizontal,
    marginTop: Sizes.InnerFrame / 2
  },

  pricing: {
    ...Styles.Text,
    ...Styles.Medium,
    ...Styles.SmallText,
    marginRight: Sizes.InnerFrame / 2
  },

  lastViewedPrice: {
    ...Styles.Text,
    ...Styles.Subdued,
    ...Styles.TinyText,
    marginTop: Sizes.InnerFrame / 4
  },

  salePricing: {
    ...Styles.Emphasized
  },

  previousPricing: {
    ...Styles.Subdued,
    textDecorationLine: "line-through"
  },

  badges: {
    ...Styles.Horizontal,
    alignSelf: "flex-end"
  },

  badge: {
    marginLeft: Sizes.InnerFrame / 4,
    marginTop: Sizes.InnerFrame
  }
});
