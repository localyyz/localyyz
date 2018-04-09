import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { randInt } from "localyyz/helpers";
import { withNavigation } from "react-navigation";
import { Product } from "localyyz/models";
import { LiquidImage } from "localyyz/components";

// third-party
import * as Animatable from "react-native-animatable";
import { inject } from "mobx-react";
import EntypoIcon from "react-native-vector-icons/Entypo";

// cart photo sizes
const MAX_PHOTO = Sizes.Width / 5;
const MIN_PHOTO = MAX_PHOTO / 3;

@withNavigation
@inject("cartStore", "assistantStore")
export default class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.cartStore;
    this.assistant = this.props.assistantStore;
    this.product = new Product(this.props.item.product);

    // bindings
    this.onPress = this.onPress.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onPress() {
    this.props.onProductPress && this.props.onProductPress();

    // forward out to product page
    this.props.navigation.navigate("Product", {
      product: this.props.item.product,
      onBack: this.props.onProductBack
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
        onPress: () => {
          this.props.onRemove && this.props.onRemove();
          let message =
            "Hold on, I'm currently trying to remove that item from your cart..";
          this.assistant.write(message, null, true);

          // and remove item from cart
          this.store.removeItem({ productId: this.props.item.id }).then(() => {
            this.assistant.get(message).cancel();
            this.store.checkout();
          });
        }
      }
    ]);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={[Styles.Horizontal, styles.container]}>
          <Animatable.View
            animation="zoomIn"
            duration={300}
            delay={randInt(200) + 700}
            style={styles.photoContainer}>
            <TouchableOpacity
              onPress={
                this.props.isLarge ? this.onPress : this.props.onPhotoPress
              }
              hitSlop={{
                top: Sizes.InnerFrame,
                bottom: Sizes.InnerFrame,
                left: Sizes.InnerFrame,
                right: Sizes.InnerFrame
              }}>
              <LiquidImage
                square
                w={this.props.isTiny ? MIN_PHOTO : MAX_PHOTO}
                style={styles.photo}
                source={{ uri: this.props.item.product.imageUrl }}
              />
            </TouchableOpacity>
            {this.props.isSmall && (
              <Text
                style={[
                  Styles.Text,
                  Styles.Emphasized,
                  Styles.SmallText,
                  styles.smallPriceLabel
                ]}>
                {`$${this.props.item.price.toFixed(2)}`}
              </Text>
            )}
          </Animatable.View>
          {this.props.isLarge && (
            <View style={styles.detailsContainer}>
              <View
                style={[Styles.Horizontal, Styles.EqualColumns, styles.header]}>
                <Text
                  style={[Styles.Text, Styles.SmallText, styles.titleLabel]}>
                  {this.product.truncatedTitle}
                </Text>
                <TouchableOpacity
                  onPress={this.onRemove}
                  hitSlop={{
                    top: Sizes.OuterFrame,
                    bottom: Sizes.OuterFrame,
                    left: Sizes.OuterFrame,
                    right: Sizes.OuterFrame
                  }}>
                  <EntypoIcon
                    name="trash"
                    size={Sizes.IconButton / 2}
                    color={Colours.Text}
                    style={styles.removeItem}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[Styles.Text, Styles.Emphasized, styles.priceLabel]}>
                {`$${this.props.item.price.toFixed(2)}`}
              </Text>
              <Text style={[Styles.Text, Styles.Terminal, styles.optionsLabel]}>
                {`${this.props.item.variant.etc
                  .size}${/* spacer in between if both are given*/
                this.props.item.variant.etc.size &&
                this.props.item.variant.etc.color
                  ? " — "
                  : ""}${this.props.item.variant.etc.color}`}
              </Text>
              {this.props.item.hasError && (
                <View style={styles.alert}>
                  <Text style={styles.alertLabel}>
                    This item is out of stock
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  photoContainer: {
    alignItems: "center"
  },

  photo: {
    backgroundColor: Colours.Foreground
  },

  smallPriceLabel: {
    marginTop: Sizes.InnerFrame / 3
  },

  detailsContainer: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  },

  priceLabel: {
    marginVertical: Sizes.InnerFrame / 3
  },

  titleLabel: {
    flex: 1,
    flexWrap: "wrap"
  },

  removeItem: {
    marginRight: Sizes.InnerFrame / 2
  },

  alert: {
    backgroundColor: Colours.Alert,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    marginRight: Sizes.InnerFrame / 2,
    marginTop: Sizes.InnerFrame / 2
  },

  alertLabel: {
    ...Styles.Text,
    ...Styles.Terminal
  }
});
