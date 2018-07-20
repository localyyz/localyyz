import React from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import Button from "./Button";
import { onlyIfLoggedIn } from "localyyz/helpers";
import { IS_DEALS_SUPPORTED } from "localyyz/constants";

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
    return (
      <View style={styles.container} pointerEvents="auto">
        <Animatable.View
          animation={this.isVisible ? "slideInUp" : "slideOutDown"}
          duration={200}
          delay={400}
          style={[
            styles.bar,
            this.props.activeButton === "deals" && styles.deals
          ]}>
          <View style={styles.buttons}>
            <Button
              icon="hanger"
              label="Shop"
              isActive={this.props.activeButton !== "cart"}
              color={
                this.props.activeButton === "deals"
                  ? Colours.AlternateText
                  : null
              }
              onPress={() =>
                this.props.onPress("home", () => {
                  this.props.navigation.navigate("Root");
                })
              }/>
            {IS_DEALS_SUPPORTED ? (
              <Button
                fontAwesome
                icon="bolt"
                label="#DOTD"
                isActive={this.props.activeButton !== "cart"}
                color={
                  this.props.activeButton === "deals"
                    ? Colours.AlternateText
                    : null
                }
                onPress={() =>
                  this.props.onPress("deals", () => {
                    this.props.navigation.navigate("Deals");
                  })
                }/>
            ) : null}
            <Button
              isActive
              entypo
              icon="shopping-basket"
              label="Cart"
              badge={this.props.numItems > 0 ? `${this.props.numItems}` : null}
              color={
                this.props.activeButton === "deals"
                  ? Colours.AlternateText
                  : null
              }
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
              material
              icon="more-horiz"
              label="Settings"
              isActive={this.props.activeButton !== "cart"}
              color={
                this.props.activeButton === "deals"
                  ? Colours.AlternateText
                  : null
              }
              onPress={() =>
                this.props.onPress("settings", () => {
                  this.props.navigation.navigate("Settings");
                })
              }/>
          </View>
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
    alignItems: "center",
    paddingHorizontal: Sizes.Width / 14
  }
});
