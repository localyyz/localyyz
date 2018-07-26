import React from "react";
import { View, StyleSheet, Text, ImageBackground, Image } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { getCategoryIcon } from "localyyz/assets";

// constants
const DEBUG = false;
const DEBUG_PHOTO = "https://picsum.photos/400/?random";
export const WIDTH = Sizes.Width / 3;
export const HEIGHT = Sizes.Width / 4;
export const RIGHT_MARGIN = Sizes.InnerFrame / 2;
const SMALL_WIDTH = WIDTH;
const SMALL_HEIGHT = Sizes.Width / 11;
const SMALL_RIGHT_MARGIN = Sizes.InnerFrame / 4;

export default class CategoryButton extends React.Component {
  get imageUrl() {
    return this.props.imageUrl || (DEBUG ? DEBUG_PHOTO : "");
  }

  get container() {
    return this.imageUrl ? ImageBackground : View;
  }

  render() {
    let categoryIcon = getCategoryIcon(
      this.props.id && this.props.id.toLowerCase().trim()
    );

    return (
      <this.container
        source={{ uri: this.imageUrl }}
        resizeMode="cover"
        style={[styles.photo, this.props.isSmall && styles.small]}>
        <View style={styles.container}>
          <Text numberOfLines={this.props.isSmall ? 1 : 2} style={styles.label}>
            {this.props.title}
          </Text>
          {categoryIcon && !this.props.isSmall ? (
            <Image
              source={categoryIcon}
              style={this.props.isSmall ? styles.smallIcon : styles.icon}/>
          ) : null}
        </View>
      </this.container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: Sizes.InnerFrame / 2,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },

  photo: {
    width: WIDTH,
    height: HEIGHT,
    marginRight: RIGHT_MARGIN,
    backgroundColor: Colours.MenuBackground
  },

  small: {
    height: SMALL_HEIGHT,
    marginRight: SMALL_RIGHT_MARGIN
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  icon: {
    width: Sizes.OuterFrame,
    height: Sizes.OuterFrame
  },

  smallIcon: {
    width: Sizes.InnerFrame,
    height: Sizes.InnerFrame
  }
});
