import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

// custom
import { logo } from "localyyz/assets";
import { Colours, Sizes, Styles } from "localyyz/constants";
import {
  ContentCoverSlider,
  UppercasedText,
  ExplodingButton
} from "localyyz/components";

// third party
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import TearLines from "react-native-tear-lines";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { ifIphoneX } from "react-native-iphone-x-helper";

@inject("cartStore")
@observer
export default class CartSummaryScene extends React.Component {
  static navigationOptions = ({ navigation: { state }, navigationOptions }) => {
    const { params } = state;
    return {
      ...navigationOptions,
      gesturesEnabled: params && !!params.gesturesEnabled
    };
  };

  constructor(props) {
    super(props);
    this.store = props.cartStore;
    this.state = {
      backgroundPosition: 0,
      isProcessing: false,
      wasSuccessful: props.navigation.state.params.wasSuccessful
    };

    // bindings
    this.onBack = this.onBack.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  UNSAFE_componentWillReceiveProps(next) {
    if (
      next.navigation.state.params.wasSuccessful !== this.state.wasSuccessful &&
      next.navigation.state.params.wasSuccessful !==
        this.props.navigation.state.params.wasSuccessful
    ) {
      this.setState({
        wasSuccessful: next.navigation.state.params.wasSuccessful
      });
    }
  }

  UNSAFE_componentWillMount() {
    this.store.hide();
  }

  componentDidMount() {
    this.store.onShowSummary();
  }

  onBack(showCart) {
    this.store.show();

    // and show the cart if coming back from cancelling
    showCart && this.store.toggle(true);
    this.props.navigation.goBack();
  }

  onConfirm() {
    // timeout to allow animations show through even
    // if payment takes less time
    setTimeout(() =>
      this.store.finalize({}).then(
        wasSuccessful =>
          this.setState(
            {
              // change to true to demo success page
              wasSuccessful: wasSuccessful,
              isProcessing: false
            },
            () => {
              this.refs.exploder && this.refs.exploder.reset();
              this.refs.content.scrollTo({ y: 0 });
            }
          ),
        1000
      )
    );
  }

  get renderDetails() {
    return (
      <Animatable.View animation="slideInUp" duration={300}>
        <TearLines
          ref="topTearLine"
          backgroundColor={Colours.Background}
          style={{
            marginTop: this.state.backgroundPosition + Sizes.OuterFrame
          }}
        />
        <View
          onLayout={e => {
            this.refs.topTearLine.onLayout(e);
            this.refs.bottomTearLine.onLayout(e);
          }}
          style={styles.detailsContainer}
        >
          <View style={styles.detailsHeader}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={logo} />
            </View>
            <Text style={styles.detailsText}>
              {`Shipping to ${this.props.navigation.state.params.customerName ||
                "Somebody"}`}
            </Text>
            <Text style={styles.detailsText}>
              {this.props.navigation.state.params.shippingDetails.address +
                (this.props.navigation.state.params.shippingDetails.addressOpt
                  ? `, ${
                      this.props.navigation.state.params.shippingDetails
                        .addressOpt
                    }`
                  : "")}
            </Text>
            <Text style={styles.detailsText}>
              {(this.props.navigation.state.params.shippingDetails.city
                ? `${this.props.navigation.state.params.shippingDetails.city}, `
                : "") +
                this.props.navigation.state.params.shippingDetails.province ||
                this.props.navigation.state.params.shippingDetails.region +
                  (this.props.navigation.state.params.shippingDetails.zip
                    ? ` ${
                        this.props.navigation.state.params.shippingDetails.zip
                      }`
                    : "")}
            </Text>
            <Text style={styles.detailsText}>
              {this.props.navigation.state.params.shippingDetails.country}
            </Text>
            <Text
              style={[
                Styles.TopSpacing,
                styles.detailsText,
                styles.detailsTitle
              ]}
            >
              via Standard
            </Text>
            {!!this.props.navigation.state.params.shippingExpectation && (
              <Text style={[styles.detailsText, styles.detailsTitle]}>
                {this.props.navigation.state.params.shippingExpectation.toLowerCase()}
              </Text>
            )}
          </View>
          <View style={Styles.Divider} />
          {this.props.navigation.state.params.cart &&
            this.props.navigation.state.params.cart.items &&
            this.props.navigation.state.params.cart.items.length > 0 &&
            this.props.navigation.state.params.cart.items.map(item => (
              <View key={`item-${item.id}`} style={styles.detailsItem}>
                <Text style={styles.detailsText}>1 x</Text>
                <View style={styles.detailsItemTitle}>
                  <Text style={[styles.detailsText, styles.detailsTitle]}>
                    {item.product.title && item.product.title.toLowerCase()}
                  </Text>
                  <Text style={[styles.detailsText, styles.detailsOptions]}>
                    {item.variant &&
                      item.variant.description &&
                      item.variant.description.toLowerCase()}
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
              style={[styles.detailsText, styles.detailsItemTitle]}
            >
              subtotal
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.props.navigation.state.params.amountSubtotal.toFixed(
                2
              )}`}
            </Text>
          </View>
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}
            >
              taxes
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.props.navigation.state.params.amountTaxes.toFixed(2)}`}
            </Text>
          </View>
          {this.store.amountDiscount > 0 && (
            <View style={styles.detailsItem}>
              <UppercasedText
                style={[styles.detailsText, styles.detailsItemTitle]}
              >
                discounts
              </UppercasedText>
              <Text style={[styles.detailsText, styles.detailsTitle]}>
                {`($${this.props.navigation.state.params.amountDiscount.toFixed(
                  2
                )})`}
              </Text>
            </View>
          )}
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[styles.detailsText, styles.detailsItemTitle]}
            >
              shipping
            </UppercasedText>
            <Text style={styles.detailsText}>
              {`$${this.props.navigation.state.params.amountShipping.toFixed(
                2
              )}`}
            </Text>
          </View>
          <View style={styles.detailsItem}>
            <UppercasedText
              style={[
                styles.detailsText,
                styles.detailsItemTitle,
                styles.detailsTitle
              ]}
            >
              grand total
            </UppercasedText>
            <Text style={[styles.detailsText, styles.detailsTitle]}>
              {`$${this.props.navigation.state.params.amountTotal.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.logoContainer, styles.thankYou]}>
            <Text style={styles.detailsText}>Thank you!</Text>
            <Text style={Styles.Text}>🙏</Text>
          </View>
        </View>
        <TearLines
          isUnder
          ref="bottomTearLine"
          backgroundColor={Colours.Background}
          style={{ marginBottom: Sizes.OuterFrame * 2 }}
        />
      </Animatable.View>
    );
  }

  get renderLogin() {
    return (
      <View style={styles.login}>
        <TouchableOpacity onPress={() => this.onBack()}>
          <View style={[Styles.RoundedButton, styles.paymentButton]}>
            <UppercasedText style={styles.paymentButtonLabel}>
              Continue Shopping
            </UppercasedText>
          </View>
        </TouchableOpacity>
      </View>
    );
    // return (
    //   <View style={styles.login}>
    //     <View style={[Styles.RoundedButton, styles.socialButton]}>
    //       <FontAwesomeIcon
    //         name="facebook-square"
    //         color={Colours.AlternateText}
    //         size={Sizes.Text} />
    //       <UppercasedText style={styles.socialButtonLabel}>
    //         Login with Facebook
    //       </UppercasedText>
    //     </View>
    //     <Text style={styles.loginManual}>
    //       .. or login via email
    //     </Text>
    //   </View>
    // );
  }

  get renderSummary() {
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.confirmContainer}>
          <Animatable.View animation="fadeInRight" duration={300} delay={200}>
            <Text style={styles.paymentHeader}>
              {this.state.wasSuccessful
                ? // TODO: registration nagging
                  // ? "login to save this receipt to your account"
                  "We've saved this receipt to your account for order tracking"
                : `On order confirmation, $${this.props.navigation.state.params.amountTotal.toFixed(
                    2
                  )} will be charged to`}
            </Text>
          </Animatable.View>
          {this.state.wasSuccessful ? (
            <Animatable.View
              animation="fadeInRight"
              duration={300}
              delay={500}
              style={styles.loginContainer}
            >
              {this.renderLogin}
            </Animatable.View>
          ) : (
            <Animatable.View
              animation="fadeInRight"
              duration={300}
              delay={500}
              style={styles.paymentContainer}
            >
              <FontAwesomeIcon
                name={this.props.navigation.state.params.paymentType}
                size={Sizes.OuterFrame}
                color={Colours.AlternateText}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentLabel}>
                {`xxxx xxxx xxxx ${
                  this.props.navigation.state.params.paymentLastFour
                }`}
              </Text>
              <ExplodingButton
                ref="exploder"
                color={Colours.PositiveButton}
                navigation={this.props.navigation}
                onPress={() =>
                  this.setState(
                    {
                      isProcessing: true
                    },
                    this.onConfirm
                  )
                }
              >
                <View style={[Styles.RoundedButton, styles.paymentButton]}>
                  <UppercasedText style={styles.paymentButtonLabel}>
                    Confirm Payment
                  </UppercasedText>
                </View>
              </ExplodingButton>
            </Animatable.View>
          )}
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
        style={styles.overlay}
      >
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
          iterationCount="infinite"
        >
          <Text style={styles.overlayIcon}>💸</Text>
        </Animatable.View>
      </Animatable.View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          title="Purchase Confirmation"
          iconType="close"
          backAction={
            this.state.wasSuccessful ? false : () => this.onBack(true)
          }
          backColor={Colours.Text}
          background={
            <View
              onLayout={e =>
                this.setState({
                  // pushes content under the end of background dynamically
                  backgroundPosition:
                    e.nativeEvent.layout.y + e.nativeEvent.layout.height
                })
              }
              style={styles.background}
            >
              {this.state.wasSuccessful != null && (
                <View style={styles.resultIconContainer}>
                  <Animatable.View
                    animation="bounce"
                    duration={300}
                    delay={300}
                  >
                    <FontAwesomeIcon
                      name={
                        this.state.wasSuccessful
                          ? "check-circle"
                          : "times-circle"
                      }
                      color={
                        this.state.wasSuccessful
                          ? Colours.Success
                          : Colours.Fail
                      }
                      size={Sizes.Avatar}
                      style={styles.resultIcon}
                    />
                  </Animatable.View>
                </View>
              )}
              <Text style={styles.title}>
                {this.state.wasSuccessful != null
                  ? this.state.wasSuccessful
                    ? "Thank you!"
                    : "Something went wrong"
                  : "Lets confirm your order"}
              </Text>
              <Text style={styles.subtitle}>
                {this.state.wasSuccessful != null
                  ? this.state.wasSuccessful
                    ? "Your payment was processed successfully by the merchant and will be delivered out shortly. We've also sent you an email confirmation for record keeping."
                    : `We couldn't process your selected payment method ending in ${
                        this.store.paymentLastFour
                      }. Please either try again, or go back and use a different payment method.`
                  : "Your order will be immediately dispatched to the merchant for processing as soon as this screen is confirmed by you."}
              </Text>
            </View>
          }
        >
          <ScrollView
            ref="content"
            contentContainerStyle={styles.itemsContainer}
            scrollEventThrottle={16}
            onScroll={event => this.refs.container.onScroll(event)}
          >
            {this.renderDetails}
          </ScrollView>
          <LinearGradient
            colors={[Colours.Background, Colours.Transparent]}
            start={{ y: 1 }}
            end={{ y: 0 }}
            style={styles.gradient}
          />
        </ContentCoverSlider>
        {this.renderSummary}
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

  gradient: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
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
    marginVertical: Sizes.InnerFrame / 2,
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

  paymentButton: {
    marginVertical: Sizes.InnerFrame
  },

  paymentButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.Transparent
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

  loginContainer: {
    alignItems: "center",
    alignSelf: "center"
  },

  login: {
    alignItems: "center",
    marginTop: Sizes.InnerFrame,
    marginHorizontal: Sizes.OuterFrame
  },

  // loginManual: {
  //   ...Styles.Text,
  //   ...Styles.Terminal,
  //   ...Styles.Emphasized,
  //   ...Styles.Underlined,
  //   ...Styles.Alternate,
  //   marginTop: Sizes.InnerFrame / 2
  // },
  //
  // socialButton: {
  //   backgroundColor: Colours.Facebook,
  //   marginTop: null
  // },

  socialButtonLabel: {
    ...Styles.Text,
    ...Styles.Modern,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginLeft: Sizes.InnerFrame
  }
});
