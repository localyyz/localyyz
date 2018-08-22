import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";
import { ExplodingButton } from "localyyz/components";

// local
import Button from "../../components/Button";

@inject(stores => ({
  subtotal: stores.cartStore.subtotalPriceDollars,
  shipping: stores.cartStore.totalShippingDollars,
  taxes: stores.cartStore.totalTaxDollars,

  // totals
  totalPrice:
    stores.cartStore.totalPriceDollars || stores.cartStore.subtotalPriceDollars,
  totalDiscount: stores.cartStore.subtotalDiscountDollars,
  totalCoupon: stores.cartStore.totalDiscountDollars,

  // exploder
  isProcessing: stores.confirmationUiStore.isProcessing,
  toggleProcessing: stores.confirmationUiStore.toggleProcessing,

  // errors
  setCheckoutError: stores.confirmationUiStore.setCheckoutError,
  setPaymentError: stores.confirmationUiStore.setPaymentError,

  // cart
  setNextReady: stores.cartUiStore.setNextReady,
  nextSceneIsReady: stores.cartUiStore.nextSceneIsReady,

  // checkout
  completeCheckout: stores.cartUiStore.completeCheckout,
  completePayment: stores.cartUiStore.completePayment,
  checkoutSummary: stores.cartUiStore.checkoutSummary,
  clearCart: stores.cartStore.clear
}))
@observer
export default class Footer extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    toggleProcessing: PropTypes.func,
    subtotal: PropTypes.number,
    shipping: PropTypes.number,
    taxes: PropTypes.number,
    isProcessing: PropTypes.bool
  };

  static defaultProps = {
    toggleProcessing: () => {},
    isProcessing: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.onExplode = this.onExplode.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  async onExplode() {
    this.props.toggleProcessing(true);
  }

  async onNext() {
    // wrap to disable button while processing and unset when done, used
    // as the onPress for exploding button
    this.props.setNextReady(false);
    await this.onComplete();
    this.props.setNextReady(true);
  }

  async onComplete() {
    let paymentResponse;
    let checkoutResponse = await this.props.completeCheckout();

    // checkout error handling
    if (!checkoutResponse.error) {
      paymentResponse = await this.props.completePayment();
    } else {
      this.props.setCheckoutError(checkoutResponse.error);
    }

    // toggle off exploder
    this.props.toggleProcessing(false);

    // payment error handling
    if (paymentResponse) {
      if (!paymentResponse.error) {
        let checkoutSummary = { ...this.props.checkoutSummary };
        this.props.clearCart();

        // and finally navigate to summary scene with cached cart details
        this.props.navigation.navigate("SummaryScene", {
          checkoutSummary: checkoutSummary
        });
      } else {
        this.props.setPaymentError(paymentResponse.error);
      }
    }
  }

  renderRow(label, value, showFree = true, style) {
    return showFree || value > 0 ? (
      <View style={styles.row}>
        <Text style={[styles.label, style]}>{label}</Text>
        <Text testID={label} style={[styles.label, style]}>
          {toPriceString(value)}
        </Text>
      </View>
    ) : null;
  }

  get touchableComponent() {
    return this.props.nextSceneIsReady ? ExplodingButton : View;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderRow("Subtotal", this.props.subtotal)}
        {this.renderRow("Shipping", this.props.shipping)}
        {this.renderRow("Taxes", this.props.taxes, false)}
        {this.renderRow(
          "Total",
          this.props.totalPrice,
          undefined,
          styles.total
        )}
        {this.renderRow(
          "You saved",
          this.props.totalDiscount,
          false,
          styles.saved
        )}
        {this.renderRow(
          "Extra coupon savings",
          this.props.totalCoupon,
          false,
          styles.saved
        )}
        {!this.props.isTesting ? (
          <this.touchableComponent
            color={Colours.PositiveButton}
            isExploded={this.props.isProcessing}
            explode={this.onExplode}
            onPress={this.onNext}
            style={styles.buttonWrapper}>
            <Button backgroundColour={Colours.Accented} style={styles.button}>
              Confirm & pay
            </Button>
          </this.touchableComponent>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame,
    paddingBottom: Sizes.ScreenBottom + Sizes.InnerFrame
  },

  row: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginVertical: Sizes.InnerFrame / 8
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  total: {
    ...Styles.Emphasized,
    fontSize: Sizes.H3
  },

  saved: {
    ...Styles.Emphasized,
    fontSize: Sizes.H3,
    color: Colours.Accented
  },

  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },

  button: {
    marginTop: Sizes.InnerFrame
  }
});
