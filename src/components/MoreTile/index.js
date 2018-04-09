import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default class MoreTile extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.container, styles.tile]}>
        <View style={styles.callToAction}>
          <Text style={styles.callToActionLabel}>
            {this.props.label || "check more out"}
          </Text>
          <MaterialCommunityIcon
            name="arrow-right"
            size={Sizes.Text}
            color={Colours.AlternateText}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Sizes.OuterFrame
  },

  tile: {
    backgroundColor: Colours.MenuBackground,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    paddingBottom: null
  },

  callToAction: {
    ...Styles.Horizontal,
    paddingBottom: Sizes.InnerFrame / 3,
    borderBottomWidth: 0.5,
    borderBottomColor: Colours.AlternateText
  },

  callToActionLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate,
    marginRight: Sizes.InnerFrame / 2
  }
});
