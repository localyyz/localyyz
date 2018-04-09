import React from "react";
import {
  View, StyleSheet, Text, Image
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";
import CartItem from "./CartItem";

// third party
import {
  observer, inject
} from "mobx-react";

@inject("cartStore")
@observer
export default class CartItems extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.cartStore;

    // bindings
    this.onProductPress = this.onProductPress.bind(this);
  }

  onProductPress() {
    this.props.onProductPress && this.props.onProductPress();
  }

  get span() {
    return this.props.spanHeights[this.props.getHeight()] || 0;
  }

  render() {
    return (
      <View style={this.span == 2
        ? styles.containerFull: styles.container}>
        {this.store.cart && this.store.cart.items.map(item => (
          <CartItem
            key={`cartItem-${item.id}`}
            item={item}
            onProductBack={this.props.onProductBack}
            onPhotoPress={this.props.onPhotoPress}
            onProductPress={this.onProductPress}
            isTiny={this.span === 0}
            isSmall={this.span === 1}
            isLarge={this.span === 2} />))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  containerFull: {
    flexDirection: "column"
  }
});
