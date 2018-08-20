import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

// custom
import { logo } from "localyyz/assets";
import { Colours, Sizes, Styles } from "localyyz/constants";
import {
  BaseScene,
  UppercasedText,
  ConstrainedAspectImage
} from "localyyz/components";
import { toPriceString } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import TearLines from "react-native-tear-lines";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";

// local
import Button from "../components/Button";

@inject((stores, props) => ({
  hasSession: stores.userStore.model.hasSession,
  loginWithFacebook: () => stores.loginStore.login("facebook"),

  // take passed in cached copy
  checkoutSummary: props.navigation.getParam("checkoutSummary")
}))
@observer
export default class CartSummaryScene extends React.Component {
  static propTypes = {
    checkoutSummary: PropTypes.object.isRequired,
    loginWithFacebook: PropTypes.func.isRequired,
    hasSession: PropTypes.bool
  };

  static navigationOptions = ({ navigation: { state }, navigationOptions }) => {
    const { params } = state;
    return {
      ...navigationOptions,
      gesturesEnabled: params ? !!params.gesturesEnabled : false
    };
  };

  constructor(props) {
    super(props);

    // bindings
    this.syncTearLines = this.syncTearLines.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.refuseLogin = this.refuseLogin.bind(this);
    this.onCompletion = this.onCompletion.bind(this);
  }

  syncTearLines(evt) {
    this.refs.topTearLine.onLayout(evt);
    this.refs.bottomTearLine.onLayout(evt);
  }

  onCompletion(scene, params) {
    this.props.navigation.getScreenProps().close();
    scene && this.props.navigation.getScreenProps().navigate(scene, params);
  }

  async loginWithFacebook() {
    let wasSuccessful = await this.props.loginWithFacebook();
    if (wasSuccessful) {
      this.onCompletion("Orders");
    }
  }

  loginWithEmail() {
    this.onCompletion("Login", { email: this.props.checkoutSummary.email });
  }

  refuseLogin() {
    this.onCompletion("Home");
  }

  get title() {
    return "Thank you!";
  }

  // data (parsed from cached checkoutSummary, not cartUiStore which may
  // have already been cleared)
  get customerName() {
    return this.props.checkoutSummary.customerName || "Somebody";
  }

  get shippingAddress() {
    return (
      this.props.checkoutSummary.shippingDetails.address
      + (this.props.checkoutSummary.shippingDetails.addressOpt
        ? `, ${this.props.checkoutSummary.shippingDetails.addressOpt}`
        : "")
    );
  }

  get shippingAddressRegion() {
    return (
      (this.props.checkoutSummary.shippingDetails.city
        ? `${this.props.checkoutSummary.shippingDetails.city}, `
        : "")
      + (this.props.checkoutSummary.shippingDetails.province
        || this.props.checkoutSummary.shippingDetails.region)
      + (this.props.checkoutSummary.shippingDetails.zip
        ? ` ${this.props.checkoutSummary.shippingDetails.zip}`
        : "")
    );
  }

  get shippingAddressCountry() {
    return this.props.checkoutSummary.shippingDetails.country;
  }

  get items() {
    return (
      (this.props.checkoutSummary.cart
        && this.props.checkoutSummary.cart.items
        && this.props.checkoutSummary.cart.items.length > 0
        && this.props.checkoutSummary.cart.items.slice())
      || []
    );
  }

  get merchantLogo() {
    let products = this.items.filter(
      item => item.product && item.product.place && item.product.place.imageUrl
    );

    return products.length > 0 && products[0].product.place.imageUrl;
  }

