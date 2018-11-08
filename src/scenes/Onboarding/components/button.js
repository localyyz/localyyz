import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated
} from "react-native";

import PropTypes from "prop-types";
import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { capitalize } from "~/src/helpers";
import { Colours, Sizes, Styles } from "~/src/constants";

import { ProgressiveImage } from "~/src/components";

// constants
export const BUTTON_PADDING = 5;
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
  static propTypes = {
    fullWidth: PropTypes.bool
  };

  static defaultProps = {
    fullWidth: false
  };

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
    const componentWidth = this.props.fullWidth ? FULL_WIDTH : HALF_WIDTH;
    const imageStyle = StyleSheet.flatten([
      styles.background,
      {
        width: componentWidth,
        height: this.props.backgroundColor ? HEIGHT * 1.4 : HEIGHT,
        backgroundColor: this.props.backgroundColor
      }
    ]);

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
        <View style={styles.container}>
          <BackgroundComponent
            source={{ uri: this.props.imageUrl }}
            resizeMode="cover"
            style={imageStyle}>
            <View
              style={[
                styles.overlay,
                this.state.selected
                  ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                  : {}
              ]}>
              {this.state.selected ? <Selected /> : null}
            </View>
            <View style={styles.labelBackground}>
              <Text numberOfLines={2} style={styles.label}>
                {capitalize(this.props.label)}
              </Text>
              <Text numberOfLines={4} style={styles.description}>
                {this.props.description}
              </Text>
            </View>
          </BackgroundComponent>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Sizes.InnerFrame / 3,
    overflow: "hidden"
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    paddingBottom: Sizes.InnerFrame
  },

  description: {
    ...Styles.SmallText,
    color: "white"
  },

  labelBackground: {
    flex: 1,
    padding: Sizes.InnerFrame
  }
});
