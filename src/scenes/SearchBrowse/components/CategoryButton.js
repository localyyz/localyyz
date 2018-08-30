import React from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";

import LinearGradient from "react-native-linear-gradient";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// constants
const DEBUG = false;
const DEBUG_PHOTO = "https://picsum.photos/400/?random";
export const WIDTH = 2 * Sizes.Width / 5;
export const HEIGHT = 2 * Sizes.Width / 5;
export const RIGHT_MARGIN = Sizes.InnerFrame / 2;
const SMALL_WIDTH = Sizes.Width / 3;
const SMALL_HEIGHT = Sizes.Width / 6;
const SMALL_RIGHT_MARGIN = Sizes.InnerFrame / 4;

export default class CategoryButton extends React.Component {
  // props:
  // isSelected

  get imageUrl() {
    return this.props.imageUrl || (DEBUG ? DEBUG_PHOTO : "");
  }

  get container() {
    return this.imageUrl ? ImageBackground : View;
  }

  render() {
    return (
      <View style={styles.container}>
        <this.container
          source={{ uri: this.imageUrl }}
          resizeMode="cover"
          style={[styles.photo, this.props.isSmall && styles.small]}>
          <View style={styles.overlay} />
        </this.container>
        <Text
          numberOfLines={this.props.isSmall ? 1 : 2}
          style={[
            styles.label,
            this.props.isSelected ? styles.selected : null
          ]}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: Sizes.InnerFrame / 5,
    overflow: "hidden",
    borderRadius: 10
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: WIDTH,
    height: HEIGHT,
    opacity: 0.5
  },

  photo: {
    width: WIDTH,
    height: HEIGHT,
    marginRight: RIGHT_MARGIN,
    backgroundColor: Colours.MenuBackground,
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: Sizes.Hairline,
    borderColor: Colours.Border
  },

  small: {
    height: SMALL_HEIGHT,
    width: SMALL_WIDTH,
    marginRight: SMALL_RIGHT_MARGIN
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center"
  },

  selected: {
    textDecorationLine: "underline"
  }
});
