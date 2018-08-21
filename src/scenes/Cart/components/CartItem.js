import React from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import { Product } from "localyyz/models";
import { ConstrainedAspectImage } from "localyyz/components";
import { toPriceString } from "localyyz/helpers";

// third-party
import PropTypes from "prop-types";
import { inject } from "mobx-react/native";
import Swipeout from "react-native-swipeout";

// cart photo sizes
const MAX_PHOTO_SIZE = Sizes.Width / 5;

@inject(stores => ({
  removeItem: stores.cartStore.removeItem
}))
export default class CartItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onRemove: PropTypes.func
  };

  constructor(props) {
    super(props);

    // data
    this.product = new Product(props.item.product);

    // bindings
    this.onPress = this.onPress.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onPress() {
    // forward out to product page
    this.props.navigation.navigate("Product", {
      product: this.props.item.product
    });
  }

  onRemove() {
    Alert.alert("Remove this item?", null, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: async () => {
          const resolved = await this.props.removeItem(this.props.item);
          if (resolved.error) {
            Alert.alert("Please try again", resolved.error);
          } else {
            this.props.onRemove && this.props.onRemove();
          }
        }
      }
    ]);
  }

  get options() {
    return [{ text: "Remove", type: "delete", onPress: this.onRemove }];
  }

  render() {
    return (
      <View style={this.props.style}>
        <Swipeout right={this.options}>
          <TouchableOpacity onPress={this.onPress}>
            <View style={styles.container}>
              <View style={styles.photo}>
                <ConstrainedAspectImage
                  testID="photo"
                  source={{
                    uri:
                      this.props.item.product.associatedPhotos[0]
                      && this.props.item.product.associatedPhotos[0].imageUrl
                  }}
                  sourceWidth={
                    this.props.item.product.associatedPhotos[0]
                    && this.props.item.product.associatedPhotos[0].width
                  }
                  sourceHeight={
                    this.props.item.product.associatedPhotos[0]
                    && this.props.item.product.associatedPhotos[0].height
                  }
                  constrainWidth={MAX_PHOTO_SIZE}/>
              </View>
              <View style={styles.content}>
                {this.props.item.hasError && (
                  <View testID="hasError" style={styles.row}>
                    <View style={styles.alert}>
                      <Text style={styles.alertLabel}>
                        This item is out of stock
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text testID="title" style={styles.title} numberOfLines={1}>
                      {this.props.item.product.title}
                    </Text>
                  </View>
                  <Text testID="price" style={[styles.title, styles.value]}>
                    {toPriceString(this.props.item.price)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text
                      style={styles.description}
                      testID="brand"
                      numberOfLines={1}>
                      {this.props.item.product.brand}
                    </Text>
                  </View>
                  {this.props.item.product.previousPrice ? (
                    <Text
                      testID="previousPrice"
                      style={[
                        styles.description,
                        styles.value,
                        styles.prevPrice
                      ]}>
                      {toPriceString(this.props.item.product.previousPrice)}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.row, styles.last]}>
                  <View style={styles.label}>
                    <Text
                      testID="variant"
                      style={styles.description}
                      numberOfLines={1}>
                      {this.props.item.variant.description}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  photo: {
    width: MAX_PHOTO_SIZE
  },

  content: {
    flex: 1,
    padding: Sizes.InnerFrame
  },

  row: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  last: {
    marginTop: Sizes.InnerFrame / 2
  },

  label: {
    flex: 1
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  value: {
    marginLeft: Sizes.InnerFrame
  },

  description: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  prevPrice: {
    textDecorationLine: "line-through"
  },

  alertLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    color: Colours.Fail
  }
});
