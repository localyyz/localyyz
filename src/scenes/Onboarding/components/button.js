import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated
} from "react-native";

import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";

// constants
export const BUTTON_PADDING = 5;
const WIDTH = Sizes.Width / 2 - BUTTON_PADDING;
const HEIGHT = 2 * Sizes.Width / 5;
const ANIMATION_DURATION = 100;

class Heart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(0.91)
    };
  }

  componentDidMount() {
    Animated.spring(this.state.scale, {
      toValue: 1,
      velocity: 5,
      bounciness: 1
    }).start();
  }

  render() {
    return (
      <Animated.View style={[{ transform: [{ scale: this.state.scale }] }]}>
        <EntypoIcon
          color={Colours.Foreground}
          name="heart"
          size={Sizes.SocialButton}/>
      </Animated.View>
    );
  }
}

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      delay: this.props.batchIdx * ANIMATION_DURATION
    }).start();
  }

  render() {
    const animatedTransform = [{ opacity: this._animated }];

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
        <Animated.View style={[styles.container, animatedTransform]}>
          <ImageBackground
            source={{ uri: this.props.imageUrl }}
            resizeMode="cover"
            style={styles.photo}>
            <View
              style={[
                styles.overlay,
                this.props.selected
                  ? { backgroundColor: "rgba(0, 0, 0, 1)" }
                  : {}
              ]}>
              {this.props.selected ? <Heart /> : null}
            </View>
            <View style={styles.labelBackground}>
              <Text numberOfLines={2} style={styles.label}>
                {this.props.label}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "flex-end"
  },

  photo: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: "pink",
    overflow: "hidden",
    borderWidth: Sizes.Hairline,
    borderColor: Colours.Border
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center",
    color: "white"
  },

  labelBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: WIDTH / 6
  }
});
