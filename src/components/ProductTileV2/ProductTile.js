import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import { ProgressiveImage } from "~/src/components";

// local
import PriceTag from "./PriceTag";
import Favourite from "./Favourite";
import Badge from "./Badge";

export const PADDING = Sizes.InnerFrame;
export const ProductTileWidth = Sizes.Width / 2 - PADDING - PADDING / 2;
export const ProductTileHeight = Sizes.Height / 3;

export class ProductTileV2 extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    selectedColor: PropTypes.string // optional selected color
  };

  onPress = () => {
    this.props.navigation.push("Product", {
      product: this.props.product,
      selectedColor: this.props.selectedColor
    });
  };

  render() {
    const inventorySum = this.props.product.variants
      .filter(
        v =>
          this.props.selectedColor
            ? v.etc.color == this.props.selectedColor
            : true
      )
      .map(v => v.limits)
      .reduce((a, b) => a + b, 0);

    let imageUrl = this.props.product.images[0].imageUrl;
    if (this.props.selectedColor) {
      let selectedVariant = this.props.product.variants.find(
        v => v.etc.color == this.props.selectedColor
      );
      if (selectedVariant.imageId) {
        let selectedImage = this.props.product.images.find(
          m => m.id == selectedVariant.imageId
        );
        imageUrl = selectedImage.imageUrl;
      }
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <View style={styles.photoContainer}>
            <ProgressiveImage
              resizeMode={"contain"}
              source={{ uri: imageUrl }}
              style={{
                width: ProductTileWidth,
                height: ProductTileHeight,
                backgroundColor: Colours.Foreground
              }}/>
          </View>

          <View style={styles.content}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.price}>
                <PriceTag product={this.props.product} />
              </View>
              <View style={{ maxWidth: Sizes.Width / 3 }}>
                <Text style={styles.brand} numberOfLines={1}>
                  {this.props.selectedColor
                    ? this.props.selectedColor
                    : this.props.product.title
                      || this.props.product.brand
                      || this.props.product.place.name}
                </Text>
              </View>
            </View>

            <View style={{ alignContent: "center" }}>
              <Favourite product={this.props.product} />
            </View>
          </View>

          <View style={styles.badge}>
            {this.props.product.discount > 0.1 ? (
              <Badge
                badgeColor={Colours.Accented}
                text={`${(this.props.product.discount * 100).toFixed(0)}% Off`}/>
            ) : inventorySum < 10 ? (
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
    flexDirection: "row",
    justifyContent: "space-between"
  },

  price: {
    ...Styles.Horizontal
  },

  badge: {
    position: "absolute",
    top: Sizes.BadgeMarginTop,
    right: Sizes.BadgeMarginRight
  },

  brand: {
    ...Styles.Subtitle
  }
});
