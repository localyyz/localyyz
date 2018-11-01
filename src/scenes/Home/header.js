import React from "react";
import { Animated, View, StyleSheet } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { navLogo } from "localyyz/assets";

// constants
const START_FADE_DISTANCE = 0;
const END_FADE_DISTANCE = Sizes.Height / 5;
const FADE_DISTANCE = [START_FADE_DISTANCE, END_FADE_DISTANCE];

@inject(stores => ({
  scrollAnimate: stores.homeStore.scrollAnimate
}))
@observer
export class Header extends React.Component {
  render() {
    const opacityAnimate = this.props.scrollAnimate.interpolate({
      inputRange: [0, END_FADE_DISTANCE / 4, END_FADE_DISTANCE],
      outputRange: [1, 0.3, 0],
      extrapolate: "clamp"
    });
    const translateAnimate = this.props.scrollAnimate.interpolate({
      inputRange: FADE_DISTANCE,
      outputRange: [0, -END_FADE_DISTANCE],
      extrapolate: "clamp"
    });
    const heightAnimate = this.props.scrollAnimate.interpolate({
      inputRange: FADE_DISTANCE,
      outputRange: [Sizes.InnerFrame * 2, 0],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          styles.container,
          { height: heightAnimate },
          { transform: [{ translateY: translateAnimate }] },
          { opacity: opacityAnimate }
        ]}>
        <View style={styles.idleContainer}>
          <Animatable.View animation="fadeInDown" duration={800} delay={200}>
            <Animated.Image style={[styles.logo]} source={navLogo} />
          </Animatable.View>
        </View>
      </Animated.View>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  container: {},

  idleContainer: {
    paddingTop: Sizes.InnerFrame,
    alignItems: "center",
    justifyContent: "center"
  },

  logo: {
    height: 13,
    width: 90,
    tintColor: Colours.Text
  }
});
