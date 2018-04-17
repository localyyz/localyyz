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
            color={Colours.Text}/>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.InnerFrame
  },

  callToAction: {
    ...Styles.Horizontal,
    paddingBottom: Sizes.InnerFrame / 4,
    borderBottomWidth: 1,
    borderBottomColor: Colours.Text
  },

  callToActionLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Medium,
    marginRight: Sizes.InnerFrame / 2
  }
});
