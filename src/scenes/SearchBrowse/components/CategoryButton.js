import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import ProgressiveImage from "~/src/components/ProgressiveImage";

// constants
export const BUTTON_PADDING = 5;
const WIDTH = Sizes.Width / 2 - BUTTON_PADDING - BUTTON_PADDING / 2;
const HEIGHT = 2 * Sizes.Width / 5;

export default class CategoryButton extends React.Component {
  shouldCompontUpdate(nextProps) {
    return nextProps.imageUrl !== this.props.imageUrl;
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
        <View style={styles.container}>
          <ProgressiveImage
            source={{ uri: this.props.imageUrl }}
            style={styles.photo}>
            <View style={styles.overlay} />
            <View style={styles.labelBackground}>
              <Text numberOfLines={2} style={styles.label}>
                {this.props.title}
              </Text>
            </View>
          </ProgressiveImage>
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
    opacity: 0.3,
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
