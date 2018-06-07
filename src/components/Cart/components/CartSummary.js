import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

@inject((stores, props) => ({
  amountSubtotal: (stores.cartStore || props.cartStore).amountSubtotal,
  amountDiscount: (stores.cartStore || props.cartStore).amountDiscount,
  amountShipping: (stores.cartStore || props.cartStore).amountShipping,
  amountTaxes: (stores.cartStore || props.cartStore).amountTaxes,
  amountTotal: (stores.cartStore || props.cartStore).amountTotal
}))
@observer
export default class CartSummary extends React.Component {
  static propTypes = {
    color: PropTypes.string,

    // mobx injected
    amountSubtotal: PropTypes.number,
    amountDiscount: PropTypes.number,
    amountShipping: PropTypes.number,
    amountTaxes: PropTypes.number,
    amountTotal: PropTypes.number
  };

  static defaultProps = {
    amountSubtotal: 0,
    amountDiscount: 0,
    amountShipping: 0,
    amountTaxes: 0,
    amountTotal: 0
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.summaryLine}>
          <Text
            style={[
              styles.summaryLineTitle,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            Item Total
          </Text>
          <Text
            ref="subTotal"
            style={[
              styles.summaryLinePrice,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            {`$${this.props.amountSubtotal.toFixed(2)}`}
          </Text>
        </View>
        {this.props.amountDiscount > 0 && (
          <View style={styles.summaryLine}>
            <Text
              style={[
                styles.summaryLineTitle,
                this.props.color && {
                  color: this.props.color
                }
              ]}>
              Discounts
            </Text>
            <Text
              ref="discount"
              style={[
                styles.summaryLinePrice,
                styles.summaryTotal,
                this.props.color && {
                  color: this.props.color
                }
              ]}>
              {`($${this.props.amountDiscount.toFixed(2)})`}
            </Text>
          </View>
        )}
        <View style={styles.summaryLine}>
          <Text
            style={[
              styles.summaryLineTitle,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            Shipping
          </Text>
          <Text
            ref="shipping"
            style={[
              styles.summaryLinePrice,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            {this.props.amountShipping > 0
              ? `$${this.props.amountShipping.toFixed(2)}`
              : "Free"}
          </Text>
        </View>
        <View style={styles.summaryLine}>
          <Text
            style={[
              styles.summaryLineTitle,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            Taxes
          </Text>
          <Text
            ref="tax"
            style={[
              styles.summaryLinePrice,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            {`$${this.props.amountTaxes.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryLine}>
          <Text
            style={[
              styles.summaryLineTitle,
              styles.summaryTotal,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            Grand Total
          </Text>
          <Text
            ref="grandTotal"
            style={[
              styles.summaryLinePrice,
              styles.summaryTotal,
              this.props.color && {
                color: this.props.color
              }
            ]}>
            {`$${this.props.amountTotal.toFixed(2)}`}
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
    ...Styles.Text
  },

  summaryLinePrice: {
    ...Styles.Text,
    ...Styles.Terminal
  },

  summaryTotal: {
    ...Styles.Emphasized
  }
});
