import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

// custom
import { logo } from "localyyz/assets";
import { Colours, Sizes, Styles } from "localyyz/constants";
import {
  BaseScene,
  UppercasedText,
  ExplodingButton,
  ConstrainedAspectImage
} from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import TearLines from "react-native-tear-lines";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { ifIphoneX } from "react-native-iphone-x-helper";

// TODO: inject via cart ui store?
@inject(stores => ({
  hideNavbar: () => stores.navbarStore.hide(),
  showNavbar: () => stores.navbarStore.show(),
  onShowSummary: () => stores.expressCartStore.onShowSummary(),
  amountDiscount: stores.cartStore.amountDiscount,
  paymentLastFour: stores.cartStore.paymentLastFour,
  hasSession: stores.userStore.hasSession,
  loginWithFacebook: () => stores.loginStore.login("facebook")
}))
@observer
export default class CartSummaryScene extends React.Component {
  static propTypes = {
    hideNavbar: PropTypes.func.isRequired,
    showNavbar: PropTypes.func.isRequired,
    onShowSummary: PropTypes.func.isRequired,
    amountDiscount: PropTypes.number,
    paymentLastFour: PropTypes.string
  };

  static defaultProps = {
    amountDiscount: 0,
    paymentLastFour: "0000"
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
    this.settings
      = (props.navigation
        && props.navigation.state
        && props.navigation.state.params)
      || {};
    this.state = {
      backgroundPosition: 0,
      isProcessing: false,
      wasSuccessful: this.settings.wasSuccessful
    };

    // bindings
    this.onBack = this.onBack.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.clearExploder = this.clearExploder.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.onCompletion = this.onCompletion.bind(this);
  }

  componentWillReceiveProps(next) {
    let nextSettings
      = (next.navigation
        && next.navigation.state
        && next.navigation.state.params)
      || {};
    if (
      nextSettings.wasSuccessful !== this.state.wasSuccessful
      && nextSettings.wasSuccessful !== this.settings.wasSuccessful
    ) {
      this.setState({
        wasSuccessful: nextSettings.wasSuccessful
      });
    }
  }

  componentWillMount() {
    this.props.hideNavbar();
  }

  componentDidMount() {
    this.props.onShowSummary();
  }

  onBack(showCart) {
    this.props.showNavbar();

    // and show the cart if coming back from cancelling
    this.props.navigation.goBack();
  }

  clearExploder(wasSuccessful) {
    this.setState(
      {
        // change to true to demo success page
        wasSuccessful: wasSuccessful,
        isProcessing: false
      },
      () => {
        this.contentRef && this.contentRef.scrollTo(0);
      }
    );
  }

  onConfirm() {
    // NOTE: this is deprecated.
    // this componenent is NOT used for cart completion anymore.
  }

  get contentRef() {
    return this.refs.content;
  }

