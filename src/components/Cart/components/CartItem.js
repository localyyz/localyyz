import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import { randInt } from "localyyz/helpers";
import { Product } from "localyyz/models";
import { LiquidImage, UppercasedText, SloppyView } from "localyyz/components";

// third-party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import { withNavigation } from "react-navigation";
import { inject } from "mobx-react";
import EntypoIcon from "react-native-vector-icons/Entypo";

// cart photo sizes
const MAX_PHOTO = Sizes.Width / 5;
const MIN_PHOTO = MAX_PHOTO / 3;

@withNavigation
@inject(stores => ({
  setFullscreenPullup: () => stores.cartUiStore.setFullscreenPullup(),
  setLargeItemType: () => stores.cartUiStore.setItemSizeType(2),
  closeCart: () => stores.navbarStore.togglePullup(false),
  remove: product => stores.cartStore.removeItem(product),
  sync: () => stores.cartStore.checkoutWithReject(),
  write: message => stores.assistantStore.write(message, null, true),
  getWrite: message => stores.assistantStore.get(message)
}))
export default class CartItem extends React.Component {
  static propTypes = {
    navigation: PropTypes.any.isRequired,
    item: PropTypes.object.isRequired,
    isTiny: PropTypes.bool,
    isSmall: PropTypes.bool,
    isLarge: PropTypes.bool,

    // mobx injected
    setFullscreenPullup: PropTypes.func.isRequired,
    setLargeItemType: PropTypes.func.isRequired,
    closeCart: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    write: PropTypes.func.isRequired,
    getWrite: PropTypes.func.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    // data
    this.product = new Product(props.item.product);

    // bindings
    this.onPress = this.onPress.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onPress() {
    if (!this.props.isLarge) {
      this.props.setLargeItemType();
    } else {
      this.props.closeCart();

      // forward out to product page
      this.props.navigation.navigate("Product", {
        product: this.props.item.product
      });
    }
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
          // remove item from cart
          //  and sync to remove
          this.props.remove(this.props.item).then(() => {
            this.props.sync();
          });
        }
      }
    ]);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Animatable.View
          animation="zoomIn"
          duration={300}
          delay={randInt(200) + 700}
          style={[styles.container, !this.props.isLarge && styles.gridSquare]}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={this.props.setFullscreenPullup}>
            <LiquidImage
              square
              w={this.props.isTiny ? MIN_PHOTO : MAX_PHOTO}
              style={styles.photo}
              source={{ uri: this.props.item.product.imageUrl }}/>
            {this.props.isSmall ? (
              <Text
                style={[
                  Styles.Text,
                  Styles.Emphasized,
                  Styles.SmallText,
                  styles.smallPriceLabel
                ]}>
                {`$${this.props.item.price.toFixed(2)}`}
              </Text>
            ) : null}
          </TouchableOpacity>
          {this.props.isLarge ? (
            <View style={styles.detailsContainer}>
              <View
                style={[Styles.Horizontal, Styles.EqualColumns, styles.header]}>
                <View>
                  <UppercasedText style={styles.optionsLabel}>
                    {`${this.props.item.variant.etc.size}${
                      /* spacer in between if both are given*/
                      this.props.item.variant.etc.size
                      && this.props.item.variant.etc.color
                        ? " — "
                        : ""
                    }${this.props.item.variant.etc.color}`}
                  </UppercasedText>
                  <Text style={styles.titleLabel}>
                    {this.product.truncatedTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={this.onRemove}>
                  <SloppyView>
                    <EntypoIcon
                      name="trash"
                      size={Sizes.IconButton / 2}
                      color={Colours.Text}
                      style={styles.removeItem}/>
                  </SloppyView>
                </TouchableOpacity>
              </View>
              <Text style={styles.priceLabel}>
                {`$${this.props.item.price.toFixed(2)}`}
              </Text>
              {this.props.item.hasError && (
                <View style={styles.alert}>
                  <Text style={styles.alertLabel}>
                    This item is out of stock
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    marginVertical: 1,
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  gridSquare: {
    margin: Sizes.InnerFrame / 2,
    padding: Sizes.InnerFrame / 2,
    marginVertical: null
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
    ...Styles.Text,
    marginVertical: Sizes.InnerFrame / 2
  },

  optionsLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.TinyText,
    color: Colours.Accented
  },

  titleLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
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
    ...Styles.SmallText
  }
});
