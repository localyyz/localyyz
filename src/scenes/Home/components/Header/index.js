import React from "react";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableWithoutFeedback
} from "react-native";

// third party
import { withNavigation } from "react-navigation";
import { inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { navLogo } from "localyyz/assets";

// constants
const START_FADE_DISTANCE = 0;
const END_FADE_DISTANCE = Sizes.Height / 5;
const FADE_DISTANCE = [START_FADE_DISTANCE, END_FADE_DISTANCE];

@inject(stores => ({
  // layout
  scrollAnimate: stores.homeStore.scrollAnimate,
  homeStore: stores.homeStore
}))
class Header extends React.Component {
  constructor(props) {
    super(props);

    // refs
    this.inputRef = React.createRef();

    // bindings
    this.renderIdle = this.renderIdle.bind(this);
  }

  renderIdle() {
    return (
      <View style={styles.idleContainer}>
        <Animatable.View animation="fadeInDown" duration={800} delay={200}>
          <Animated.Image
            style={[
              styles.logo,
              {
                tintColor: this.props.scrollAnimate.interpolate({
                  inputRange: FADE_DISTANCE,
                  outputRange: [Colours.Text, Colours.AlternateText],
                  extrapolate: "clamp"
                })
              }
            ]}
            source={navLogo}/>
        </Animatable.View>
      </View>
    );
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: this.props.scrollAnimate.interpolate({
              inputRange: FADE_DISTANCE,
              outputRange: [Colours.Transparent, Colours.MenuBackground],
              extrapolate: "clamp"
            })
          }
        ]}>
        <StatusBar barStyle="light-content" />
        <Animated.View
          style={[
            styles.search,
            {
              backgroundColor: this.props.scrollAnimate.interpolate({
                inputRange: FADE_DISTANCE,
                outputRange: [Colours.WhiteTransparent, Colours.Highlight],
                extrapolate: "clamp"
              })
            }
          ]}>
          {this.renderIdle()}
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
    right: 0,
    backgroundColor: Colours.MenuBackground
  },

  search: {
    margin: Sizes.InnerFrame,
    marginTop: Sizes.ScreenTop,
    height: Sizes.InnerFrame * 2.5,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    overflow: "hidden"
  },

  idleContainer: {
    ...Styles.Horizontal,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  searchLabelContainer: {
    position: "absolute",
    left: Sizes.InnerFrame / 2,
    top: 2,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },

  searchLabel: {
    ...Styles.Text,
    ...Styles.Subdued,
    ...Styles.TinyText
  },

  logo: {
    height: 13,
    width: 90,
    tintColor: Colours.AlternateText
  }
});
