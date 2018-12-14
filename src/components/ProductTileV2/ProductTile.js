import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import { PriceTag, ProgressiveImage } from "~/src/components";

// local
import Favourite from "./Favourite";
import Badge from "./Badge";

export const PADDING = Sizes.InnerFrame;
export const ProductTileWidth = Sizes.Width / 2 - PADDING - PADDING / 2;
export const ProductTileHeight = Sizes.Height / 3;

export class ProductTileV2 extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired
  };

  onPress = () => {
    this.props.navigation.push("Product", {
      product: this.props.product
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <View style={styles.photoContainer}>
            <ProgressiveImage
              resizeMode={"contain"}
              source={{
                uri:
                  this.props.product.associatedPhotos[0]
                  && this.props.product.associatedPhotos[0].imageUrl
              }}
              style={{
                width: ProductTileWidth,
                height: ProductTileHeight,
                backgroundColor: Colours.Foreground
              }}/>
          </View>
          /* Place the merchant and price tag in one column and the favourite
          button in the next column */
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "column"
                // Place the merchant name and price tag into separate rows
              }}>
              <View style={{ maxWidth: Sizes.Width / 3 }}>
                <Text style={styles.brand} numberOfLines={1}>
                  {this.props.product.brand || this.props.product.place.name}
                </Text>
              </View>
              <View style={styles.price}>
                <PriceTag
                  product={this.props.product}
                  size={Sizes.SmallText}
                  discountSize={Sizes.TinyText}/>
              </View>
            </View>

            <View style={{ alignContent: "center" }}>
              <Favourite product={this.props.product} />
            </View>
          </View>
          <View
            style={[
              styles.badge,
              {
                top: Sizes.BadgeMarginTop,
                right: Sizes.BadgeMarginRight
              }
            ]}>
            {this.props.product.discount > 0.1 ? (
              <Badge
                badgeColor={Colours.Accented}
                text={`${(this.props.product.discount * 100).toFixed(0)}% Off`}/>
            ) : this.props.product.associatedStock < 10 ? (
              <Badge badgeColor={Colours.RoseRed} text={"Low Stock!"} />
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(ProductTileV2);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  photoContainer: {
    backgroundColor: Colours.Background,
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame / 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  price: {
    ...Styles.Horizontal
  },

  badge: {
    position: "absolute",
    top: 0,
    right: 0
  },

  brand: {
    ...Styles.Subtitle
  }
});