  get receipt() {
    return (
      <View style={styles.receipt}>
        <TearLines ref="topTearLine" backgroundColor={Colours.Background} />
        <View onLayout={this.syncTearLines} style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <View style={styles.logoContainer}>
              {this.merchantLogo ? (
                <ConstrainedAspectImage
                  testID="logo"
                  constrainHeight={Sizes.SquareButton}
                  constrainWidth={Sizes.SquareButton}
                  source={{ uri: this.merchantLogo }}/>
              ) : (
                <Image style={styles.logo} source={logo} />
              )}
            </View>
            <Text testID="name" style={styles.detailsText}>
              {`Shipping to ${this.customerName}`}
            </Text>
            <Text testID="shippingAddress" style={styles.detailsText}>
              {this.shippingAddress}
            </Text>
            <Text testID="shippingRegion" style={styles.detailsText}>
              {this.shippingAddressRegion}
            </Text>
            <Text testID="shippingCountry" style={styles.detailsText}>
              {this.shippingAddressCountry}
            </Text>
            <Text
              style={[
                Styles.TopSpacing,
                styles.detailsText,
                styles.detailsTitle
              ]}>
              via Standard
            </Text>
            {!!this.props.checkoutSummary.shippingExpectation && (
              <Text style={[styles.detailsText, styles.detailsTitle]}>
                {this.props.checkoutSummary.shippingExpectation.toLowerCase()}
              </Text>
            )}
          </View>
          <View style={Styles.Divider} />
          {this.items.map(item => (
            <View
              testID={`item-${item.id}`}
              key={`item-${item.id}`}
              style={styles.detailsItem}>
              <Text style={styles.detailsText}>1 x</Text>
              <View style={styles.detailsItemTitle}>
                <Text style={[styles.detailsText, styles.detailsTitle]}>
                  {item.product.title && item.product.title.toLowerCase()}
                </Text>
                <Text style={[styles.detailsText, styles.detailsOptions]}>
                  {item.variant
                    && item.variant.description
                    && item.variant.description.toLowerCase()}
                </Text>
              </View>
              <Text style={styles.detailsText}>
                {toPriceString(item.price)}
              </Text>
            </View>
          ))}
          <View style={Styles.Divider} />
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              subtotal
            </UppercasedText>
            <Text testID="subtotal" style={styles.detailsText}>
              {toPriceString(this.props.checkoutSummary.amountSubtotal)}
            </Text>
          </View>
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              taxes
            </UppercasedText>
            <Text testID="taxes" style={styles.detailsText}>
              {toPriceString(this.props.checkoutSummary.amountTaxes)}
            </Text>
          </View>
          {this.props.checkoutSummary.amountDiscount > 0 && (
            <View style={styles.detailsItem}>
              <UppercasedText
                style={[styles.detailsText, styles.detailsItemTitle]}>
                discounts
              </UppercasedText>
              <Text
                testID="discount"
                style={[styles.detailsText, styles.detailsTitle]}>
                {`(${toPriceString(
                  this.props.checkoutSummary.amountDiscount
                )})`}
              </Text>
            </View>
          )}
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              shipping
            </UppercasedText>
            <Text testID="shipping" style={styles.detailsText}>
              {toPriceString(this.props.checkoutSummary.amountShipping)}
            </Text>
          </View>
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[
                styles.detailsText,
                styles.detailsItemTitle,
                styles.detailsTitle
              ]}>
              grand total
            </UppercasedText>
            <Text
              testID="total"
              style={[styles.detailsText, styles.detailsTitle]}>
              {toPriceString(this.props.checkoutSummary.amountTotal)}
            </Text>
          </View>
          <View style={styles.chargeWrapper}>
            <View style={Styles.Divider} />
            <View style={[styles.detailsItem, styles.charge]}>
              <Text style={[styles.detailsItem, styles.chargeLabel]}>
                Payment charged to
              </Text>
              <View style={styles.chargeContainer}>
                <FontAwesomeIcon
                  name={this.props.checkoutSummary.paymentType}
                  size={Sizes.Text}
                  style={styles.paymentIcon}/>
                <Text testID="payment" style={styles.chargeValueLabel}>
                  {this.props.checkoutSummary.paymentLastFour || "XXXX"}
                </Text>
              </View>
            </View>
          </View>
          <View style={Styles.Divider} />
          <View style={[styles.logoContainer, styles.thankYou]}>
            <Text style={styles.detailsText}>Thank you!</Text>
            <Text style={Styles.Text}>🙏</Text>
          </View>
        </View>
        <TearLines
          isUnder
          ref="bottomTearLine"
          backgroundColor={Colours.Background}/>
      </View>
    );
  }

  get header() {
    return (
      <View style={styles.background}>
        <Animatable.View animation="fadeIn" duration={300} delay={300}>
          <FontAwesomeIcon
            name="check-circle"
            color={Colours.Success}
            size={Sizes.IconButton}
            style={styles.resultIcon}/>
        </Animatable.View>
        <Text style={styles.title}>{this.title}</Text>
        <Text style={styles.subtitle}>
          {
            "Your payment was processed successfully by the merchant and will be delivered out shortly.\n\nWe've also sent you an email confirmation for record keeping."
          }
        </Text>
      </View>
    );
  }

  get footer() {
    return (
      <View style={styles.overlay} pointerEvents="box-none">
        <LinearGradient
          colors={[Colours.Foreground, Colours.Foreground, Colours.Transparent]}
          start={{ y: 1, x: 0 }}
          end={{ y: 0, x: 0 }}
          style={styles.footer}
          pointerEvents="box-none">
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            delay={400}
            style={styles.footerContent}
            pointerEvents="box-none">
            {this.props.hasSession ? this.continue : this.login}
          </Animatable.View>
        </LinearGradient>
      </View>
    );
  }

  get continue() {
    return (
      <View testID="existingUser" style={styles.login}>
        <Text style={styles.footerLabel}>
          {"We've saved this order to your account"}
        </Text>
        <View style={styles.buttons}>
          <Button onPress={this.refuseLogin} style={styles.button}>
            Continue shopping
          </Button>
        </View>
      </View>
    );
  }

  get login() {
    return (
      <View testID="newUser" style={styles.login}>
        <Text style={styles.footerLabel}>
          Track the status of this order by logging in with your account
        </Text>
        <View style={styles.buttons}>
          <Button
            onPress={this.loginWithFacebook}
            style={styles.button}
            icon="facebook-square"
            backgroundColour={Colours.Facebook}>
            Facebook
          </Button>
          <Button onPress={this.loginWithEmail} style={styles.button}>
            Email
          </Button>
        </View>
        <TouchableOpacity onPress={this.refuseLogin}>
          <Text style={styles.browseLabel}>No thanks—continue browsing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <BaseScene ref="content" title={this.title} header={this.header}>
          {this.receipt}
        </BaseScene>
        {this.footer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  receipt: {
    flex: 1,
    marginVertical: Sizes.InnerFrame,
    paddingBottom: Sizes.OuterFrame * 7
  },

  background: {
    marginTop: Sizes.OuterFrame * 2,
    padding: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    marginVertical: Sizes.InnerFrame / 2
  },

  subtitle: {
    ...Styles.Text
  },

  detailsContainer: {
    marginHorizontal: Sizes.InnerFrame,
    padding: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: Sizes.OuterFrame
  },

  logo: {
    height: Sizes.SquareButton,
    width: Sizes.SquareButton
  },

  detailsText: {
    ...Styles.Text,
    ...Styles.Terminal,
    marginVertical: Sizes.InnerFrame / 4
  },

  detailsTitle: {
    ...Styles.Emphasized
  },

  detailsItem: {
    ...Styles.Horizontal,
    alignItems: "flex-start",
    marginVertical: Sizes.InnerFrame / 4
  },

  detailsItemTitle: {
    flex: 1,
    marginHorizontal: Sizes.InnerFrame
  },

  thankYou: {
    marginTop: Sizes.OuterFrame
  },

  paymentIcon: {
    marginTop: 2
  },

  chargeWrapper: {},

  chargeContainer: {
    ...Styles.Horizontal
  },

  chargeLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    flex: 1
  },

  chargeValueLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Terminal,
    marginLeft: Sizes.InnerFrame / 2
  },

  overlay: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  },

  footer: {
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame * 5,
    paddingBottom: Sizes.ScreenBottom + Sizes.InnerFrame
  },

  footerContent: {
    alignItems: "center"
  },

  footerLabel: {
    ...Styles.Text,
    textAlign: "center",
    marginHorizontal: Sizes.OuterFrame,
    marginBottom: Sizes.InnerFrame / 2
  },

  buttons: {
    ...Styles.Horizontal,
    marginVertical: Sizes.InnerFrame / 2,
    marginHorizontal: Sizes.InnerFrame
  },

  button: {
    marginHorizontal: Sizes.InnerFrame / 4
  },

  login: {
    alignItems: "center"
  },

  browseLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  }
});
