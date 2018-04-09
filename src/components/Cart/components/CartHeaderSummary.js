import React from "react";
import {
  View, StyleSheet, Text, TouchableOpacity
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";

// custom
import {
  UppercasedText
} from "localyyz/components";

// third party
import {
  inject, observer
} from "mobx-react";
import * as Animatable from "react-native-animatable";

@inject("cartStore")
@observer
export default class CartHeaderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.cartStore;
  }

  get renderCartSummary() {
    return (
      <Text style={[
        Styles.Text, Styles.Terminal,
        styles.summaryContent]}>
        {`${this.store.numItems} items — total $${this.store.amountTotal.toFixed(2)}`}
      </Text>);
  }

  render() {
    return (
      <View style={[
        Styles.EqualColumns, Styles.EqualColumns,
        styles.cartHeader]}>
        <TouchableOpacity onPress={this.props.toggleCartItems}>
          <View style={styles.cartSummary}>
            <UppercasedText style={[
              Styles.Text, Styles.Emphasized,
              styles.summaryLabel]}>
              Cart
            </UppercasedText>
            {this.renderCartSummary}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onCheckout}
          hitSlop={{
            top: Sizes.OuterFrame, bottom: Sizes.OuterFrame, left: Sizes.OuterFrame, right: Sizes.OuterFrame
          }}>
          <Animatable.View
            animation="checkoutSlide"
            duration={500}
            delay={700}
            style={[
              styles.cartButton, {
                backgroundColor: Colours.PositiveButton}]}>
            <UppercasedText style={[
              Styles.Text, Styles.Emphasized, Styles.Alternate,
              styles.cartButtonLabel]}>
              Checkout
            </UppercasedText>
          </Animatable.View>
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

  cartButton: {
    width: 0,
    height: Sizes.InnerFrame * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.InnerFrame * 3,
    overflow: "hidden",
    backgroundColor: Colours.DisabledButton
  }
});