  get renderDetails() {
    return (
      <Animatable.View animation="slideInUp" duration={300}>
        <TearLines
          ref="topTearLine"
          backgroundColor={Colours.Background}
          style={{
            marginTop: this.state.backgroundPosition + Sizes.OuterFrame
          }}/>
        <View
          onLayout={e => {
            this.refs.topTearLine.onLayout(e);
            this.refs.bottomTearLine.onLayout(e);
          }}
          style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <View style={styles.logoContainer}>
              {this.merchantLogo ? (
                <ConstrainedAspectImage
                  constrainHeight={Sizes.SquareButton}
                  constrainWidth={Sizes.SquareButton}
                  source={{ uri: this.merchantLogo }}/>
              ) : (
                <Image style={styles.logo} source={logo} />
              )}
            </View>
            <Text style={styles.detailsText}>
              {`Shipping to ${this.settings.customerName || "Somebody"}`}
            </Text>
            <Text style={styles.detailsText}>
              {this.settings.shippingDetails.address
                + (this.settings.shippingDetails.addressOpt
                  ? `, ${this.settings.shippingDetails.addressOpt}`
                  : "")}
            </Text>
            <Text style={styles.detailsText}>
              {(this.settings.shippingDetails.city
                ? `${this.settings.shippingDetails.city}, `
                : "") + this.settings.shippingDetails.province
                || this.settings.shippingDetails.region
                  + (this.settings.shippingDetails.zip
                    ? ` ${this.settings.shippingDetails.zip}`
                    : "")}
            </Text>
            <Text style={styles.detailsText}>
              {this.settings.shippingDetails.country}
            </Text>
            <Text
              style={[
                Styles.TopSpacing,
                styles.detailsText,
                styles.detailsTitle
              ]}>
              via Standard
            </Text>
            {!!this.settings.shippingExpectation && (
              <Text style={[styles.detailsText, styles.detailsTitle]}>
                {this.settings.shippingExpectation.toLowerCase()}
              </Text>
            )}
          </View>
          <View style={Styles.Divider} />
          {this.settings.cart
            && this.settings.cart.items
            && this.settings.cart.items.length > 0
            && this.settings.cart.items.slice().map(item => (
              <View key={`item-${item.id}`} style={styles.detailsItem}>
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
                  {`$${item.price.toFixed(2)}`}
                </Text>
              </View>
            ))}
          <View style={Styles.Divider} />
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              subtotal
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.settings.amountSubtotal.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              taxes
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.settings.amountTaxes.toFixed(2)}`}
            </Text>
          </View>
          {this.props.amountDiscount > 0 && (
            <View style={styles.detailsItem}>
              <UppercasedText
                style={[styles.detailsText, styles.detailsItemTitle]}>
                discounts
              </UppercasedText>
              <Text style={[styles.detailsText, styles.detailsTitle]}>
                {`($${this.settings.amountDiscount.toFixed(2)})`}
              </Text>
            </View>
          )}
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}>
              shipping
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.settings.amountShipping.toFixed(2)}`}
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
            <Text style={[styles.detailsText, styles.detailsTitle]}>
              {`$${this.settings.amountTotal.toFixed(2)}`}
            </Text>
          </View>
          {this.settings.shippingDetails.address
          !== this.settings.billingDetails.address ? (
            <View style={styles.chargeWrapper}>
              <View style={Styles.Divider} />
              <View style={[styles.detailsItem, styles.charge]}>
                <Text style={[styles.detailsItem, styles.chargeLabel]}>
                  Charge to
                </Text>
                <View style={styles.chargeContainer}>
                  <FontAwesomeIcon
                    name={this.settings.paymentType}
                    size={Sizes.OuterFrame}
                    style={styles.paymentIcon}/>
                  <Text style={styles.chargeValueLabel}>
                    {`ending in ${this.settings.paymentLastFour}`}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsText}>
                  {this.settings.billingDetails.address
                    + (this.settings.billingDetails.addressOpt
                      ? `, ${this.settings.billingDetails.addressOpt}`
                      : "")}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={[styles.logoContainer, styles.thankYou]}>
            <Text style={styles.detailsText}>Thank you!</Text>
            <Text style={Styles.Text}>🙏</Text>
          </View>
        </View>
        <TearLines
          isUnder
          ref="bottomTearLine"
          backgroundColor={Colours.Background}
          style={{ marginBottom: Sizes.OuterFrame * 2 }}/>
      </Animatable.View>
    );
  }

  get paymentHeaderLabel() {
    return this.state.wasSuccessful
      ? this.props.hasSession
        ? "We've saved this receipt to your account for order tracking"
        : "Track the status of this order by logging in with your account"
      : `On order confirmation, $${this.settings.amountTotal.toFixed(
          2
        )} will be charged to`;
  }

  async loginWithFacebook() {
    let wasSuccessful = await this.props.loginWithFacebook();
    if (wasSuccessful) {
      this.onCompletion("Orders");
    }
  }

  loginWithEmail() {
    this.onCompletion("Login");
  }

  onCompletion(scene) {
    // <- TODO: NOTE: is this correct?
    this.onBack();
    this.props.navigation.navigate(scene);
  }

  get renderSummaryLogin() {
    return (
      <View style={styles.login}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.loginWithFacebook}>
            <View style={[styles.button, styles.socialButton]}>
              <FontAwesomeIcon
                name="facebook-square"
                color={Colours.AlternateText}
                size={Sizes.Text}/>
              <Text style={[styles.buttonLabel, styles.socialButtonLabel]}>
                Login
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.loginWithEmail}>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>Email</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.onBack()}>
          <Text style={styles.skipLoginButtonLabel}>
            No thanks—continue browsing
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  get renderSummaryComplete() {
    return (
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => this.onBack()}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Continue browsing</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  get renderSummaryPayment() {
    return (
      <View style={styles.paymentContainer}>
        <FontAwesomeIcon
          name={this.settings.paymentType}
          size={Sizes.OuterFrame}
          color={Colours.AlternateText}
          style={styles.paymentIcon}/>
        <Text style={styles.paymentLabel}>
          {`xxxx xxxx xxxx ${this.settings.paymentLastFour}`}
        </Text>
        <ExplodingButton
          color={Colours.PositiveButton}
          isExploded={this.state.isProcessing}
          explode={async () =>
            this.setState({
              isProcessing: true
            })
          }
          onPress={this.onConfirm}>
          <View style={styles.button}>
            <UppercasedText style={styles.buttonLabel}>
              Confirm Payment
            </UppercasedText>
          </View>
        </ExplodingButton>
      </View>
    );
  }

  get renderSummary() {
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.confirmContainer}>
          <Animatable.View animation="fadeInRight" duration={300} delay={200}>
            <Text style={styles.paymentHeader}>{this.paymentHeaderLabel}</Text>
          </Animatable.View>
          <Animatable.View
            animation="fadeInRight"
            duration={300}
            delay={500}
            style={styles.summaryActions}>
            {this.state.wasSuccessful
              ? this.props.hasSession
                ? this.renderSummaryComplete
                : this.renderSummaryLogin
              : this.renderSummaryPayment}
          </Animatable.View>
        </View>
      </View>
    );
  }

  get renderOverlay() {
    return (
      <Animatable.View
        animation="fadeInUp"
        duration={300}
        delay={300}
        style={styles.overlay}>
        <View style={styles.overlayText}>
          <Text style={styles.overlayTitle}>Just a minute</Text>
          <Text style={styles.overlaySubtitle}>
            {"We're trying to process your payment right now"}
          </Text>
        </View>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          duration={200}
          iterationCount="infinite">
          <Text style={styles.overlayIcon}>💸</Text>
        </Animatable.View>
      </Animatable.View>
    );
  }

  get merchantLogo() {
    let products = (this.settings.cart
    && this.settings.cart.items
    && this.settings.cart.items.length > 0
      ? this.settings.cart.items
      : []
    ).filter(
      item => item.product && item.product.place && item.product.place.imageUrl
    );

    return products.length > 0 && products[0].product.place.imageUrl;
  }

  get header() {
    return (
      <View style={styles.background}>
        {this.state.wasSuccessful != null && (
          <View style={styles.resultIconContainer}>
            <Animatable.View animation="bounce" duration={300} delay={300}>
              <FontAwesomeIcon
                name={
                  this.state.wasSuccessful ? "check-circle" : "times-circle"
                }
                color={
                  this.state.wasSuccessful ? Colours.Success : Colours.Fail
                }
                size={Sizes.Avatar}
                style={styles.resultIcon}/>
            </Animatable.View>
          </View>
        )}
        <Text style={styles.title}>
          {this.state.wasSuccessful != null
            ? this.state.wasSuccessful ? "Thank you!" : "Something went wrong"
            : "Lets confirm your order"}
        </Text>
        <Text style={styles.subtitle}>
          {this.state.wasSuccessful != null
            ? this.state.wasSuccessful
              ? "Your payment was processed successfully by the merchant and will be delivered out shortly. We've also sent you an email confirmation for record keeping."
              : `We couldn't process your selected payment method ending in ${
                  this.props.paymentLastFour
                }. Please either try again, or go back and use a different payment method.`
            : "Your order will be immediately dispatched to the merchant for processing as soon as this screen is confirmed by you."}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <BaseScene
          ref="content"
          title="Purchase confirmation"
          iconType="close"
          backAction={
            this.state.wasSuccessful ? false : () => this.onBack(true)
          }
          header={this.header}>
          {this.renderDetails}
        </BaseScene>
        <View pointerEvents="box-none" style={styles.details}>
          <LinearGradient
            pointerEvents="none"
            colors={[Colours.Background, Colours.Transparent]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}/>
          {this.renderSummary}
        </View>
        {this.state.isProcessing && this.renderOverlay}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  details: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  },

  gradient: {
    width: Sizes.Width,
    height: Sizes.OuterFrame * 2
  },

  background: {
    marginTop: Sizes.Height / 6,
    marginLeft: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  },

  resultIconContainer: {
    marginBottom: Sizes.InnerFrame,
    marginLeft: Sizes.OuterFrame
  },

  detailsContainer: {
    marginHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.OuterFrame * 2,
    paddingHorizontal: Sizes.OuterFrame + Sizes.InnerFrame,
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
    marginVertical: Sizes.InnerFrame / 2
  },

  detailsItemTitle: {
    flex: 1,
    marginHorizontal: Sizes.InnerFrame
  },

  thankYou: {
    marginTop: Sizes.OuterFrame
  },

  summaryContainer: {
    paddingVertical: Sizes.OuterFrame,
    backgroundColor: Colours.MenuBackground,
    ...ifIphoneX({
      paddingBottom: Sizes.OuterFrame + Sizes.InnerFrame
    })
  },

  confirmContainer: {
    alignItems: "center",
    paddingHorizontal: Sizes.OuterFrame
  },

  paymentIcon: {
    marginTop: 2
  },

  paymentHeader: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginBottom: Sizes.InnerFrame / 2
  },

  paymentContainer: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  },

  paymentLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate,
    marginHorizontal: Sizes.InnerFrame
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

  buttons: {
    ...Styles.Horizontal,
    justifyContent: "center",
    flexWrap: "wrap"
  },

  button: {
    ...Styles.RoundedButton,
    marginHorizontal: Sizes.InnerFrame / 3,
    marginVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  socialButton: {
    backgroundColor: Colours.Facebook
  },

  socialButtonLabel: {
    ...Styles.Alternate,
    marginLeft: Sizes.InnerFrame / 2
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.Primary
  },

  overlayText: {
    marginHorizontal: Sizes.OuterFrame * 3
  },

  overlayTitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Oversized,
    ...Styles.Alternate
  },

  overlaySubtitle: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 3
  },

  overlayIcon: {
    fontSize: Sizes.Oversized * 2
  },

  summaryActions: {
    marginVertical: Sizes.InnerFrame
  },

  login: {
    alignItems: "center",
    marginHorizontal: Sizes.OuterFrame
  },

  skipLoginButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.TinyText,
    ...Styles.Alternate,
    marginTop: Sizes.InnerFrame / 2
  }
});
