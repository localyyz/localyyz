import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import CartItems from "./components/CartItems";
import CartSummary from "./components/CartSummary";
import CartHeader from "./components/CartHeader";
import Addresses from "./components/Addresses";
import PaymentMethods from "./components/PaymentMethods";
import {
  PULLUP_LOW_SPAN,
  PULLUP_HALF_SPAN,
  PULLUP_FULL_SPAN
} from "../NavBar/components/Pullup";
import { Assistant } from "localyyz/components";

// third party
import { inject, observer } from "mobx-react";

@inject("cartStore")
@observer
export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // cart views
      isCartItemsVisible: true,

      // data
      address: null,
      name: null
    };

    // bindings
    this.onAddressReady = this.onAddressReady.bind(this);
    this.onPaymentMethodsReady = this.onPaymentMethodsReady.bind(this);
    this.toggleCartItems = this.toggleCartItems.bind(this);
    this.onCheckout = this.onCheckout.bind(this);
    this.isReady = this.isReady.bind(this);

    // stores
    this.store = this.props.cartStore;
  }

  componentDidMount() {
    // load cart
    this.store.fetch();
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  toggleCartItems(forceShow) {
    this.setState({
      isCartItemsVisible:
        forceShow != null ? forceShow : !this.state.isCartItemsVisible
    });
  }

  onAddressReady(address, skipToggle) {
    this._mounted &&
      this.setState(
        {
          address: address,
          name: address
            ? `${address.firstName}` +
              (address.lastName ? ` ${address.lastName}` : "")
            : this.state.name
        },
        () => {
          if (address) {
            this.store.updateAddress({ address: address }).then(() => {
              // follow up with checkout
              // TODO: catch error
              this.store.checkout();
            });
          }

          // and out
          if (
            !this.store.paymentDetails.ready &&
            !skipToggle &&
            !!this.paymentMethods
          )
            this.paymentMethods.toggle(true);
        }
      );
  }

  onPaymentMethodsReady(card, skipToggle) {
    this.setState(
      {
        name: card.name
      },
      () => {
        if (card.ready && !this.state.address && !skipToggle)
          this.addresses.toggle(true);
      }
    );

    // and update the store
    card.ready && this.store.usePaymentMethod({ card: card });
  }

  onCheckout() {
    if (!this.isReady() && !this.store.isEmpty) {
      if (!this.store.shippingDetails || !this.state.address) {
        // missing address, open that
        // TODO: ref is injected, find some nicer
        // way of handling this to get the original ref
        // and since renderer is called inside pullup, refs live inside
        // of pullup
        this.addresses.toggle(true);
      } else if (this.store.hasErrors) {
        // out of stock issues
        Alert.alert(
          "Error",
          this.store.hasErrors
            ? this.store.hasErrors.charAt(0).toUpperCase() +
              this.store.hasErrors.slice(1)
            : "There was an unexpected error during the checkout process. Please try again later",
          [
            {
              text: "OK",
              onPress: () => this.toggleCartItems(true)
            }
          ]
        );
      } else {
        // payment issues, open that
        this.paymentMethods.toggle(true);
      }
    } else if (!this.store.isEmpty) {
      // good to go, process checkout via store
      // and close cart
      this.props.onCheckout &&
        this.props.onCheckout() &&
        this.props.navigation.navigate("CartSummary", {
          // static vars for when summary is completed, so when store
          // cart resets, display remains on props
          cart: this.store.cart,
          customerName: this.store.customerName,
          shippingDetails: this.store.shippingDetails,
          shippingExpectation: this.store.shippingExpectation,
          amountSubtotal: this.store.amountSubtotal,
          amountTaxes: this.store.amountTaxes,
          amountDiscount: this.store.amountDiscount,
          amountTotal: this.store.amountTotal,
          amountShipping: this.store.amountShipping,
          paymentType: this.store.paymentType,
          paymentLastFour: this.store.paymentLastFour
        });
    }
  }

  // convenience getters to manipulate inner components
  get paymentMethods() {
    return this.refs.paymentMethods;
  }

  get addresses() {
    return this.refs.addresses && this.refs.addresses.wrappedInstance;
  }

  get items() {
    return this.refs.items && this.refs.items.wrappedInstance;
  }

  isReady() {
    return (
      !!this.store.shippingDetails &&
      !!this.store.paymentDetails.ready &&
      !this.store.isEmpty &&
      !!this.state.address &&
      !this.store.hasErrors
    );
  }

  render() {
    return !this.store.isEmpty ? (
      <TouchableWithoutFeedback>
        <View>
          <CartItems
            ref="items"
            onPhotoPress={() => {
              this.props.snap && this.props.snap("high", true);
              this.toggleCartItems(true);
            }}
            onProductPress={() => this.store.toggle(false)}
            // always show items, but when "not visible, shrink items"
            getHeight={() =>
              this.state.isCartItemsVisible && this.props.getHeight
                ? this.props.getHeight()
                : PULLUP_LOW_SPAN}
            spanHeights={{
              [PULLUP_LOW_SPAN]: 0,
              [PULLUP_HALF_SPAN]: 1,
              [PULLUP_FULL_SPAN]: 2
            }}
          />
          <Addresses
            ref="addresses"
            address={this.state.address}
            defaultName={this.state.name}
            onOpenForm={() => this.props.snap && this.props.snap("high", true)}
            onOpenAddresses={() => {
              this.props.snap && this.props.snap("middle", true);
              this.toggleCartItems(false);
            }}
            onReady={this.onAddressReady}
          />
          <PaymentMethods
            ref="paymentMethods"
            defaultName={this.state.name}
            card={this.store.paymentDetails}
            onOpenPaymentMethods={() => {
              this.props.snap && this.props.snap("high", true);
              this.toggleCartItems(false);
            }}
            onReady={card => this.onPaymentMethodsReady(card, true)}
            onSubmit={() => this.onCheckout()}
          />
          <CartHeader title="Order Summary" />
          <View style={styles.alert}>
            <Text style={[Styles.Text, Styles.Terminal]}>
              {
                "You'll have a chance to review your order before it's confirmed and processed."
              }
            </Text>
          </View>
          <CartSummary />
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
  }
});
