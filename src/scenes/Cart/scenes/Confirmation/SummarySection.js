import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Forms } from "localyyz/components";

@inject(stores => ({
  // details
  email: stores.cartStore.email,
  shippingAddress: stores.cartStore.shippingAddress,
  numCartItems: stores.cartStore.numCartItems,

  // payment
  payment: stores.cartUiStore.paymentLastFour,
  paymentType: stores.cartUiStore.paymentType,

  // errors
  checkoutError: stores.confirmationUiStore.checkoutError,
  paymentError: stores.confirmationUiStore.paymentError
}))
@observer
export default class SummarySection extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.updateEmail = this.updateEmail.bind(this);
    this.updateShipping = this.updateShipping.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
  }

  updateEmail() {
    return this.props.navigation.navigate("EmailScene");
  }

  updateShipping() {
    this.setState(
      {
        checkoutError: null
      },
      () => this.props.navigation.navigate("ShippingScene")
    );
  }

  updatePayment() {
    this.setState(
      {
        paymentError: null
      },
      () => this.props.navigation.navigate("PaymentScene")
    );
  }

  render() {
    return (
      <View style={styles.details}>
        <Forms.BaseField label="Emailing receipt to" onPress={this.updateEmail}>
          <Text testID="emailValue" numberOfLines={1} style={styles.detail}>
            {this.props.email}
          </Text>
        </Forms.BaseField>
        <Forms.BaseField
          label="Shipping to"
          hasError={
            !!this.props.checkoutError || !!this.props.shippingAddress.hasError
          }
          error={this.props.checkoutError || this.props.shippingAddress.error}
          onPress={this.updateShipping}>
          <Text testID="shippingValue" numberOfLines={1} style={styles.detail}>
            {(this.props.shippingAddress
              && this.props.shippingAddress.address)
              || ""}
          </Text>
        </Forms.BaseField>
        <Forms.BaseField
          label="Payment via"
          hasError={!!this.props.paymentError}
          error={this.props.paymentError}
          onPress={this.updatePayment}>
          <FontAwesomeIcon
            name={this.props.paymentType}
            size={Sizes.Text}
            color={Colours.Text}
            style={styles.paymentIcon}/>
          <Text testID="paymentValue" numberOfLines={1} style={styles.detail}>
            {`Ending in ${this.props.payment}`}
          </Text>
        </Forms.BaseField>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    marginVertical: Sizes.InnerFrame / 2,
    marginHorizontal: Sizes.InnerFrame
  },

  detail: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  },

  paymentIcon: {
    marginRight: Sizes.InnerFrame / 2
  }
});
