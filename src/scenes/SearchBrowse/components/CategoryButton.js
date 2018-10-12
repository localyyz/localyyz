import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";

// constants
export const BUTTON_PADDING = 5;
const WIDTH = Sizes.Width / 2 - BUTTON_PADDING - BUTTON_PADDING / 2;
const HEIGHT = 2 * Sizes.Width / 5;
const SMALL_WIDTH = Sizes.Width / 3;
const SMALL_HEIGHT = Sizes.Width / 6;
const SMALL_RIGHT_MARGIN = Sizes.InnerFrame / 4;

export default class CategoryButton extends React.Component {
  render() {
    const imageStyle = StyleSheet.flatten([
      styles.photo,
      this.props.isSmall && styles.small
    ]);

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
        <View style={styles.container}>
          <ImageBackground
            source={{ uri: this.props.imageUrl }}
            style={imageStyle}>
            <View style={styles.overlay} />
            <View style={styles.labelBackground}>
              <Text numberOfLines={2} style={[styles.label, styles.labelLarge]}>
                {this.props.title}
              </Text>
            </View>
          </ImageBackground>
          {this.props.isSmall ? (
            <View style={{ width: SMALL_WIDTH }}>
              <Text numberOfLines={1} style={[styles.label, styles.labelSmall]}>
                {this.props.title}
              </Text>
            </View>
          ) : null}
        </View>
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
    opacity: 0.5,
    backgroundColor: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },

  photo: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: Colours.MenuBackground,
    overflow: "hidden",
    borderWidth: Sizes.Hairline,
    borderColor: Colours.Border
  },

  small: {
    height: SMALL_HEIGHT,
    width: SMALL_WIDTH,
    marginRight: SMALL_RIGHT_MARGIN,
    borderRadius: 10
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center"
  },

  labelSmall: {
    flex: 1,
    fontSize: Sizes.TinyText
  },

  labelLarge: {
    color: "white",
    textAlign: "center"
  },

  labelBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: WIDTH / 6
  }
});
