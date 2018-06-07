import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

@inject((stores, props) => ({
  numItems: (stores.cartStore || props.cartStore).numItems,
  amountTotal: (stores.cartStore || props.cartStore).amountTotal,
  toggleItems: () => (stores.cartUiStore || props.cartUiStore).toggleItems()
}))
@observer
export default class CartHeaderSummary extends React.Component {
  static propTypes = {
    // mobx injected
    numItems: PropTypes.number.isRequired,
    amountTotal: PropTypes.number.isRequired,
    toggleItems: PropTypes.func.isRequired
  };

  get renderCartSummary() {
    return (
      <Text style={styles.content}>
        {`${
          this.props.numItems
        } items — total $${this.props.amountTotal.toFixed(2)}`}
      </Text>
    );
  }

  // TODO: hitSlop on android is NOT working as intended.
  render() {
    return (
      <View
        pointerEvents="auto"
        style={[Styles.EqualColumns, styles.cartHeader]}>
        <TouchableOpacity onPress={this.props.toggleItems}>
          <View style={styles.cartSummary} ref="cart">
            <Text style={styles.title}>Cart</Text>
            {this.renderCartSummary}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cartHeader: {
    alignItems: "center",
    padding: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Title
  },

  content: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  }
});
