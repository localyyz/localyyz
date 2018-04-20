import React from "react";
import { View, StyleSheet } from "react-native";
import { Sizes } from "localyyz/constants";
import CartItem from "./CartItem";

// third party
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

@inject(stores => ({
  isVisible: stores.cartUiStore.isItemsVisible,
  sizeType: stores.cartUiStore.itemSizeType,
  items: (stores.cartStore.cart && stores.cartStore.cart.items).slice() || []
}))
@observer
export default class CartItems extends React.Component {
  static propTypes = {
    // mobx injected
    items: PropTypes.array.isRequired,
    isVisible: PropTypes.bool,
    sizeType: PropTypes.number
  };

  get span() {
    return (this.props.isVisible && this.props.sizeType) || 0;
  }

  render() {
    return (
      <View style={this.span == 2 ? styles.containerFull : styles.container}>
        {this.props.items.map(item => (
          <CartItem
            key={`cartItem-${item.id}`}
            item={item}
            isTiny={this.span === 0}
            isSmall={this.span === 1}
            isLarge={this.span === 2}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: Sizes.InnerFrame / 2
  },

  containerFull: {
    flexDirection: "column"
  }
});
