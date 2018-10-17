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
import ProgressiveImage from "~/src/components/ProgressiveImage";

// constants
const WIDTH = Sizes.Width / 3;
const HEIGHT = Sizes.Width / 4;
export const BUTTON_HEIGHT = HEIGHT + Sizes.InnerFrame;

export default class CategoryButton extends React.Component {
  render() {
    const isSelected
      = this.props.selected && this.props.selected.id === this.props.id;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
        <View style={styles.container}>
          <ProgressiveImage
            source={{ uri: this.props.imageUrl }}
            style={styles.photo}/>
          <View style={{ width: WIDTH }}>
            <Text
              numberOfLines={1}
              style={[styles.label, isSelected ? styles.selected : {}]}>
              {this.props.title}
            </Text>
          </View>
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

  photo: {
    width: WIDTH,
    height: HEIGHT,
    overflow: "hidden",
    borderWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    marginRight: Sizes.InnerFrame / 4,
    borderRadius: 10
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center",
    fontSize: Sizes.SmallText
  },

  selected: {
    textDecorationLine: "underline",
    fontWeight: "bold"
  }
});
