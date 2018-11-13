import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from "react-native";

import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { capitalize } from "~/src/helpers";
import { Colours, Sizes, Styles } from "~/src/constants";

import { ProgressiveImage } from "~/src/components";

// constants
export const BUTTON_PADDING = Sizes.InnerFrame / 2;
const HALF_WIDTH = Sizes.Width / 2 - BUTTON_PADDING - BUTTON_PADDING / 2;
const HEIGHT = 2 * Sizes.Width / 5;
const FULL_WIDTH = Sizes.Width - 2 * BUTTON_PADDING;
export const BUTTON_HEIGHT = HEIGHT;
export const BUTTON_WIDTH = HALF_WIDTH;

class Selected extends React.Component {
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
          name="check"
          size={Sizes.SocialButton}/>
      </Animated.View>
    );
  }
}

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    };
  }

  onPress = () => {
    this.setState({ selected: !this.state.selected }, () => {
      this.props.onPress && this.props.onPress();
    });
  };

  render() {
    const BackgroundComponent = this.props.imageUrl ? ProgressiveImage : View;
    const componentWidth = FULL_WIDTH;

    const containerStyle = [
      styles.container,
      {
        width: componentWidth,
        height: HEIGHT
      }
    ];

    const imageStyle = [
      styles.background,
      {
        width: componentWidth,
        height: HEIGHT,
        backgroundColor: this.props.backgroundColor
      }
    ];

    const textStyle = [
      styles.textOverlay,
      {
        maxWidth: componentWidth
      }
    ];

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
        <View style={containerStyle}>
          <BackgroundComponent
            source={{ uri: this.props.imageUrl }}
            resizeMode="cover"
            style={imageStyle}/>
          <View
            style={[
              styles.overlay,
              this.state.selected
                ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                : {}
            ]}>
            {this.state.selected ? <Selected /> : null}
          </View>
          <View style={textStyle}>
            <Text style={styles.label}>{capitalize(this.props.label)}</Text>
            <Text style={styles.description}>{this.props.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  overlay: {
    ...Styles.Overlay,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "flex-end"
  },

  background: {
    overflow: "hidden",
    borderWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    opacity: 0.48
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    color: "white",
    paddingBottom: Sizes.InnerFrame,
    textAlign: "left"
  },

  description: {
    ...Styles.SmallText,
    color: "white",
    textAlign: "left"
  },

  textOverlay: {
    ...Styles.Overlay,
    padding: Sizes.InnerFrame
  }
});
