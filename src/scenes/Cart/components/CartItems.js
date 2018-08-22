import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Sizes } from "localyyz/constants";
import CartItem from "./CartItem";

// third party
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

@inject(stores => ({
  items: stores.cartUiStore.cart.cartItems.slice()
}))
@observer
export default class CartItems extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    onRemove: PropTypes.func,
    onProductPress: PropTypes.func,
    navigation: PropTypes.object.isRequired
  };

  static defaultProps = {
    items: []
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    return (
      <View testID={`${item.id}`} style={styles.container}>
        <CartItem
          {...this.props}
          item={item}
          onPress={this.props.onProductPress}
          onRemove={this.props.onRemove}
          style={this.props.itemStyle}/>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.items}
        renderItem={this.renderItem}
        keyExtractor={(e, i) => `cartItem-${e.cartId}-${e.id}-${i}`}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
