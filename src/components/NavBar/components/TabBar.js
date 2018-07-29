import React from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import Button from "./Button";
import Notifications from "./Notifications";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  hasSession: stores.userStore.model.hasSession,
  isVisible: stores.navbarStore.isVisible,
  numItems: stores.cartStore.numItems
}))
@observer
export class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardVisible: false
    };
  }

  componentDidMount() {
    // subscribe to keyboard events to hide navbar
    this._keyboardShowUnlistener = Keyboard.addListener("keyboardDidShow", () =>
      this.setState({
        keyboardVisible: true
      })
    );

    // and hider to show navbar
    this._keyboardHideUnlistener = Keyboard.addListener("keyboardDidHide", () =>
      this.setState({
        keyboardVisible: false
      })
    );
  }

  componentWillUnmount() {
    this._keyboardHideUnlistener.remove();
    this._keyboardShowUnlistener.remove();
  }

  get isVisible() {
    return !this.state.keyboardVisible && this.props.isVisible;
  }

  render() {
    const tabs = this.props.tabs.map((t, i) => {
      return React.createElement(Button, {
        ...t,
        badge:
          t.id === "cart"
            ? this.props.numItems > 0 ? `${this.props.numItems}` : null
            : null,
        key: `tab${i}`,
        activeButton: this.props.activeButton,
        onPress: () =>
          this.props.onPress(t.id, () =>
            this.props.navigation.navigate(t.tabKey)
          )
      });
    });

    return (
      <View style={styles.container} pointerEvents="auto">
        {this.props.activeButton !== "cart" ? <Notifications /> : null}
        <Animatable.View
          animation={this.isVisible ? "slideInUp" : "slideOutDown"}
          duration={200}
          style={[
            styles.bar,
            this.props.activeButton === "deals" && styles.deals,
            this.props.height && { height: this.props.height }
          ]}>
          <View style={styles.buttons}>{tabs}</View>
        </Animatable.View>
      </View>
    );
  }
}

export default withNavigation(TabBar);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0
  },

  bar: {
    paddingBottom: Sizes.ScreenBottom,
    backgroundColor: Colours.Foreground
  },

  deals: {
    backgroundColor: Colours.MenuBackground
  },

  buttons: {
    ...Styles.EqualColumns,
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
