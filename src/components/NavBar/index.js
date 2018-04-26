import React from "react";
import { StyleSheet } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { withNavigation } from "react-navigation";

// custom
import { Cart, CartHeaderSummary } from "localyyz/components";
import { changeTab } from "localyyz/helpers";
import Pullup from "./components/Pullup";
import Button from "./components/Button";
import CartUIStore from "./cartUiStore";
import { onlyIfLoggedIn } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { inject, observer, Provider } from "mobx-react";

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
export const NAVBAR_HEIGHT
  = Sizes.InnerFrame * 2
  + Sizes.SmallText
  + Sizes.InnerFrame / 2
  + Sizes.IconButton
  + (ifIphoneX() ? Sizes.InnerFrame : 0);

@inject(stores => ({
  userStore: stores.userStore,
  hasSession: stores.userStore.model.hasSession,
  numItems: stores.cartStore.numItems,
  fetch: () => stores.cartStore.fetch(),
  isVisible: stores.navbarStore.isVisible,
  isPullupVisible: stores.navbarStore.isPullupVisible,
  togglePullup: visible => stores.navbarStore.togglePullup(visible)
}))
@withNavigation
@observer
export default class NavBar extends React.Component {
  static HEIGHT = NAVBAR_HEIGHT;
  static propTypes = {
    // mobx injected
    userStore: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    togglePullup: PropTypes.func.isRequired,
    isVisible: PropTypes.bool,
    isPullupVisible: PropTypes.bool,
    numItems: PropTypes.number
  };

  static defaultProps = {
    isVisible: true,
    isPullupVisible: false,
    numItems: null
  };

  constructor(props) {
    super(props);
    this.state = {
      // highlight active button
      activeButton: null
    };

    // bindings
    this.onPress = this.onPress.bind(this);
    this.onPullupClose = this.onPullupClose.bind(this);

    // stores
    this.uiStore = new CartUIStore();
  }

  componentDidMount() {
    onlyIfLoggedIn({ hasSession: this.props.hasSession }, () =>
      this.props.fetch()
    );
  }

  onPullupClose() {
    this.setState({
      activeButton: null
    });
  }

  onPress(button, callback, closePullup = true, toggleable = false) {
    // ensure button pressed is different or toggleable before rerender
    (this.state.activeButton !== button || toggleable)
      && this.setState(
        {
          activeButton: this.state.activeButton === button ? null : button
        },
        // TODO: optimization, callback navigation rerenders
        () => callback && callback()
      );

    // handle closing the cart if previously open and requested close
    if (this.props.isPullupVisible && closePullup) {
      this.props.togglePullup(false);
    }

    // chaining
    return true;
  }

  render() {
    return (
      this.props.isVisible && (
        <Animatable.View
          animation={this.props.isVisible ? "fadeIn" : "fadeOut"}
          duration={200}
          delay={300}
          style={styles.container}>
          <Provider cartUiStore={this.uiStore}>
            <Pullup
              ref="pullup"
              navBarHeight={NAVBAR_HEIGHT}
              onClose={this.onPullupClose}
              header={<CartHeaderSummary />}>
              <Cart onCheckout={this.onPress} />
            </Pullup>
          </Provider>
          <Animatable.View
            animation={this.props.isVisible ? "slideInUp" : "slideOutDown"}
            duration={200}
            delay={400}
            style={[Styles.EqualColumns, styles.bar]}>
            <Button
              icon="hanger"
              label="Shop"
              isActive={this.state.activeButton !== "cart"}
              onPress={() =>
                this.onPress("home", () => {
                  this.props.navigation.dispatch(
                    changeTab("Root", { reset: true })
                  );
                })
              }/>
            <Button
              icon="history"
              label="History"
              isActive={this.state.activeButton !== "cart"}
              onPress={() =>
                this.onPress("history", () => {
                  this.props.navigation.dispatch(changeTab("History"));
                })
              }/>
            <Button
              isActive
              entypo
              icon="shopping-basket"
              label="Cart"
              badge={this.props.numItems > 0 ? `${this.props.numItems}` : null}
              onPress={() =>
                onlyIfLoggedIn(
                  { hasSession: this.props.hasSession },
                  () =>
                    this.onPress("cart", this.props.togglePullup, false, true),
                  this.props.navigation
                )
              }/>
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
  }
});
