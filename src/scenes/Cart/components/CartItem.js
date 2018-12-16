import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import Product from "~/src/stores/ProductStore";
import { ProgressiveImage } from "localyyz/components";
import { toPriceString } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third-party
import { inject } from "mobx-react/native";
import PropTypes from "prop-types";
import Swipeout from "react-native-swipeout";
import { withNavigation } from "react-navigation";

// cart photo sizes
const MAX_PHOTO_SIZE = Sizes.Width / 5;

@inject(stores => ({
  removeItem: stores.cartStore.removeItem,
  setScrollEnabled: stores.cartUiStore.setScrollEnabled
}))
export class CartItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
    onRemove: PropTypes.func
  };

  constructor(props) {
    super(props);

    // data
    this.product = new Product(props.item.product);
  }

  onPress = () => {
    this.props.navigation.navigate("Product", {
      product: this.product,
      listTitle: "Cart"
    });
  };

  onRemove = () => {
    this.props.removeItem(this.props.item);
  };

  get options() {
    return [{ text: "Remove", type: "delete", onPress: this.onRemove }];
  }

  render() {
    return (
      <View style={this.props.style}>
        <Swipeout right={this.options} scroll={this.props.setScrollEnabled}>
          <TouchableOpacity onPress={this.onPress}>
            <View style={styles.container}>
              <View style={styles.photo}>
                <ProgressiveImage
                  testID="photo"
                  source={{
                    uri:
                      this.props.item.product.images[0]
                      && this.props.item.product.images[0].imageUrl
                  }}
                  style={{
                    height: MAX_PHOTO_SIZE,
                    width: MAX_PHOTO_SIZE
                  }}/>
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

export default withNavigation(CartItem);

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
