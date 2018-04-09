import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { withNavigation } from "react-navigation";

// custom
import { Cart, CartHeaderSummary, UppercasedText } from "localyyz/components";
import { changeTab } from "localyyz/helpers";
import Pullup, { PULLUP_LOW_SPAN } from "./components/Pullup";
import { onlyIfLoggedIn } from "localyyz/helpers";

// third party
import * as Animatable from "react-native-animatable";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { inject, observer } from "mobx-react";

// custom animation
Animatable.initializeRegistryWithDefinitions({
  checkoutSlide: {
    from: {
      width: 0
    },
    to: {
      width: 110
    }
  }
});

// offset tabbar
export const NAVBAR_HEIGHT =
  Sizes.InnerFrame * 2 +
  Sizes.SmallText +
  Sizes.InnerFrame / 2 +
  Sizes.IconButton +
  (ifIphoneX() ? Sizes.InnerFrame : 0);

@inject("cartStore", "userStore")
@withNavigation
@observer
export default class NavBar extends React.Component {
  static HEIGHT = NAVBAR_HEIGHT;

  constructor(props) {
    super(props);
    this.state = {
      // highlight active button
      activeButton: null
    };

    // bindings
    this.onSnap = this.onSnap.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onPullupOpen = this.onPullupOpen.bind(this);
    this.onPullupClose = this.onPullupClose.bind(this);

    // stores
    this.store = this.props.cartStore;
  }

  componentDidMount() {
    onlyIfLoggedIn(this.props.userStore, () => this.props.cartStore.fetch());
  }

  onSnap(snapHeight) {
    if (snapHeight === PULLUP_LOW_SPAN) {
      this.setState(
        {
          isCartItemsVisible: true
        },
        () => this.refs.pullup.content.scrollTo({ y: 0 })
      );
    }
  }

  onPullupOpen() {}

  onPullupClose() {
    this.setState({
      activeButton: null
    });
  }

  onPress(button, callback, closePullup = true) {
    const isPullupVisible = this.store.isPullupVisible;
    this.setState(
      {
        activeButton: this.state.activeButton === button ? null : button
      },
      () => {
        // close the cart if it was previously open
        if (isPullupVisible && closePullup) {
          this.store.toggle(false);
        }

        // trigger given callback
        callback && callback();
      }
    );

    // chaining
    return true;
  }

  get cart() {
    return this.refs.cart ? this.refs.cart.wrappedInstance : null;
  }

  render() {
    return (
      this.store.isVisible && (
        <Animatable.View
          animation={this.store.isVisible ? "fadeIn" : "fadeOut"}
          duration={200}
          delay={300}
          style={styles.container}>
          <Pullup
            ref="pullup"
            isVisible={this.store.isPullupVisible}
            navBarHeight={NAVBAR_HEIGHT}
            onSnap={this.onSnap}
            onOpen={this.onPullupOpen}
            onClose={this.onPullupClose}
            onPull={height => {
              this.cart && this.cart.items && this.cart.items.forceUpdate();
              this.cart.paymentMethods &&
                this.cart.paymentMethods.toggle(false);
              this.cart.addresses && this.cart.addresses.toggle(false);
            }}
            toggle={this.store.toggle}
            renderHeader={
              <CartHeaderSummary
                isReady={() => !!this.cart && this.cart.isReady()}
                onCheckout={() => this.cart.onCheckout()}
                toggleCartItems={() => this.cart.toggleCartItems()}
              />
            }>
            <Cart
              ref="cart"
              navigation={this.props.navigation}
              onCheckout={this.onPress}
              getHeight={() =>
                (this.refs.pullup && this.refs.pullup.height) || 0}
              snap={(height, onlyGrow) =>
                this.refs.pullup.snap(height, onlyGrow)}
            />
          </Pullup>
          <Animatable.View
            animation={this.store.isVisible ? "slideInUp" : "slideOutDown"}
            duration={200}
            delay={400}
            style={[Styles.EqualColumns, styles.bar]}>
            <TouchableOpacity
              onPress={() =>
                this.onPress("home", () => {
                  this.props.navigation.dispatch(
                    changeTab("Root", { reset: true })
                  );
                })}>
              <View
                hitSlop={{
                  top: Sizes.InnerFrame,
                  bottom: Sizes.InnerFrame,
                  left: Sizes.InnerFrame,
                  right: Sizes.InnerFrame
                }}
                style={styles.button}>
                <MaterialCommunityIcon
                  name="hanger"
                  size={Sizes.IconButton}
                  color={
                    this.state.activeButton === "cart"
                      ? Colours.SubduedText
                      : Colours.MenuBackground
                  }
                />
                <UppercasedText style={styles.buttonLabel}>Shop</UppercasedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.onPress("history", () => {
                  this.props.navigation.dispatch(changeTab("History"));
                })}>
              <View
                hitSlop={{
                  top: Sizes.InnerFrame,
                  bottom: Sizes.InnerFrame,
                  left: Sizes.InnerFrame,
                  right: Sizes.InnerFrame
                }}
                style={styles.button}>
                <MaterialCommunityIcon
                  name="history"
                  size={Sizes.IconButton}
                  color={
                    this.state.activeButton === "cart"
                      ? Colours.SubduedText
                      : Colours.MenuBackground
                  }
                />
                <UppercasedText style={styles.buttonLabel}>
                  History
                </UppercasedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onlyIfLoggedIn(
                  this.props.userStore,
                  () => this.onPress("cart", this.store.toggle, false),
                  this.props.navigation
                )}>
              <View
                hitSlop={{
                  top: Sizes.InnerFrame,
                  bottom: Sizes.InnerFrame,
                  left: Sizes.InnerFrame,
                  right: Sizes.InnerFrame
                }}
                style={styles.button}>
                <EntypoIcon
                  name="shopping-basket"
                  size={Sizes.IconButton}
                  color={Colours.MenuBackground}
                />
                <UppercasedText style={styles.buttonLabel}>Cart</UppercasedText>
                {this.store &&
                  this.store.numItems > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeLabel}>
                        {this.store.numItems}
                      </Text>
                    </View>
                  )}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0
  },

  bar: {
    alignItems: "center",
    paddingHorizontal: Sizes.OuterFrame * 2,
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
    ...ifIphoneX({
      paddingBottom: Sizes.InnerFrame * 2
    })
  },

  button: {
    alignItems: "center",
    justifyContent: "center"
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.TinyText,
    marginTop: Sizes.InnerFrame / 6
  },

  badge: {
    backgroundColor: Colours.Secondary,
    borderRadius: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 6,
    paddingHorizontal: Sizes.InnerFrame / 2,
    position: "absolute",
    right: -Sizes.InnerFrame / 2,
    bottom: Sizes.InnerFrame * 2 / 3
  },

  badgeLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText,
    ...Styles.Alternate
  }
});
