import React from "react";
import {
  View, StyleSheet, Text, TextInput, TouchableOpacity
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";

// third party
import {
  inject, observer
} from "mobx-react";

@inject("cartStore")
@observer
export default class CartSummary extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.summaryLine}>
          <Text style={[styles.summaryLineTitle, this.props.color && {
            color: this.props.color}]}>
            Item Total
          </Text>
          <Text style={[styles.summaryLinePrice, this.props.color && {
            color: this.props.color}]}>
            {`$${this.props.cartStore.amountSubtotal.toFixed(2)}`}
          </Text>
        </View>
        {this.props.cartStore.amountDiscount > 0 && (
          <View style={styles.summaryLine}>
            <Text style={[styles.summaryLineTitle, this.props.color && {
              color: this.props.color}]}>
              Discounts
            </Text>
            <Text style={[styles.summaryLinePrice, styles.summaryTotal, this.props.color && {
              color: this.props.color}]}>
              {`($${this.props.cartStore.amountDiscount.toFixed(2)})`}
            </Text>
          </View>)}
        {this.props.cartStore.amountShipping > 0 && (
          <View style={styles.summaryLine}>
            <Text style={[styles.summaryLineTitle, this.props.color && {
              color: this.props.color}]}>
              Shipping
            </Text>
            <Text style={[styles.summaryLinePrice, this.props.color && {
              color: this.props.color}]}>
              {`$${this.props.cartStore.amountShipping.toFixed(2)}`}
            </Text>
          </View>)}
        <View style={styles.summaryLine}>
          <Text style={[styles.summaryLineTitle, this.props.color && {
            color: this.props.color}]}>
            Taxes
          </Text>
          <Text style={[styles.summaryLinePrice, this.props.color && {
            color: this.props.color}]}>
            {`$${this.props.cartStore.amountTaxes.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryLine}>
          <Text style={[styles.summaryLineTitle, styles.summaryTotal, this.props.color && {
            color: this.props.color}]}>
            Grand Total
          </Text>
          <Text style={[styles.summaryLinePrice, styles.summaryTotal, this.props.color && {
            color: this.props.color}]}>
            {`$${this.props.cartStore.amountTotal.toFixed(2)}`}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  summaryLine: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  summaryLineTitle: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  summaryLinePrice: {
    ...Styles.Text,
    ...Styles.Terminal
  },

  summaryTotal: {
    ...Styles.Emphasized
  }
});
