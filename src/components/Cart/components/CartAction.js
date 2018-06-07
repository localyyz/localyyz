import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity
} from "react-native";
import { Sizes, Colours, Styles } from "localyyz/constants";
//
// custom
import { UppercasedText, SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

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

@inject((stores, props) => ({
  checkoutWithReject: () =>
    (props.cartStore || stores.cartStore).checkoutWithReject(),
  validate: () => (props.cartUiStore || stores.cartUiStore).validate(),
  getCheckoutSummary: () =>
    (props.cartUiStore || stores.cartUiStore).getCheckoutSummary()
}))
@observer
export class CartAction extends React.Component {
  static propTypes = {
    // mobx injected
    checkoutWithReject: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    getCheckoutSummary: PropTypes.func.isRequired
  };

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

  render() {
    return (
      <View style={{ flex: 1, padding: 25, alignSelf: "center" }}>
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

export default withNavigation(CartAction);

const styles = StyleSheet.create({
  cartButton: {
    width: Sizes.InnerFrame,
    height: Sizes.InnerFrame * 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.InnerFrame * 3,
    overflow: "hidden",
    backgroundColor: Colours.DisabledButton
  }
});
