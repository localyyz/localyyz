import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import CartAction from "./components/CartAction";
import CartItems from "./components/CartItems";
import CartSummary from "./components/CartSummary";
import CartHeader from "./components/CartHeader";
import Addresses from "./components/Addresses";
import PaymentMethods from "./components/PaymentMethods";
import { Assistant } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

@inject(stores => ({
  // ui
  isEmpty: stores.cartStore.isEmpty,

  // methods
  fetch: () => stores.cartStore.fetch(),
  // data
  shippingDetails: stores.cartStore.shippingDetails,
  billingDetails: stores.cartStore.billingDetails,
  payingDetails: stores.cartStore.paymentDetails
}))
@observer
export default class Cart extends React.Component {
  static propTypes = {
    shippingDetails: PropTypes.object,
    billingDetails: PropTypes.object,

    // mobx injected
    fetch: PropTypes.func.isRequired,
    isEmpty: PropTypes.bool
  };

  static defaultProps = {
    isEmpty: true
  };

  componentDidMount() {
    // load cart
    this.props.fetch();
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return !this.props.isEmpty ? (
      <TouchableWithoutFeedback>
        <View>
          <CartItems />
          <Addresses title="Shipping to" address={this.props.shippingDetails} />
          <PaymentMethods />
          <Addresses
            title="Billing address"
            address={this.props.billingDetails}/>
          <CartHeader title="Order Summary" />
          <View style={[styles.content, styles.end]}>
            <View style={styles.alert}>
              <Text style={Styles.Text}>
                {
                  "You'll have a chance to review your order before it's confirmed and processed."
                }
              </Text>
            </View>
            <CartSummary />
            <CartAction />
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <View style={styles.assistant}>
        <Assistant
          typeSpeed={50}
          messages={["There's nothing in your cart right now."]}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: Colours.Alert,
    padding: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame
  },

  assistant: {
    paddingHorizontal: Sizes.InnerFrame
  },

  content: {
    paddingVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  end: {
    paddingBottom: Sizes.OuterFrame
  }
});
