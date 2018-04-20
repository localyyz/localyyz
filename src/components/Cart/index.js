import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
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
  isAddressVisible: stores.cartUiStore.isAddressVisible,
  isBillingVisible: stores.cartUiStore.isBillingVisible,

  // methods
  fetch: () => stores.cartStore.fetch(),
  toggleAddress: visible => stores.cartUiStore.toggleAddress(visible),
  toggleBilling: visible => stores.cartUiStore.toggleBilling(visible),
  updateAddress: (address, billing) =>
    stores.cartStore.updateAddress({
      address: address,
      billingAddress: billing
    }),

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
    toggleAddress: PropTypes.func.isRequired,
    toggleBilling: PropTypes.func.isRequired,
    updateAddress: PropTypes.func.isRequired,
    isEmpty: PropTypes.bool,
    isAddressVisible: PropTypes.bool,
    isBillingVisible: PropTypes.bool
  };

  static defaultProps = {
    isEmpty: true,
    isAddressVisible: false,
    isBillingVisible: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.onAddressUpdate = this.onAddressUpdate.bind(this);
    this.onBillingUpdate = this.onBillingUpdate.bind(this);
  }

  componentDidMount() {
    // load cart
    this.props.fetch();
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onAddressUpdate(address) {
    this.props.updateAddress(address);
  }

  onBillingUpdate(address) {
    this.props.updateAddress(null, address);
  }

  render() {
    return !this.props.isEmpty ? (
      <TouchableWithoutFeedback>
        <View>
          <CartItems />
          <Addresses
            isVisible={this.props.isAddressVisible}
            toggle={this.props.toggleAddress}
            address={this.props.shippingDetails}
            onReady={this.onAddressUpdate}
          />
          <PaymentMethods />
          <Addresses
            title="Billing address"
            isVisible={this.props.isBillingVisible}
            toggle={this.props.toggleBilling}
            address={this.props.billingDetails}
            onReady={this.onBillingUpdate}
          />
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <View style={styles.assistant}>
        <Assistant
          typeSpeed={50}
          messages={["There's nothing in your cart right now."]}
        />
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
