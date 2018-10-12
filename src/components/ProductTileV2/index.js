import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from "react-native";

// third party
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import { PriceTag } from "~/src/components";

// local
import Favourite from "./Favourite";

export const IMAGE_WIDTH = Sizes.Width / 3;
export const IMAGE_HEIGHT = 4 * Sizes.Width / 9;

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
            <Image
              source={{
                uri:
                  this.props.product.associatedPhotos[0]
                  && this.props.product.associatedPhotos[0].imageUrl
              }}
              style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}/>
          </View>
          <View style={styles.content}>
            <View style={{ maxWidth: Sizes.Width / 3 }}>
              <Text numberOfLines={1} style={Styles.Subtitle}>
                {this.props.product.brand}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
              <View style={styles.price}>
                <PriceTag product={this.props.product} />
              </View>
              <Favourite product={this.props.product} />
            </View>
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
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    paddingVertical: Sizes.InnerFrame
  },

  price: {
    ...Styles.Horizontal,
    marginBottom: Sizes.InnerFrame / 2
  }
});
