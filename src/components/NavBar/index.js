import React from "react";
import { StyleSheet, View } from "react-native";
import { Sizes, Colours } from "localyyz/constants";
import { withNavigation } from "react-navigation";

// custom
import { Cart, CartHeaderSummary } from "localyyz/components";
import Pullup from "./components/Pullup";
import TabBar from "./components/TabBar";
import CartUIStore from "./cartUiStore";
import { onlyIfLoggedIn } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { inject, observer, Provider } from "mobx-react";

// offset tabbar
export const NAVBAR_HEIGHT
  = Sizes.InnerFrame * 2
  + Sizes.SmallText
  + Sizes.InnerFrame / 2
  + Sizes.IconButton
  + (ifIphoneX() ? Sizes.InnerFrame : 0);

@inject(stores => ({
  userStore: stores.userStore,
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
    isVisible: PropTypes.bool,
    isPullupVisible: PropTypes.bool
  };

  static defaultProps = {
    isVisible: true,
    isPullupVisible: false
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
          pointerEvents="box-none"
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
          <TabBar
            onPress={this.onPress}
            activeButton={this.state.activeButton}/>
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
    right: 0,
    top: 0
  }
});
