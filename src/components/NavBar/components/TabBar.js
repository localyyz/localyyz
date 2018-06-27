import React from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import Button from "./Button";
import { changeTab, onlyIfLoggedIn } from "localyyz/helpers";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  hasSession: stores.userStore.model.hasSession,
  isVisible: stores.navbarStore.isVisible,
  numItems: stores.cartStore.numItems,
  togglePullup: visible => stores.navbarStore.togglePullup(visible)
}))
@withNavigation
@observer
export default class TabBar extends React.Component {
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
    return (
      <View style={styles.container} pointerEvents="auto">
        <Animatable.View
          animation={this.isVisible ? "slideInUp" : "slideOutDown"}
          duration={200}
          delay={400}
          style={styles.bar}>
          <View style={styles.buttons}>
            <Button
              icon="hanger"
              label="Shop"
              isActive={this.props.activeButton !== "cart"}
              onPress={() =>
                this.props.onPress("home", () => {
                  this.props.navigation.dispatch(
                    changeTab("Root", { reset: true })
                  );
                })
              }/>
            <Button
              icon="history"
              label="History"
              isActive={this.props.activeButton !== "cart"}
              onPress={() =>
                this.props.onPress("history", () => {
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
                    this.props.onPress(
                      "cart",
                      this.props.togglePullup,
                      false,
                      true
                    ),
                  this.props.navigation
                )
              }/>
            <Button
              icon="settings"
              label="Settings"
              isActive={this.props.activeButton !== "cart"}
              onPress={() =>
                this.props.onPress("settings", () => {
                  this.props.navigation.dispatch(changeTab("Settings"));
                })
              }/>
          </View>
        </Animatable.View>
      </View>
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
    paddingBottom: Sizes.ScreenBottom,
    backgroundColor: Colours.Foreground
  },

  buttons: {
    ...Styles.EqualColumns,
    alignItems: "center",
    paddingHorizontal: Sizes.Width / 10
  }
});
