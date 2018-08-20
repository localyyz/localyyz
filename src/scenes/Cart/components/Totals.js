import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Styles } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";

@inject(stores => ({
  totalPrice:
    stores.cartStore.totalPriceDollars || stores.cartStore.subtotalPriceDollars,
  totalDiscount:
    stores.cartStore.totalDiscountDollars
    || stores.cartStore.subtotalDiscountDollars
}))
@observer
export default class Totals extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={[styles.label, this.props.textStyle]}>Total</Text>
          <Text
            testID="price"
            style={[styles.label, styles.value, this.props.textStyle]}>
            {toPriceString(this.props.totalPrice, null, true)}
          </Text>
        </View>
        {this.props.totalDiscount > 0 ? (
          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                styles.value,
                styles.highlighted,
                this.props.textStyle
              ]}>
              You saved
            </Text>
            <Text
              testID="discount"
              style={[
                styles.label,
                styles.value,
                styles.highlighted,
                this.props.textStyle
              ]}>
              {toPriceString(this.props.totalDiscount, null, true)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  row: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  value: {
    textAlign: "right"
  },

  highlighted: {
    color: Colours.Accented
  }
});
