import React from "react";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import { UppercasedText, SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react";
import * as Animatable from "react-native-animatable";

// custom animation
Animatable.initializeRegistryWithDefinitions({
  checkoutSlide: {
    from: {
      width: 0
    },
    to: {
      width: 130
    }
  }
});

@withNavigation
@inject(stores => ({
  numItems: stores.cartStore.numItems,
  amountTotal: stores.cartStore.amountTotal,
  checkoutWithReject: () => stores.cartStore.checkoutWithReject(),
  toggleItems: () => stores.cartUiStore.toggleItems(),
  validate: () => stores.cartUiStore.validate(),
  getCheckoutSummary: () => stores.cartUiStore.getCheckoutSummary()
}))
@observer
export default class CartHeaderSummary extends React.Component {
  static propTypes = {
    navigation: PropTypes.any.isRequired,

    // mobx injected
    checkoutWithReject: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,

    numItems: PropTypes.number.isRequired,
    amountTotal: PropTypes.number.isRequired,
    toggleItems: PropTypes.func.isRequired,
    getCheckoutSummary: PropTypes.func.isRequired
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

  onCheckout = async () => {
    try {
      // client side checkout validation, throws error if needed
      this.props.validate();
      // server side checkout initiation throws response error
      //  will throw error if server returns validation errors
      await this.props.checkoutWithReject();

      // success
      this.props.navigation.navigate(
        "CartSummary",
        this.props.getCheckoutSummary()
      );
    } catch (err) {
      const alertButtons = err.alertButtons || [{ text: "OK" }];
      err.alertTitle
        && err.alertMessage
        && Alert.alert(err.alertTitle, err.alertMessage, alertButtons);
    }
  };

  // TODO: hitSlop on android is NOT working as intended.
  render() {
    return (
      <View
        pointerEvents="auto"
        style={[Styles.EqualColumns, styles.cartHeader]}>
        <TouchableOpacity onPress={this.props.toggleItems}>
          <View style={styles.cartSummary}>
            <Text style={styles.title}>Cart</Text>
            {this.renderCartSummary}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onCheckout}>
          {Platform.OS === "ios" ? (
            <SloppyView>
              <Animatable.View
                animation="checkoutSlide"
                duration={500}
                delay={700}
                style={[
                  styles.cartButton,
                  {
                    backgroundColor: Colours.PositiveButton
                  }
                ]}>
                <UppercasedText
                  style={[
                    Styles.Text,
                    Styles.Emphasized,
                    Styles.Alternate,
                    styles.cartButtonLabel
                  ]}>
                  Checkout
                </UppercasedText>
              </Animatable.View>
            </SloppyView>
          ) : (
            <Animatable.View
              animation="checkoutSlide"
              duration={500}
              delay={700}
              style={[
                styles.cartButton,
                {
                  backgroundColor: Colours.PositiveButton
                }
              ]}>
              <UppercasedText
                style={[
                  Styles.Text,
                  Styles.Emphasized,
                  Styles.Alternate,
                  styles.cartButtonLabel
                ]}>
                Checkout
              </UppercasedText>
            </Animatable.View>
          )}
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
