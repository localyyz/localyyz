import React from "react";
import { Animated, View, StyleSheet, StatusBar } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { navLogo } from "localyyz/assets";

// constants
const START_FADE_DISTANCE = 0;
const END_FADE_DISTANCE = Sizes.Height / 5;
const FADE_DISTANCE = [START_FADE_DISTANCE, END_FADE_DISTANCE];

@inject(stores => ({
  scrollAnimate: stores.homeStore.scrollAnimate,
  setHeaderHeight: height => {
    stores.homeStore.headerHeight = height;
  }
}))
@observer
export class Header extends React.Component {
  onLayout = ({ nativeEvent: { layout: { height } } }) => {
    this.props.setHeaderHeight(height);
  };

  render() {
    const bkgColorAnimate = this.props.scrollAnimate.interpolate({
      inputRange: FADE_DISTANCE,
      outputRange: ["white", Colours.Transparent],
      extrapolate: "clamp"
    });
    const bkgHeightAnimate = this.props.scrollAnimate.interpolate({
      inputRange: FADE_DISTANCE,
      outputRange: [Sizes.InnerFrame * 2.5, 0],
      extrapolate: "clamp"
    });
    const tintColorAnimate = {
      tintColor: this.props.scrollAnimate.interpolate({
        inputRange: FADE_DISTANCE,
        outputRange: [Colours.Text, Colours.Transparent],
        extrapolate: "clamp"
      })
    };
    return (
      <Animated.View
        onLayout={this.onLayout}
        style={[styles.container, { backgroundColor: bkgColorAnimate }]}>
        <Animated.View
          style={[
            styles.search,
            { backgroundColor: bkgColorAnimate, height: bkgHeightAnimate }
          ]}>
          <View style={styles.idleContainer}>
            <Animatable.View animation="fadeInDown" duration={800} delay={200}>
              <Animated.Image
                style={[styles.logo, tintColorAnimate]}
                source={navLogo}/>
            </Animatable.View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },

  search: {
    marginTop: Sizes.ScreenTop,
    overflow: "hidden"
  },

  idleContainer: {
    ...Styles.Horizontal,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  logo: {
    height: 13,
    width: 90,
    tintColor: Colours.AlternateText
  }
});
